const fs = require("fs");
const handlebars = require("handlebars");

class MarkdownFormatter {
  static format(packingList) {
    const path = __dirname + "/../src/markdown.handlebars";
    const template = handlebars.compile(fs.readFileSync(path).toString());

    return template(packingList);
  }
}

module.exports = MarkdownFormatter;
