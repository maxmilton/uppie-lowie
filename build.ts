/* eslint-disable no-console */

import { makeManifest } from './manifest.config';

const mode = Bun.env.NODE_ENV;
const dev = mode === 'development';

// Extension manifest
await Bun.write('dist/manifest.json', JSON.stringify(makeManifest()));

// Background service worker script
console.time('build');
const out = await Bun.build({
  entrypoints: ['src/sw.ts'],
  outdir: 'dist',
  target: 'browser',
  minify: !dev,
});
console.timeEnd('build');
console.log(out);
