import { expect, test } from "bun:test";
import dist from "../../dist/manifest.json" with { type: "json" };
import { createManifest } from "../../manifest.config.ts";

const manifest = createManifest(true);

test("is an object", () => {
  expect.assertions(1);
  expect(manifest).toBeObject();
});

test("is valid JSON", () => {
  expect.assertions(1);
  // eslint-disable-next-line unicorn/prefer-structured-clone
  expect(JSON.parse(JSON.stringify(manifest))).toEqual(manifest);
});

test("is equal to dist/manifest.json (excluding version_name)", () => {
  expect.assertions(1);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { version_name: _vn1, ...restSrc } = manifest;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { version_name: _vn2, ...restDist } = dist as ReturnType<typeof createManifest>;
  expect(restSrc).toEqual(restDist);
});

test("contains expected properties", () => {
  expect.assertions(12);
  expect(manifest).toHaveProperty("manifest_version");
  expect(manifest).toHaveProperty("name");
  expect(manifest).toHaveProperty("description");
  expect(manifest).toHaveProperty("homepage_url");
  expect(manifest).toHaveProperty("version");
  expect(manifest).toHaveProperty("version_name");
  expect(manifest).toHaveProperty("minimum_chrome_version");
  expect(manifest).toHaveProperty("action");
  expect(manifest).toHaveProperty("permissions");
  expect(manifest).toHaveProperty("background");
  expect(manifest).toHaveProperty(["background", "service_worker"]);
  expect(manifest).toHaveProperty("offline_enabled");
  // expect(manifest).toHaveProperty("key");
});

test("properties are the correct type", () => {
  expect.assertions(12);
  expect(manifest.manifest_version).toBeNumber();
  expect(manifest.name).toBeString();
  expect(manifest.description).toBeString();
  expect(manifest.homepage_url).toBeString();
  expect(manifest.version).toBeString();
  expect(manifest.version_name).toBeString();
  expect(manifest.minimum_chrome_version).toBeString();
  expect(manifest.action).toBeObject();
  expect(manifest.permissions).toBeArray();
  expect(manifest.background).toBeObject();
  expect(manifest.background?.service_worker).toBeString();
  expect(manifest.offline_enabled).toBeBoolean();
  // expect(manifest.key).toBeString();
});

test("does not contain any unexpected properties", () => {
  expect.assertions(12);
  const expectedProperties = [
    "manifest_version",
    "name",
    "description",
    "homepage_url",
    "version",
    "version_name",
    "minimum_chrome_version",
    "action",
    "permissions",
    "background",
    "offline_enabled",
    // "key",
  ];
  // eslint-disable-next-line guard-for-in
  for (const property in manifest) {
    expect(expectedProperties).toContain(property);
  }
  expect(Object.keys(manifest)).toHaveLength(expectedProperties.length);
});

test("does not contain any properties for development/debugging", () => {
  expect.assertions(1);
  expect(manifest.options_ui?.open_in_tab).toBeUndefined();
});

test("manifest version is v3", () => {
  expect.assertions(1);
  expect(manifest.manifest_version).toBe(3);
});

test("permissions contains expected values", () => {
  expect.assertions(3);
  expect(manifest.permissions).toContain("activeTab");
  expect(manifest.permissions).toContain("scripting");
  expect(manifest.permissions).toHaveLength(2);
});

test("has correct service_worker value", () => {
  expect.assertions(1);
  expect(manifest.background?.service_worker).toBe("sw.js");
});

test("has version_name when debug option is true", () => {
  expect.assertions(1);
  const manifest2 = createManifest(true);
  expect(manifest2.version_name).toBeDefined();
});

test("does not have version_name when when debug option is false", () => {
  expect.assertions(1);
  const manifest2 = createManifest(false);
  expect(manifest2.version_name).toBeUndefined();
});

// HACK: Mutating env vars that were set before the process started doesn't
// work in bun, so we skip tests which rely on the CI env var _not_ being set.
test.skipIf(!!process.env.CI)("has version_name when CI env var is not set", () => {
  expect.assertions(1);
  const manifest2 = createManifest();
  expect(manifest2.version_name).toBeDefined();
});

const oldCI = process.env.CI;
const restoreCI = () => {
  if (oldCI === undefined) {
    // TODO: Consider setting to undefined instead. Delete does not currently
    // work in bun for env vars that were set before the process started.
    //  ↳ https://github.com/oven-sh/bun/issues/1559#issuecomment-1440507885
    //  ↳ May be fixed, need to investigate; https://github.com/oven-sh/bun/pull/7614
    delete process.env.CI;
  } else {
    process.env.CI = oldCI;
  }
};

test("does not have version_name when env var CI=true", () => {
  expect.assertions(1);
  process.env.CI = "true";
  const manifest2 = createManifest();
  expect(manifest2.version_name).toBeUndefined();
  restoreCI();
});
