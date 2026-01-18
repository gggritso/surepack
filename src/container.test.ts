import { Container } from "./container";

describe("Container", () => {
  describe("constructor", () => {
    it("should create an empty container with a name", () => {
      const container = new Container("Test");
      expect(container.name).toBe("Test");
      expect(container.length()).toBe(0);
      expect(container.asList()).toEqual([]);
    });

    it("should create a container with affinity", () => {
      const container = new Container("Dopp", { affinity: "dopp" });
      expect(container.name).toBe("Dopp");
      expect(container.affinity).toBe("dopp");
      expect(container.isMain).toBe(false);
    });

    it("should create a main container", () => {
      const container = new Container("Suitcase", { isMain: true });
      expect(container.name).toBe("Suitcase");
      expect(container.isMain).toBe(true);
    });
  });

  describe("pack", () => {
    it("should add an item with default quantity of 1", () => {
      const container = new Container("Test");
      container.pack("toothbrush");
      expect(container.asList()).toEqual(["toothbrush"]);
    });

    it("should add an item with specified quantity", () => {
      const container = new Container("Test");
      container.pack("socks", 3);
      expect(container.asList()).toEqual(["3 socks"]);
    });

    it("should be chainable", () => {
      const container = new Container("Test");
      container.pack("item1").pack("item2").pack("item3");
      expect(container.length()).toBe(3);
    });

    it("should ignore items with quantity <= 0", () => {
      const container = new Container("Test");
      container.pack("item", 0);
      container.pack("item2", -1);
      expect(container.length()).toBe(0);
    });
  });

  describe("asList", () => {
    it("should return singular item for quantity 1", () => {
      const container = new Container("Test");
      container.pack("sock", 1);
      expect(container.asList()).toEqual(["sock"]);
    });

    it("should return pluralized item for quantity > 1", () => {
      const container = new Container("Test");
      container.pack("sock", 5);
      expect(container.asList()).toEqual(["5 socks"]);
    });
  });

  describe("length", () => {
    it("should return the number of distinct items", () => {
      const container = new Container("Test");
      container.pack("a").pack("b").pack("c");
      expect(container.length()).toBe(3);
    });
  });
});
