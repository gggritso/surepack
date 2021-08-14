#!/usr/bin/env node

const argv = require("yargs").argv;

const surepack = require("../src/index");

const MarkdownFormatter = require("../src/MarkdownFormatter");

const format = argv.format || "markdown";

const formatter = {
  markdown: MarkdownFormatter,
}[format];

surepack().then((packingList) => {
  console.log(formatter.format(packingList));
});
