import { MarkdownFormatter } from "./MarkdownFormatter";
import { ThingsFormatter } from "./ThingsFormatter";
import type { PackingList } from "./types/types";

const createMockPackingList = (): PackingList => ({
  name: "Test Trip Jan 15th - Jan 20th",
  destination: "Test Destination",
  departureDate: new Date(2025, 0, 15), // Local time to avoid timezone issues
  returnDate: new Date(2025, 0, 20),
  preDeparture: ["close windows", "take out trash"],
  dopp: ["toothbrush", "toothpaste"],
  backpack: ["laptop", "charger"],
  duffel: ["3 shirts", "2 pants"],
  postArrival: ["unpack"],
});

const createEmptyPackingList = (): PackingList => ({
  name: "Empty Trip",
  destination: "Nowhere",
  departureDate: new Date(2025, 0, 1), // Local time to avoid timezone issues
  returnDate: new Date(2025, 0, 2),
  preDeparture: [],
  dopp: [],
  backpack: [],
  duffel: [],
  postArrival: [],
});

describe("MarkdownFormatter", () => {
  it("should format a packing list as markdown", () => {
    const packingList = createMockPackingList();
    const result = MarkdownFormatter.format(packingList);

    expect(result).toMatchInlineSnapshot(`
"# Test Trip Jan 15th - Jan 20th Packing List

## Pre-Departure
- [ ] close windows
- [ ] take out trash

## Dopp
- [ ] toothbrush
- [ ] toothpaste

## Backpack
- [ ] laptop
- [ ] charger

## Duffel
- [ ] 3 shirts
- [ ] 2 pants

## Post-Arrival
- [ ] unpack
"
`);
  });

  it("should handle empty arrays", () => {
    const packingList = createEmptyPackingList();
    const result = MarkdownFormatter.format(packingList);

    expect(result).toMatchInlineSnapshot(`
"# Empty Trip Packing List

## Pre-Departure

## Dopp

## Backpack

## Duffel

## Post-Arrival
"
`);
  });
});

describe("ThingsFormatter", () => {
  it("should generate a valid things:// URL with correct data", () => {
    const packingList = createMockPackingList();
    const result = ThingsFormatter.format(packingList);

    expect(result).toMatch(/^things:\/\/\/json\?data=/);

    const dataMatch = result.match(/data=(.+)$/);
    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));

    expect(decodedData).toMatchInlineSnapshot(`
[
  {
    "attributes": {
      "items": [
        {
          "attributes": {
            "title": "close windows",
            "when": "Jan 15th",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "title": "take out trash",
            "when": "Jan 15th",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "checklist-items": [
              {
                "attributes": {
                  "title": "toothbrush",
                },
                "type": "checklist-item",
              },
              {
                "attributes": {
                  "title": "toothpaste",
                },
                "type": "checklist-item",
              },
            ],
            "title": "pack dopp",
            "when": "Jan 14th",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "checklist-items": [
              {
                "attributes": {
                  "title": "laptop",
                },
                "type": "checklist-item",
              },
              {
                "attributes": {
                  "title": "charger",
                },
                "type": "checklist-item",
              },
            ],
            "title": "pack backpack",
            "when": "Jan 15th",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "checklist-items": [
              {
                "attributes": {
                  "title": "3 shirts",
                },
                "type": "checklist-item",
              },
              {
                "attributes": {
                  "title": "2 pants",
                },
                "type": "checklist-item",
              },
            ],
            "title": "pack duffel",
            "when": "Jan 14th",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "title": "unpack",
            "when": "Jan 20th",
          },
          "type": "to-do",
        },
      ],
      "notes": "Leaving Jan 15th, coming back Jan 20th",
      "title": "Test Destination",
    },
    "type": "project",
  },
]
`);
  });

  it("should handle empty arrays", () => {
    const packingList = createEmptyPackingList();
    const result = ThingsFormatter.format(packingList);

    expect(result).toMatch(/^things:\/\/\/json\?data=/);

    const dataMatch = result.match(/data=(.+)$/);
    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));

    expect(decodedData).toMatchInlineSnapshot(`
[
  {
    "attributes": {
      "items": [
        {
          "attributes": {
            "checklist-items": [],
            "title": "pack dopp",
            "when": "Dec 31st",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "checklist-items": [],
            "title": "pack backpack",
            "when": "Jan 1st",
          },
          "type": "to-do",
        },
        {
          "attributes": {
            "checklist-items": [],
            "title": "pack duffel",
            "when": "Dec 31st",
          },
          "type": "to-do",
        },
      ],
      "notes": "Leaving Jan 1st, coming back Jan 2nd",
      "title": "Nowhere",
    },
    "type": "project",
  },
]
`);
  });
});
