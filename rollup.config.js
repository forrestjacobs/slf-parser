import { generate } from "pegjs";
import typescriptPlugin from "rollup-plugin-typescript2";
import typescript from "typescript";

function pegjs(options) {
  return {
    transform(grammar, id) {
      return id.endsWith(".pegjs") ? generate(grammar, { format: "es", output: "source", ...options }) : null;
    },
  };
}

function makePlugins(optimize) {
  return [
    pegjs({ optimize }),
    typescriptPlugin({ typescript }),
  ];
}

const input = "src/index.ts";

export default [
  {
    input,
    output: { file: "dist/test-bundle.js", format: "cjs" },
    plugins: makePlugins("speed"),
  },
  {
    input,
    output: { file: "dist/bundle-cjs.js", format: "cjs" },
    plugins: makePlugins("size"),
  },
  {
    input,
    output: { file: "dist/bundle-es.js", format: "es" },
    plugins: makePlugins("size"),
  },
];
