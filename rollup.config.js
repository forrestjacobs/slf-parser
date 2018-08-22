import { generate } from "pegjs";
import typescriptPlugin from "rollup-plugin-typescript2";
import typescript from "typescript";

function pegjs(options) {
  return {
    transform(grammar, id) {
      if (!id.endsWith(".pegjs")) {
        return null;
      }
      // Generate the parser and remove branches that aren't called
      // This is really messy
      return generate(grammar, { format: "es", output: "source", ...options })
        .replace('if (typeof Error.captureStackTrace === "function")', "if (false)")
        .replace("function peg$parse(input, options)", "function peg$parse(input)")
        .replace("options = options !== undefined ? options : {}", "var options = {}")
        .replace('if ("startRule" in options)', "if (false)")
        .replace("if (invert)", "if (true)")
        .replace('+ (expectation.inverted ? "^" : "") +', '+')
        .replace(/(peg\$classExpectation\(.*), false, false\)/g, "$1)")
        .replace("peg$classExpectation(parts, inverted, ignoreCase)", "peg$classExpectation(parts)")
        .replace(", inverted: inverted, ignoreCase: ignoreCase", "")
        .replace(/(peg\$literalExpectation\(.*), false\)/g, "$1)")
        .replace("peg$literalExpectation(text, ignoreCase)", "peg$literalExpectation(text)")
        .replace(", ignoreCase: ignoreCase", "")
        .replace(/case (0|13|19|25|28|29):.*?(?=break;)break;/sg, "")
        .replace(/(function classEscape.*)\.replace\(\/\[\\x00-\\x0F\]\/g, *function\(ch\) { return "\\\\x0" \+ hex\(ch\); }\)/s, "$1")
        .replace(/(function classEscape.*)\.replace\(\/\[\\x10-\\x1F\\x7F-\\x9F\]\/g, function\(ch\) { return "\\\\x"  \+ hex\(ch\); }\)/s, "$1");
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
