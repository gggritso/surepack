#!/usr/bin/env node

const argv = require("yargs").argv;

const surepack = require("../src/index");

const ThingsFormatter = require("../src/ThingsFormatter");
const MarkdownFormatter = require("../src/MarkdownFormatter");

const format = argv.format || "things";

const formatter = {
  markdown: MarkdownFormatter,
  things: ThingsFormatter,
}[format];

surepack().then((packingList) => {
  console.log(formatter.format(packingList));
});
