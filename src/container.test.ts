import { Container } from "./container";

describe("Container", () => {
  describe("constructor", () => {
    it("should create an empty container", () => {
      const container = new Container();
      expect(container.length()).toBe(0);
      expect(container.asList()).toEqual([]);
    });

    it("should create a container with initial items", () => {
      const container = new Container(["item1", "item2"]);
      expect(container.length()).toBe(2);
      expect(container.asList()).toEqual(["item1", "item2"]);
    });
  });

  describe("pack", () => {
    it("should add an item with default quantity of 1", () => {
      const container = new Container();
      container.pack("toothbrush");
      expect(container.asList()).toEqual(["toothbrush"]);
    });

    it("should add an item with specified quantity", () => {
      const container = new Container();
      container.pack("socks", 3);
      expect(container.asList()).toEqual(["3 socks"]);
    });

    it("should be chainable", () => {
      const container = new Container();
      container.pack("item1").pack("item2").pack("item3");
      expect(container.length()).toBe(3);
    });

    it("should ignore items with quantity <= 0", () => {
      const container = new Container();
      container.pack("item", 0);
      container.pack("item2", -1);
      expect(container.length()).toBe(0);
    });
  });

  describe("add", () => {
    it("should add an item (alias for pack)", () => {
      const container = new Container();
      container.add("item");
      expect(container.asList()).toEqual(["item"]);
    });
  });

  describe("packOneOfEach", () => {
    it("should add multiple items with quantity 1", () => {
      const container = new Container();
      container.packOneOfEach("item1", "item2", "item3");
      expect(container.asList()).toEqual(["item1", "item2", "item3"]);
    });

    it("should be chainable", () => {
      const container = new Container();
      container.packOneOfEach("a", "b").packOneOfEach("c", "d");
      expect(container.length()).toBe(4);
    });
  });

  describe("addOneOfEach", () => {
    it("should add multiple items (alias for packOneOfEach)", () => {
      const container = new Container();
      container.addOneOfEach("x", "y");
      expect(container.asList()).toEqual(["x", "y"]);
    });
  });

  describe("asList", () => {
    it("should return singular item for quantity 1", () => {
      const container = new Container();
      container.pack("sock", 1);
      expect(container.asList()).toEqual(["sock"]);
    });

    it("should return pluralized item for quantity > 1", () => {
      const container = new Container();
      container.pack("sock", 5);
      expect(container.asList()).toEqual(["5 socks"]);
    });
  });

  describe("length", () => {
    it("should return the number of distinct items", () => {
      const container = new Container();
      container.pack("a").pack("b").pack("c");
      expect(container.length()).toBe(3);
    });
  });
});
