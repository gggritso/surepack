import pluralize from "pluralize";
import type { ContainerItem } from "./types/types";

export class Container {
  private items: ContainerItem[];

  constructor(items: string[] = []) {
    this.items = [];

    if (items.length) {
      items.forEach((item) => {
        this.pack(item);
      });
    }
  }

  add(item: string, quantity?: number): void {
    this.pack(item, quantity);
  }

  pack(item: string, quantity: number = 1): this {
    if (quantity > 0) {
      this.items.push({
        item,
        quantity,
      });
    }

    return this;
  }

  addOneOfEach(...items: string[]): void {
    this.packOneOfEach(...items);
  }

  packOneOfEach(...items: string[]): this {
    items.forEach((item) => {
      this.pack(item, 1);
    });

    return this;
  }

  asList(): string[] {
    return this.items.map(({ item, quantity }) => {
      if (quantity === 1) return item;
      return `${quantity} ${pluralize(item)}`;
    });
  }

  length(): number {
    return this.items.length;
  }
}

export default Container;
