/* eslint-disable import/no-extraneous-dependencies, no-console, no-param-reassign */

import esbuild from 'esbuild';
import { decodeUTF8, encodeUTF8, writeFiles } from 'esbuild-minify-templates';
import fs from 'node:fs/promises';
import path from 'node:path';
import manifest from './manifest.config.mjs';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const dir = path.resolve(); // loose alternative to __dirname in node ESM
const release = manifest.version_name || manifest.version;

/** @type {esbuild.Plugin} */
const analyzeMeta = {
  name: 'analyze-meta',
  setup(build) {
    if (!build.initialOptions.metafile) return;

    build.onEnd(
      (result) =>
        // eslint-disable-next-line implicit-arrow-linebreak
        result.metafile && build.esbuild.analyzeMetafile(result.metafile).then(console.log),
    );
  },
};

/** @type {esbuild.Plugin} */
const minifyJS = {
  name: 'minify-js',
  setup(build) {
    if (build.initialOptions.write !== false) return;

    build.onEnd(async (result) => {
      if (result.outputFiles) {
        for (let index = 0; index < result.outputFiles.length; index++) {
          const file = result.outputFiles[index];

          if (path.extname(file.path) !== '.js') return;

          // eslint-disable-next-line no-await-in-loop
          const out = await build.esbuild.transform(decodeUTF8(file.contents), {
            loader: 'js',
            minify: true,
          });

          result.outputFiles[index].contents = encodeUTF8(out.code);
        }
      }
    });
  },
};

// Extension manifest
await fs.writeFile(path.join(dir, 'dist', 'manifest.json'), JSON.stringify(manifest));

// Background service worker
await esbuild.build({
  entryPoints: ['src/index.ts'],
  outfile: 'dist/sw.js',
  platform: 'browser',
  format: 'esm',
  target: ['chrome107'],
  define: {
    'process.env.APP_RELEASE': JSON.stringify(release),
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  plugins: [analyzeMeta, minifyJS, writeFiles()],
  bundle: true,
  minify: !dev,
  sourcemap: dev,
  watch: dev,
  write: dev,
  metafile: !dev && process.stdout.isTTY,
  logLevel: 'debug',
});
