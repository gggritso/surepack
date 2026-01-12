#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import surepack from "./index";
import { ThingsFormatter } from "./ThingsFormatter";
import { MarkdownFormatter } from "./MarkdownFormatter";
import type { PackingList } from "./types/types";

interface Formatter {
  format(data: PackingList): string;
}

const argv = yargs(hideBin(process.argv)).argv as { format?: string };

const format = argv.format || "things";

const formatters: Record<string, Formatter> = {
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
  .catch((error: Error) => {
    if (error.name === "ExitPromptError") {
      // User cancelled with Ctrl+C
      process.exit(0);
    }
    console.error("Error generating packing list:", error.message);
    process.exit(1);
  });
