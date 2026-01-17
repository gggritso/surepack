import { Checklist } from "./checklist";

describe("Checklist", () => {
  describe("add", () => {
    it("should add a single item", () => {
      const checklist = new Checklist();
      checklist.add("close windows");
      expect(checklist.toArray()).toEqual(["close windows"]);
    });

    it("should add multiple items at once", () => {
      const checklist = new Checklist();
      checklist.add("task 1", "task 2", "task 3");
      expect(checklist.toArray()).toEqual(["task 1", "task 2", "task 3"]);
    });

    it("should be chainable", () => {
      const checklist = new Checklist();
      checklist.add("first").add("second").add("third");
      expect(checklist.toArray()).toEqual(["first", "second", "third"]);
    });
  });

  describe("toArray", () => {
    it("should return an empty array for new checklist", () => {
      const checklist = new Checklist();
      expect(checklist.toArray()).toEqual([]);
    });

    it("should return a copy of items", () => {
      const checklist = new Checklist();
      checklist.add("item");
      const result = checklist.toArray();
      result.push("modified");
      expect(checklist.toArray()).toEqual(["item"]);
    });
  });
});
