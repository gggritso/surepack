#!/usr/bin/env node

const argv = require("yargs").argv;

const surepack = require("../dist/index").default;

const ThingsFormatter = require("../dist/ThingsFormatter").ThingsFormatter;
const MarkdownFormatter =
  require("../dist/MarkdownFormatter").MarkdownFormatter;

const format = argv.format || "things";

const formatters = {
  markdown: MarkdownFormatter,
  things: ThingsFormatter,
};

const formatter = formatters[format];

if (!formatter) {
  console.error(`Unknown format: ${format}`);
  console.error(`Available formats: ${Object.keys(formatters).join(", ")}`);
  process.exit(1);
}

surepack()
  .then((packingList) => {
    console.log(formatter.format(packingList));
  })
  .catch((error) => {
    if (error.name === "ExitPromptError") {
      // User cancelled with Ctrl+C
      process.exit(0);
    }
    console.error("Error generating packing list:", error.message);
    process.exit(1);
  });
