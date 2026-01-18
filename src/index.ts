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
  const { destination, departureDate, returnDate, leavingCanada } = answers;

  const nightsOfSleep = Math.floor(
    (returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Phase 1: Pre-departure checklist
  const preDeparture = new Checklist();

  preDeparture.add("close all windows");

  if (nightsOfSleep > 1) {
    preDeparture.add("take out compost");
    preDeparture.add("run dishwasher");
  }

  if (leavingCanada || nightsOfSleep > 3) {
    preDeparture.add(
      "set thermostat to vacation",
      "set vacation on CondoControlCentral",
      "take out trashes",
    );
  }

  // Phase 2: Build manifest
  const manifest = Manifest.create(answers);

  // Phase 3: Create containers
  // For single-night trips, everything goes in backpack (no main container)
  const dopp = new Container("Dopp", { affinity: "dopp" });
  const backpack = new Container("Backpack", { affinity: "backpack", isMain: nightsOfSleep <= 1 });

  const containers: Container[] = [dopp, backpack];

  if (nightsOfSleep > 1) {
    containers.push(createMainContainer(nightsOfSleep));
  }

  // Phase 4: Allocate items to containers
  allocateItems(manifest.toArray(), containers);

  // Post-arrival checklist
  const postArrival = new Checklist();
  postArrival.add("unpack");

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

export default async (): Promise<PackingList> => {
  const answers = await askQuestions();
  return createPackingList(answers);
};
