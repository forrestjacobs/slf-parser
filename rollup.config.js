import commonjs from "rollup-plugin-commonjs";
import pegjs from "rollup-plugin-pegjs";
import resolve from "rollup-plugin-node-resolve";
import typescript from "typescript";
import typescriptPlugin from "rollup-plugin-typescript2";
import { uglify } from "rollup-plugin-uglify";
import gzip from "rollup-plugin-gzip";

function makePlugins(min) {
  var plugins = [
    resolve(),
    pegjs({
      optimize: min ? "size" : "speed",
      target: "cjs",
    }),
    commonjs({
      extensions: [".js", ".pegjs"],
      namedExports: { "src/parse.pegjs": ["parse"] },
    }),
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
