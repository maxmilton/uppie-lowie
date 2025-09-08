import pkg from "./package.json" with { type: "json" };

function gitRef() {
  return Bun.spawnSync(["git", "describe", "--always", "--dirty=-dev", "--broken"])
    .stdout.toString()
    .trim()
    .replace(/^v/, "");
}

// https://developer.chrome.com/docs/extensions/reference/manifest
export const makeManifest = (): chrome.runtime.ManifestV3 => ({
  manifest_version: 3,
  name: "Uppie Lowie",
  description: pkg.description,
  version: pkg.version,
  // Shippable releases should not have a named version
  version_name: process.env.CI ? undefined : gitRef(),
  homepage_url: pkg.homepage,
  action: {},
  permissions: ["activeTab", "scripting"],
  background: {
    service_worker: "sw.js",
  },
  offline_enabled: true,
});
