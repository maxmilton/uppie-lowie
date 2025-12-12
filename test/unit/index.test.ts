import { describe, expect, test } from "bun:test";
import { readdir } from "node:fs/promises";

describe("dist files", () => {
  // TODO: Remove the file MIME type checks? Bun infers it from the file
  // extension, not the actual file data, so the usefulness is questionable.

  // NOTE: Files of unknown type (e.g., symlinks) fall back to the default
  // "application/octet-stream". Bun.file() does not resolve symlinks so it's
  // safe to infer that all these files are therefore regular files.
  const distFiles: [filename: string, type: string, minBytes?: number, maxBytes?: number][] = [
    // ["icon16.png", "image/png"],
    // ["icon48.png", "image/png"],
    // ["icon128.png", "image/png"],
    ["manifest.json", "application/json;charset=utf-8"],
    ["sw.js", "text/javascript;charset=utf-8", 300, 500],
  ];

  describe.each(distFiles)("%s", (filename, type, minBytes, maxBytes) => {
    const file = Bun.file(`dist/${filename}`);

    test("exists with correct MIME type", () => {
      expect.assertions(3);
      expect(file.exists()).resolves.toBeTruthy();
      expect(file.size).toBeGreaterThan(0);
      expect(file.type).toBe(type);
    });

    if (typeof minBytes === "number" && typeof maxBytes === "number") {
      test("is within expected file size limits", () => {
        expect.assertions(2);
        expect(file.size).toBeGreaterThan(minBytes);
        expect(file.size).toBeLessThan(maxBytes);
      });
    }
  });

  test("contains no extra files", async () => {
    expect.assertions(1);
    const distDir = await readdir("dist");
    expect(distDir).toHaveLength(distFiles.length);
  });
});
