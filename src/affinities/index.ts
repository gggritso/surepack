import { readFileSync } from "fs";
import { join } from "path";

function readAffinityFile(filename: string): Set<string> {
  const content = readFileSync(join(__dirname, filename), "utf-8");
  const items = content
    .trim()
    .split("\n")
    .filter((line) => line.length > 0);
  return new Set(items);
}

export const doppItems = readAffinityFile("dopp.txt");
export const backpackItems = readAffinityFile("backpack.txt");
export const mainItems = readAffinityFile("main.txt");

// Critical items for redundancy: kept in backpack in case main bag is lost
export const criticalItems = readAffinityFile("critical.txt");
