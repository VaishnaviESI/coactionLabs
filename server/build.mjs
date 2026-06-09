// esbuild build script — compiles src/server.ts to dist/server.mjs as an ESM bundle.
//
// pg (and its optional native binding pg-native) are kept external so the
// driver loads from server/node_modules at runtime rather than being inlined.
import { build } from "esbuild";

const shared = {
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  sourcemap: true,
  external: ["pg", "pg-native"],
  banner: {
    // Allow CommonJS interop (require / __dirname) inside the ESM bundle.
    js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);",
  },
};

// Main server bundle.
await build({
  ...shared,
  entryPoints: ["src/server.ts"],
  outfile: "dist/server.mjs",
});

// Standalone CLI bundles (migration / seed runners).
await build({
  ...shared,
  entryPoints: ["src/migrate.ts"],
  outfile: "dist/migrate.js",
});

console.log("Built dist/server.mjs, dist/migrate.js");
