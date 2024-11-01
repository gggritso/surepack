#!/usr/bin/env node

const argv = require("yargs").argv;

const surepack = require("../dist/index").default;

const ThingsFormatter = require("../dist/ThingsFormatter");
const MarkdownFormatter = require("../dist/MarkdownFormatter");

const format = argv.format || "things";

const formatter = {
  markdown: MarkdownFormatter,
  things: ThingsFormatter,
}[format];

surepack().then((packingList) => {
  console.log(formatter.format(packingList));
});
