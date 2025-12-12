/* eslint-disable no-console */

import { createManifest } from "./manifest.config.ts";

const mode = Bun.env.NODE_ENV;
const dev = mode === "development";

console.time("prebuild");
await Bun.$`rm -rf dist`;
console.timeEnd("prebuild");

console.time("manifest");
await Bun.write("dist/manifest.json", JSON.stringify(createManifest()));
console.timeEnd("manifest");

console.time("build:worker");
await Bun.build({
  entrypoints: ["src/sw.ts"],
  outdir: "dist",
  target: "browser",
  minify: !dev,
  sourcemap: dev ? "linked" : "none",
});
console.timeEnd("build:worker");
