import { criticalItems } from "./affinities";
import type { Container } from "./container";
import type { ManifestItem } from "./types/types";

export function allocateItems(manifest: ManifestItem[], containers: Container[]): void {
  const mainContainer = containers.find((c) => c.isMain);
  const backpack = containers.find((c) => c.affinity === "backpack");

  for (const item of manifest) {
    // Find container matching item's affinity, or fall back to main, or backpack
    const targetContainer =
      containers.find((c) => c.affinity === item.affinity) ?? mainContainer ?? backpack;

    if (!targetContainer) {
      throw new Error(`No container found for item: ${item.name}`);
    }

    // Redundancy for baggage loss: if packing critical items into a separate
    // main container, put one in backpack in case the bag is lost
    const needsRedundancy =
      mainContainer && backpack && mainContainer !== backpack && criticalItems.has(item.name);

    if (needsRedundancy) {
      backpack.pack(item.name, 1);
      const remaining = item.quantity - 1;
      if (remaining > 0) {
        targetContainer.pack(item.name, remaining);
      }
    } else {
      targetContainer.pack(item.name, item.quantity);
    }
  }
}
