import handlebars from "handlebars";
import type { PackingList } from "./types/types";

const TEMPLATE = `# {{name}} Packing List

## Pre-Departure
{{#each preDeparture }}
- [ ] {{this}}
{{/each}}

## Dopp
{{#each dopp }}
- [ ] {{this}}
{{/each}}
{{#if shavingKit.length}}

## Shaving Kit
{{#each shavingKit }}
- [ ] {{this}}
{{/each}}
{{/if}}

## Backpack
{{#each backpack }}
- [ ] {{this}}
{{/each}}

## Duffel
{{#each duffel }}
- [ ] {{this}}
{{/each}}

## Post-Arrival
{{#each postArrival }}
- [ ] {{this}}
{{/each}}
`;

export class MarkdownFormatter {
  static format(packingList: PackingList): string {
    const template = handlebars.compile(TEMPLATE);
    return template(packingList);
  }
}
