import { format } from "date-fns";

import { askQuestions } from "./questions";
import { Container } from "./container";
import { Checklist } from "./checklist";
import { Manifest } from "./manifest";
import { allocateItems } from "./allocator";
import type { Answers, PackingList } from "./types/types";

function createMainContainer(nightsOfSleep: number): Container {
  const name = nightsOfSleep <= 5 ? "Duffel" : "Suitcase";
  return new Container(name, { isMain: true });
}

const createPackingList = (answers: Answers): PackingList => {
  const { destination, departureDate, returnDate, leavingCanada, flights, bringingFood } = answers;

  const nightsOfSleep = Math.floor(
    (returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Phase 1: Pre-departure checklist
  const preDeparture = new Checklist();

  preDeparture.add("close all windows");
  preDeparture.add("download some media");

  if (nightsOfSleep > 1) {
    preDeparture.add("take out compost");
    preDeparture.add("run dishwasher");
  }

  if (leavingCanada || nightsOfSleep > 3) {
    preDeparture.add(
      "set thermostat to vacation",
      "set vacation on CondoControl",
      "take out trashes",
    );
  }

  // Phase 2: Build manifest
  const manifest = Manifest.create(answers);

  // Phase 3: Create containers
  // For single-night trips, everything goes in backpack (no main container).
  // "On Me", the backpack and the food bag are gathered the morning of departure,
  // everything else the night before
  const onMe = new Container("On Me", { packDayOffset: 0 });
  const dopp = new Container("Dopp", { affinity: "dopp" });
  const backpack = new Container("Backpack", {
    affinity: "backpack",
    isMain: nightsOfSleep <= 1,
    packDayOffset: 0,
  });

  const containers: Container[] = [onMe, dopp, backpack];

  if (nightsOfSleep > 1) {
    containers.push(createMainContainer(nightsOfSleep));
  }

  if (bringingFood) {
    containers.push(new Container("Food Bag", { packDayOffset: 0 }));
  }

  // Phase 4: Allocate items to containers
  // Splitting a change of clothes into the backpack only guards against a checked
  // bag going missing, so it is only worth doing when flying
  allocateItems(manifest.toArray(), containers, { redundancy: flights > 0 });

  // Post-arrival checklist
  const postArrival = new Checklist();
  postArrival.add("unpack");
  postArrival.add("settle expenses");

  return {
    name: `${destination} ${format(departureDate, "MMM do")} - ${format(returnDate, "MMM do")}`,
    destination: destination,
    departureDate: departureDate,
    returnDate: returnDate,
    preDeparture: preDeparture,
    containers: containers,
    postArrival: postArrival,
  };
};

export { createPackingList };

export default async (): Promise<PackingList> => {
  const answers = await askQuestions();
  return createPackingList(answers);
};
