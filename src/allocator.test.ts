import { allocateItems } from "./allocator";
import { Container } from "./container";
import type { ManifestItem } from "./types/types";

function createContainers() {
  return {
    dopp: new Container("Dopp", { affinity: "dopp" }),
    backpack: new Container("Backpack", { affinity: "backpack" }),
    main: new Container("Duffel", { isMain: true }),
  };
}

describe("allocator", () => {
  describe("allocateItems", () => {
    it("should allocate dopp items to dopp container", () => {
      const manifest: ManifestItem[] = [
        { name: "toothbrush", quantity: 1, affinity: "dopp" },
        { name: "floss", quantity: 3, affinity: "dopp" },
      ];

      const { dopp, backpack, main } = createContainers();
      allocateItems(manifest, [dopp, backpack, main]);

      expect(dopp.asList()).toEqual(["toothbrush", "3 flosses"]);
      expect(backpack.asList()).toEqual([]);
      expect(main.asList()).toEqual([]);
    });

    it("should allocate backpack items to backpack container", () => {
      const manifest: ManifestItem[] = [
        { name: "laptop", quantity: 1, affinity: "backpack" },
        { name: "phone charger", quantity: 1, affinity: "backpack" },
      ];

      const { dopp, backpack, main } = createContainers();
      allocateItems(manifest, [dopp, backpack, main]);

      expect(backpack.asList()).toEqual(["laptop", "phone charger"]);
      expect(dopp.asList()).toEqual([]);
      expect(main.asList()).toEqual([]);
    });

    it("should allocate main items to main container", () => {
      const manifest: ManifestItem[] = [
        { name: "sweater", quantity: 2, affinity: "main" },
        { name: "pants", quantity: 3, affinity: "main" },
      ];

      const { dopp, backpack, main } = createContainers();
      allocateItems(manifest, [dopp, backpack, main]);

      expect(main.asList()).toEqual(["2 sweaters", "3 pants"]);
      expect(main.name).toBe("Duffel");
    });

    it("should put one critical item in backpack for redundancy", () => {
      const manifest: ManifestItem[] = [
        { name: "t-shirt", quantity: 5, affinity: "main" },
        { name: "underwear", quantity: 5, affinity: "main" },
        { name: "socks", quantity: 5, affinity: "main" },
      ];

      const { dopp, backpack, main } = createContainers();
      allocateItems(manifest, [dopp, backpack, main]);

      expect(backpack.asList()).toEqual(["t-shirt", "underwear", "socks"]);
      expect(main.asList()).toEqual(["4 t-shirts", "4 underwears", "4 socks"]);
    });

    it("should handle critical items with quantity of 1", () => {
      const manifest: ManifestItem[] = [
        { name: "t-shirt", quantity: 1, affinity: "main" },
        { name: "underwear", quantity: 1, affinity: "main" },
      ];

      const { dopp, backpack, main } = createContainers();
      allocateItems(manifest, [dopp, backpack, main]);

      expect(backpack.asList()).toEqual(["t-shirt", "underwear"]);
      expect(main.asList()).toEqual([]);
    });

    it("should handle mixed affinities correctly", () => {
      const manifest: ManifestItem[] = [
        { name: "toothbrush", quantity: 1, affinity: "dopp" },
        { name: "laptop", quantity: 1, affinity: "backpack" },
        { name: "t-shirt", quantity: 3, affinity: "main" },
        { name: "sweater", quantity: 2, affinity: "main" },
      ];

      const dopp = new Container("Dopp", { affinity: "dopp" });
      const backpack = new Container("Backpack", { affinity: "backpack" });
      const main = new Container("Suitcase", { isMain: true });

      allocateItems(manifest, [dopp, backpack, main]);

      expect(dopp.asList()).toEqual(["toothbrush"]);
      expect(backpack.asList()).toEqual(["laptop", "t-shirt"]);
      expect(main.asList()).toEqual(["2 t-shirts", "2 sweaters"]);
      expect(main.name).toBe("Suitcase");
    });

    it("should fall back to backpack when no main container", () => {
      const manifest: ManifestItem[] = [
        { name: "sweater", quantity: 2, affinity: "main" },
        { name: "t-shirt", quantity: 3, affinity: "main" },
      ];

      const dopp = new Container("Dopp", { affinity: "dopp" });
      const backpack = new Container("Backpack", { affinity: "backpack", isMain: true });

      allocateItems(manifest, [dopp, backpack]);

      // No redundancy since backpack is the main container
      expect(backpack.asList()).toEqual(["2 sweaters", "3 t-shirts"]);
    });

    it("should not add redundancy when there is no main container", () => {
      const manifest: ManifestItem[] = [
        { name: "t-shirt", quantity: 3, affinity: "main" },
        { name: "underwear", quantity: 3, affinity: "main" },
      ];

      const dopp = new Container("Dopp", { affinity: "dopp" });
      const backpack = new Container("Backpack", { affinity: "backpack", isMain: true });

      allocateItems(manifest, [dopp, backpack]);

      // All items go to backpack (as main), no redundancy split
      expect(backpack.asList()).toEqual(["3 t-shirts", "3 underwears"]);
    });
  });
});
