import pluralize from "pluralize";
import type { ContainerAffinity, ContainerItem } from "./types/types";

export interface ContainerOptions {
  affinity?: ContainerAffinity;
  isMain?: boolean;
}

export class Container {
  readonly name: string;
  readonly affinity?: ContainerAffinity;
  readonly isMain: boolean;
  private items: ContainerItem[];

  constructor(name: string, options: ContainerOptions = {}) {
    this.name = name;
    this.affinity = options.affinity;
    this.isMain = options.isMain ?? false;
    this.items = [];
  }

  pack(item: string, quantity: number = 1): this {
    if (quantity > 0) {
      this.items.push({ item, quantity });
    }
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
