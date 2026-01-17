export class Checklist {
  private items: string[] = [];

  add(...items: string[]): this {
    this.items.push(...items);
    return this;
  }

  toArray(): string[] {
    return [...this.items];
  }
}
