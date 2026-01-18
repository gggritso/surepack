import { doppItems, backpackItems } from "./affinities";
import { LAUNDRY_THRESHOLD, SHORTS_WEATHER_TEMPERATURE } from "./settings";
import type { Answers, ContainerAffinity, ManifestItem } from "./types/types";

function getAffinity(name: string): ContainerAffinity {
  if (doppItems.has(name)) return "dopp";
  if (backpackItems.has(name)) return "backpack";
  return "main";
}

export class Manifest {
  private items: ManifestItem[] = [];

  add(name: string, quantity: number): this {
    if (quantity > 0) {
      this.items.push({ name, quantity, affinity: getAffinity(name) });
    }
    return this;
  }

  addOne(name: string): this {
    return this.add(name, 1);
  }

  addOneOfEach(names: string[]): this {
    names.forEach((name) => this.addOne(name));
    return this;
  }

  toArray(): ManifestItem[] {
    return [...this.items];
  }

  static create(answers: Answers): Manifest {
    const {
      accessToBodyOfWater,
      willBeWorking,
      willNeedASuit,
      willHaveLaundry,
      workouts,
      rainDays,
      areThereBugs,
      leavingCanada,
      lowTemperature,
      highTemperature,
      extras,
      departureDate,
      returnDate,
    } = answers;

    const isShortsWeather = lowTemperature > SHORTS_WEATHER_TEMPERATURE;
    const nightsOfSleep = Math.floor(
      (returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const manifest = new Manifest();

    // Dopp items (toiletries)
    manifest.addOneOfEach(["toothbrush", "toothpaste", "tongue brush"]);
    manifest.add("floss threaders", nightsOfSleep + 1);
    manifest.addOneOfEach([
      "mouthwash",
      "floss",
      "cleanser",
      "moisturizer",
      "deodorant",
      "cologne",
      "pomade",
    ]);

    if (nightsOfSleep < 3) {
      manifest.add("daily contact", nightsOfSleep + 1);
    } else {
      manifest.addOneOfEach(["contact lens case", "contact lens fluid"]);
    }

    if (nightsOfSleep > 3) manifest.addOne("shampoo");
    manifest.addOne("shower gel");
    manifest.addOne("basic meds");

    if (nightsOfSleep > 2) manifest.addOne("condoms");

    if (workouts > 0) {
      manifest.addOneOfEach(["polysporin", "band-aids"]);
    }

    // Backpack items
    manifest.addOneOfEach([
      "sunglasses in case",
      "glasses in case",
      "Kobo",
      "phone charger",
      "garbage bag",
      "dopp kit",
      "lip balm",
    ]);

    if (areThereBugs) {
      manifest.addOne("bug spray");
    }

    extras.forEach((extra) => manifest.addOne(extra));

    if (highTemperature > SHORTS_WEATHER_TEMPERATURE) manifest.addOne("sunscreen");
    if (rainDays > 1) manifest.addOne("umbrella");

    if (willBeWorking || nightsOfSleep > 3) {
      manifest.addOne("laptop and charger");
    }

    if (willBeWorking) {
      manifest.addOne("laptop extension cord");
    }

    manifest.addOne("water bottle");

    if (leavingCanada) {
      manifest.addOneOfEach([
        "passport",
        "SIM tool",
        "pen",
        "local currency",
        "transit pass",
      ]);
    }

    // Clothing (critical items get redundancy in backpack via allocator)
    let setsOfClothes: number;
    if (willHaveLaundry) {
      setsOfClothes = Math.min(nightsOfSleep + 1, LAUNDRY_THRESHOLD);
    } else {
      setsOfClothes = nightsOfSleep + 1;
    }

    manifest.add("t-shirt", setsOfClothes);
    manifest.add("underwear", setsOfClothes);
    manifest.add("socks", setsOfClothes);
    manifest.addOne("tank top");

    // Main container items
    manifest.add("mask", setsOfClothes);

    if (lowTemperature < 15) {
      manifest.add("sweater", Math.min(Math.ceil(nightsOfSleep / 3), 3));
    }

    manifest.add(
      isShortsWeather ? "shorts" : "pants",
      Math.min(Math.floor(nightsOfSleep / 3), 3),
    );

    manifest.addOne(lowTemperature < 15 ? "track pants" : "gym shorts");

    if (workouts > 0) {
      manifest.add("tank top", workouts);
      manifest.add("shorts", workouts);
      manifest.add("sports socks", workouts);
      manifest.add("sports underwear", workouts);
      manifest.addOne("cross-training shoes");
    }

    if ((nightsOfSleep > 4 && highTemperature < SHORTS_WEATHER_TEMPERATURE) || rainDays > 1) {
      manifest.addOne("second pair of shoes");
    }

    if (nightsOfSleep > 1) {
      manifest.addOne("laundry compression bag");
    }

    if (willNeedASuit) {
      manifest.addOneOfEach([
        "suit",
        "formal shoes",
        "formal belt",
        "tie",
        "dress shirt",
        "dress socks",
      ]);
    }

    if (areThereBugs) {
      manifest.addOneOfEach(["knee socks", "bug net"]);
    }

    if (accessToBodyOfWater) {
      manifest.addOneOfEach(["swim trunks", "towel", "flip flops"]);
    }

    if (nightsOfSleep > LAUNDRY_THRESHOLD && willHaveLaundry) {
      manifest.add("laundry pods", Math.max(Math.floor(nightsOfSleep / 5), 1));
    }

    return manifest;
  }
}
