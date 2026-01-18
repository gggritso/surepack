import { MarkdownFormatter } from "./MarkdownFormatter";
import { ThingsFormatter } from "./ThingsFormatter";
import { Container } from "./container";
import { Checklist } from "./checklist";
import type { PackingList } from "./types/types";

const createMockPackingList = (): PackingList => {
  const preDeparture = new Checklist();
  preDeparture.add("close windows", "take out trash");

  const dopp = new Container("Dopp", { affinity: "dopp" });
  dopp.pack("toothbrush").pack("toothpaste");

  const backpack = new Container("Backpack", { affinity: "backpack" });
  backpack.pack("laptop").pack("charger");

  const main = new Container("Duffel", { isMain: true });
  main.pack("shirt", 3).pack("pants", 2);

  const postArrival = new Checklist();
  postArrival.add("unpack");

  return {
    name: "Test Trip Jan 15th - Jan 20th",
    destination: "Test Destination",
    departureDate: new Date(2025, 0, 15),
    returnDate: new Date(2025, 0, 20),
    preDeparture,
    containers: [dopp, backpack, main],
    postArrival,
  };
};

const createEmptyPackingList = (): PackingList => {
  return {
    name: "Empty Trip",
    destination: "Nowhere",
    departureDate: new Date(2025, 0, 1),
    returnDate: new Date(2025, 0, 2),
    preDeparture: new Checklist(),
    containers: [
      new Container("Dopp", { affinity: "dopp" }),
      new Container("Backpack", { affinity: "backpack" }),
      new Container("Duffel", { isMain: true }),
    ],
    postArrival: new Checklist(),
  };
};

const createLongTripPackingList = (): PackingList => {
  const preDeparture = new Checklist();
  preDeparture.add("close windows");

  const dopp = new Container("Dopp", { affinity: "dopp" });
  dopp.pack("toothbrush");

  const backpack = new Container("Backpack", { affinity: "backpack" });
  backpack.pack("laptop");

  const main = new Container("Suitcase", { isMain: true });
  main.pack("shirt", 5).pack("pants", 3);

  const postArrival = new Checklist();
  postArrival.add("unpack");

  return {
    name: "Long Trip Jan 1st - Jan 15th",
    destination: "Far Away",
    departureDate: new Date(2025, 0, 1),
    returnDate: new Date(2025, 0, 15),
    preDeparture,
    containers: [dopp, backpack, main],
    postArrival,
  };
};

const createSingleNightPackingList = (): PackingList => {
  const preDeparture = new Checklist();
  preDeparture.add("close windows");

  const dopp = new Container("Dopp", { affinity: "dopp" });
  dopp.pack("toothbrush");

  const backpack = new Container("Backpack", { affinity: "backpack", isMain: true });
  backpack.pack("laptop").pack("t-shirt").pack("underwear");

  const postArrival = new Checklist();
  postArrival.add("unpack");

  return {
    name: "Quick Trip Jan 1st - Jan 2nd",
    destination: "Nearby",
    departureDate: new Date(2025, 0, 1),
    returnDate: new Date(2025, 0, 2),
    preDeparture,
    containers: [dopp, backpack],
    postArrival,
  };
};

describe("MarkdownFormatter", () => {
  it("should format a packing list as markdown with duffel", () => {
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

  it("should format a packing list as markdown with suitcase", () => {
    const packingList = createLongTripPackingList();
    const result = MarkdownFormatter.format(packingList);

    expect(result).toMatchInlineSnapshot(`
"# Long Trip Jan 1st - Jan 15th Packing List

## Pre-Departure
- [ ] close windows

## Dopp
- [ ] toothbrush

## Backpack
- [ ] laptop

## Suitcase
- [ ] 5 shirts
- [ ] 3 pants

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

  it("should format single-night trip with only dopp and backpack", () => {
    const packingList = createSingleNightPackingList();
    const result = MarkdownFormatter.format(packingList);

    expect(result).toMatchInlineSnapshot(`
"# Quick Trip Jan 1st - Jan 2nd Packing List

## Pre-Departure
- [ ] close windows

## Dopp
- [ ] toothbrush

## Backpack
- [ ] laptop
- [ ] t-shirt
- [ ] underwear

## Post-Arrival
- [ ] unpack
"
`);
  });
});

describe("ThingsFormatter", () => {
  it("should generate a valid things:// URL with correct data for duffel", () => {
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

  it("should generate a valid things:// URL with suitcase for long trips", () => {
    const packingList = createLongTripPackingList();
    const result = ThingsFormatter.format(packingList);

    const dataMatch = result.match(/data=(.+)$/);
    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));

    // Check that it says "pack suitcase" instead of "pack duffel"
    const items = decodedData[0].attributes.items;
    const packSuitcaseTask = items.find(
      (item: { attributes: { title: string } }) => item.attributes.title === "pack suitcase",
    );
    expect(packSuitcaseTask).toBeDefined();
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

  it("should handle single-night trip with no main container", () => {
    const packingList = createSingleNightPackingList();
    const result = ThingsFormatter.format(packingList);

    const dataMatch = result.match(/data=(.+)$/);
    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));

    const items = decodedData[0].attributes.items;
    const containerTasks = items.filter((item: { attributes: { title: string } }) =>
      item.attributes.title.startsWith("pack "),
    );

    // Should only have dopp and backpack, no duffel/suitcase
    expect(containerTasks).toHaveLength(2);
    expect(containerTasks[0].attributes.title).toBe("pack dopp");
    expect(containerTasks[1].attributes.title).toBe("pack backpack");
  });
});
