/* eslint-disable import/no-extraneous-dependencies */

// https://developer.chrome.com/docs/extensions/mv3/manifest/
// https://developer.chrome.com/docs/extensions/mv2/manifest/
// https://developer.chrome.com/docs/extensions/reference/
// https://developer.chrome.com/docs/extensions/mv3/devguide/

import { gitRef } from 'git-ref';
import pkg from './package.json' assert { type: 'json' };

/** @type {chrome.runtime.Manifest} */
export default {
  manifest_version: 3,
  name: 'Uppie Lowie',
  description: 'Fun times with text capitalisation.',
  version: pkg.version,
  version_name: process.env.GITHUB_REF ? undefined : gitRef().replace(/^v/, ''),
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
};
