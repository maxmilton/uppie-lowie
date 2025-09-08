/* eslint-disable no-console */

import { makeManifest } from "./manifest.config.ts";

const mode = Bun.env.NODE_ENV;
const dev = mode === "development";

console.time("prebuild");
await Bun.$`rm -rf dist`;
console.timeEnd("prebuild");

// Extension manifest
console.time("manifest");
await Bun.write("dist/manifest.json", JSON.stringify(makeManifest()));
console.timeEnd("manifest");

// Background service worker script
console.time("build");
const out = await Bun.build({
  entrypoints: ["src/sw.ts"],
  outdir: "dist",
  target: "browser",
  minify: !dev,
});
console.timeEnd("build");
console.log(out);
