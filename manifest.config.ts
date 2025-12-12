import pkg from "./package.json" with { type: "jsonc" };

function gitRef() {
  return Bun.spawnSync(["git", "describe", "--always", "--dirty=-dev", "--broken"])
    .stdout.toString()
    .trim()
    .replace(/^v/, "");
}

/**
 * Generates a browser extension manifest.
 * @param debug - Whether to include a version name for debugging.
 *
 * @see https://developer.chrome.com/docs/extensions/reference/manifest
 */
export function createManifest(debug = !process.env.CI): chrome.runtime.ManifestV3 {
  return {
    manifest_version: 3,
    name: "Uppie Lowie",
    description: pkg.description,
    homepage_url: pkg.homepage,
    version: pkg.version,
    // Shippable releases should not have a named version
    version_name: debug ? gitRef() : undefined,
    minimum_chrome_version: "87", // for Intl.Segmenter API
    action: {}, // enable capturing click events from toolbar icon
    permissions: [
      "activeTab", // https://developer.chrome.com/docs/extensions/develop/concepts/activeTab
      "scripting",
    ],
    background: {
      service_worker: "sw.js",
    },
    offline_enabled: true,

    // https://chrome.google.com/webstore/detail/uppie-lowie/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    // key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  };
}
