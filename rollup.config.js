import { generate } from "pegjs";
import gzip from "rollup-plugin-gzip";
import typescriptPlugin from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import typescript from "typescript";

function pegjs(options) {
  return {
    transform(grammar, id) {
      return id.endsWith(".pegjs") ? generate(grammar, { format: "es", output: "source", ...options }) : null;
    },
  };
}

function makePlugins(min) {
  var plugins = [
    pegjs({ optimize: min ? "size" : "speed" }),
    typescriptPlugin({ typescript }),
  ];

  if (min) {
    plugins.push(uglify({
      compress: {
        toplevel: true,
        unsafe: true,
      },
      toplevel: true,
    }));
    plugins.push(gzip());
  }

  return plugins;
}

const input = "src/index.ts";

export default [
  {
    input,
    output: { file: "dist/bundle.js", format: "cjs" },
    plugins: makePlugins(),
  },
  {
    input,
    output: { file: "dist/bundle.min.js", format: "cjs" },
    plugins: makePlugins(true),
  },
];
