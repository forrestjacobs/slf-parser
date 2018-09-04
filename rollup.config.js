import typescriptPlugin from "rollup-plugin-typescript2";
import typescript from "typescript";

const input = "src/index.ts";
const plugins = [ typescriptPlugin({ typescript }) ];

export default [
  { input, plugins, output: { file: "dist/bundle-cjs.js", format: "cjs" } },
  { input, plugins, output: { file: "dist/bundle-es.js", format: "es" } },
];
