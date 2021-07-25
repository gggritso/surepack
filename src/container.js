const pluralize = require("pluralize");

class Container {
  constructor(name, items = []) {
    this.name = name;
    this.items = [];

    if (items.length) {
      items.forEach((item) => {
        this.pack(item);
      });
    }
  }

  add(item, quantity) {
    this.pack(item, quantity);
  }

  pack(item, quantity = 1) {
    if (quantity > 0) {
      this.items.push({
        item,
        quantity,
      });
    }

    return this;
  }

  addOneOfEach() {
    this.packOneOfEach(...arguments);
  }

  packOneOfEach() {
    [...arguments].forEach((item) => {
      this.pack(item, 1);
    });

    return this;
  }

  asList() {
    return this.items.map(({ item, quantity }) => {
      if (quantity === 1) return item;
      return `${quantity} ${pluralize(item)}`;
    });
  }

  length() {
    return this.items.length;
  }
}

module.exports = Container;
