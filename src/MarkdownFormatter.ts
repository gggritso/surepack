import type { PackingList } from "./types/types";

function formatChecklist(items: string[]): string {
  return items.map((item) => `- [ ] ${item}`).join("\n");
}

export class MarkdownFormatter {
  static format(packingList: PackingList): string {
    const preDeparture = formatChecklist(packingList.preDeparture.toArray());
    const postArrival = formatChecklist(packingList.postArrival.toArray());

    const containerSections = packingList.containers
      .map((container) => `## ${container.name}\n${formatChecklist(container.asList())}`)
      .join("\n\n");

    return `# ${packingList.name} Packing List

## Pre-Departure
${preDeparture}

${containerSections}

## Post-Arrival
${postArrival}
`;
  }
}
