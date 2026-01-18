#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import surepack, { createPackingList } from "./index";
import { ThingsFormatter } from "./ThingsFormatter";
import { MarkdownFormatter } from "./MarkdownFormatter";
import type { Answers, PackingList } from "./types/types";

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

function parseAnswers(json: string): Answers {
  const parsed = JSON.parse(json);
  return {
    ...parsed,
    departureDate: new Date(parsed.departureDate),
    returnDate: new Date(parsed.returnDate),
  };
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
    process.stdin.on("error", reject);
  });
}

const run = async (): Promise<PackingList> => {
  // If stdin is not a TTY, read JSON from stdin
  if (!process.stdin.isTTY) {
    const json = await readStdin();
    const answers = parseAnswers(json);
    return createPackingList(answers);
  }
  return surepack();
};

run()
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
