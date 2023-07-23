// https://developer.chrome.com/docs/extensions/mv3/manifest/
// https://developer.chrome.com/docs/extensions/reference/

import pkg from './package.json' assert { type: 'json' };

function gitRef() {
  return Bun.spawnSync([
    'git',
    'describe',
    '--always',
    '--dirty=-dev',
    '--broken',
  ])
    .stdout.toString()
    .trim()
    .replace(/^v/, '');
}

export const makeManifest = (): chrome.runtime.ManifestV3 => ({
  manifest_version: 3,
  name: 'Uppie Lowie',
  description: pkg.description,
  version: pkg.version,
  // shippable releases should not have a named version
  version_name: process.env.CI ? undefined : gitRef(),
  homepage_url: pkg.homepage,
  action: {},
  permissions: [
    'activeTab', // https://developer.chrome.com/docs/extensions/mv3/manifest/activeTab/
    'scripting',
  ],
  background: {
    service_worker: 'sw.js',
  },
  offline_enabled: true,

  // https://chrome.google.com/webstore/detail/uppie-lowie/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
});
