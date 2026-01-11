import { describe, it, expect } from "vitest";
import { MarkdownFormatter } from "./MarkdownFormatter";
import { ThingsFormatter } from "./ThingsFormatter";
import { PackingList } from "./types/types";

const createMockPackingList = (): PackingList => ({
  name: "Test Trip Jan 15th - Jan 20th",
  destination: "Test Destination",
  departureDate: new Date("2025-01-15"),
  returnDate: new Date("2025-01-20"),
  preDeparture: ["close windows", "take out trash"],
  dopp: ["toothbrush", "toothpaste"],
  backpack: ["laptop", "charger"],
  duffel: ["3 shirts", "2 pants"],
  postArrival: ["unpack"],
});

describe("MarkdownFormatter", () => {
  it("should format a packing list as markdown", () => {
    const packingList = createMockPackingList();
    const result = MarkdownFormatter.format(packingList);

    expect(result).toContain("# Test Trip Jan 15th - Jan 20th Packing List");
    expect(result).toContain("## Pre-Departure");
    expect(result).toContain("- [ ] close windows");
    expect(result).toContain("- [ ] take out trash");
    expect(result).toContain("## Dopp");
    expect(result).toContain("- [ ] toothbrush");
    expect(result).toContain("## Backpack");
    expect(result).toContain("- [ ] laptop");
    expect(result).toContain("## Duffel");
    expect(result).toContain("- [ ] 3 shirts");
    expect(result).toContain("## Post-Arrival");
    expect(result).toContain("- [ ] unpack");
  });

  it("should handle empty arrays", () => {
    const packingList: PackingList = {
      name: "Empty Trip",
      destination: "Nowhere",
      departureDate: new Date(),
      returnDate: new Date(),
      preDeparture: [],
      dopp: [],
      backpack: [],
      duffel: [],
      postArrival: [],
    };
    const result = MarkdownFormatter.format(packingList);

    expect(result).toContain("# Empty Trip Packing List");
    expect(result).toContain("## Pre-Departure");
    expect(result).toContain("## Dopp");
  });
});

describe("ThingsFormatter", () => {
  it("should generate a things:// URL", () => {
    const packingList = createMockPackingList();
    const result = ThingsFormatter.format(packingList);

    expect(result).toMatch(/^things:\/\/\/json\?data=/);
  });

  it("should include JSON-encoded data in the URL", () => {
    const packingList = createMockPackingList();
    const result = ThingsFormatter.format(packingList);

    // Extract the data parameter and decode it
    const dataMatch = result.match(/data=(.+)$/);
    expect(dataMatch).toBeTruthy();

    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));
    expect(Array.isArray(decodedData)).toBe(true);
  });

  it("should create a project with nested to-dos", () => {
    const packingList = createMockPackingList();
    const result = ThingsFormatter.format(packingList);

    const dataMatch = result.match(/data=(.+)$/);
    const decodedData = JSON.parse(decodeURIComponent(dataMatch![1]));

    // Should have 1 project
    expect(decodedData.length).toBe(1);
    expect(decodedData[0].type).toBe("project");
    expect(decodedData[0].attributes.title).toBe("Test Destination");

    // Project should have nested items
    const items = decodedData[0].attributes.items;
    expect(items.length).toBeGreaterThan(0);

    // Check for to-do items with checklists (pack dopp, pack backpack, pack duffel)
    const packItems = items.filter((item: { attributes: { title: string } }) =>
      item.attributes.title.startsWith("pack ")
    );
    expect(packItems.length).toBe(3);
  });
});
