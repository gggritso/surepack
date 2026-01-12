#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import surepack from "../dist/index.js";
import { ThingsFormatter } from "../dist/ThingsFormatter.js";
import { MarkdownFormatter } from "../dist/MarkdownFormatter.js";

const argv = yargs(hideBin(process.argv)).argv;

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
