import fs from "fs";
import handlebars from "handlebars";
import { PackingList } from "./types/types";

export class MarkdownFormatter {
  static format(packingList: PackingList): string {
    const path = __dirname + "/../src/markdown.handlebars";
    const template = handlebars.compile(fs.readFileSync(path).toString());

    return template(packingList);
  }
}
