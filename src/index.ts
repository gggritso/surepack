import inquirer from "inquirer";
import inquirerDatepicker from "inquirer-datepicker-prompt";
inquirer.registerPrompt("datetime", inquirerDatepicker);

import { format } from "date-fns";

import { questions } from "./questions";
import { Container } from "./container";
import { Answers, PackingList } from "./types/types";

const createPackingList = (answers: Answers): PackingList => {
  const {
    destination,
    departureDate,
    returnDate,
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
  } = answers;

  const laundryThreshold = 5;

  const isShortsWeather = lowTemperature > 20,
    nightsOfSleep = Math.floor(
      (returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24),
    );

  const preDeparture = new Container("Pre-departure");

  preDeparture.addOneOfEach("close all windows");

  if (nightsOfSleep > 1) {
    preDeparture.add("take out compost");
    preDeparture.add("run dishwasher");
  }

  if (leavingCanada || nightsOfSleep > 3) {
    preDeparture.addOneOfEach(
      "set thermostat to vacation",
      "set vacation on CondoControlCentral",
      "take out trashes",
    );
  }

  const dopp = new Container("Dopp", [
    "toothbrush",
    "toothpaste",
    "tongue brush",
  ]);

  dopp
    .pack("floss threaders", nightsOfSleep + 1)
    .packOneOfEach(
      "mouthwash",
      "floss",
      "cleanser",
      "moisturizer",
      "deodorant",
      "cologne",
      "pomade",
    );

  if (nightsOfSleep < 3) {
    dopp.pack("daily contact", nightsOfSleep + 1);
  } else {
    dopp.pack("contact lens case");
    dopp.pack("contact lens fluid");
  }

  if (nightsOfSleep > 3) dopp.pack("shampoo");
  dopp.pack("shower gel");
  dopp.pack("basic meds");

  if (nightsOfSleep > 2) dopp.pack("condoms");

  const duffel = new Container("Duffel");

  let setsOfClothes: number;

  if (willHaveLaundry) {
    setsOfClothes = Math.min(nightsOfSleep + 1, laundryThreshold);
  } else {
    setsOfClothes = nightsOfSleep + 1;
  }

  duffel.pack("mask", setsOfClothes);
  duffel.pack("underwear", setsOfClothes);
  duffel.pack("socks", setsOfClothes);
  duffel.pack("t-shirt", setsOfClothes);

  if (lowTemperature < 15) {
    duffel.pack("sweater", Math.min(Math.ceil(nightsOfSleep / 3), 3));
  }

  duffel.pack(
    isShortsWeather ? "shorts" : "pants",
    Math.min(Math.floor(nightsOfSleep / 3), 3),
  );
  duffel.pack("tank top");
  duffel.pack(lowTemperature < 15 ? "track pants" : "gym shorts");

  if (workouts > 0) {
    duffel.pack("tank top", workouts);
    duffel.pack("shorts", workouts);
    duffel.pack("sports socks", workouts);
    duffel.pack("sports underwear", workouts);
    duffel.pack("cross-training shoes");
  }

  if ((nightsOfSleep > 4 && highTemperature < 20) || rainDays > 1) {
    duffel.pack("second pair of shoes");
  }

  if (nightsOfSleep > 1) {
    duffel.pack("laundry compression bag");
  }

  if (willNeedASuit) {
    duffel.packOneOfEach(
      "suit",
      "formal shoes",
      "formal belt",
      "tie",
      "dress shirt",
      "dress socks",
    );
  }

  const backpack = new Container("Backpack", [
    "sunglasses in case",
    "glasses in case",
    "Kobo",
    "phone charger",
    "garbage bag",
    "dopp kit",
    "lip balm",
  ]);

  if (areThereBugs) {
    backpack.pack("bug spray");
    duffel.pack("knee socks");
    duffel.pack("bug net");
  }

  extras.forEach((extra: string) => backpack.pack(extra));

  if (highTemperature > 20) backpack.pack("sunscreen");
  if (rainDays > 1) backpack.pack("umbrella");

  if (accessToBodyOfWater) {
    duffel.pack("swim trunks");
    duffel.pack("towel");
    duffel.pack("flip flops");
  }

  if (nightsOfSleep > laundryThreshold && willHaveLaundry) {
    duffel.pack("laundry pods", Math.max(Math.floor(nightsOfSleep / 5), 1));
  }

  if (willBeWorking || nightsOfSleep > 3) {
    backpack.pack("laptop and charger");
  }

  if (willBeWorking) {
    backpack.pack("laptop extension cord");
  }

  if (workouts > 0) {
    dopp.pack("polysporin");
    dopp.pack("band-aids");
  }

  backpack.pack("water bottle");

  if (leavingCanada) {
    backpack.pack("passport");
    backpack.pack("SIM tool");
    backpack.pack("pen");
    backpack.pack("local currency");
    backpack.pack("transit pass");
  }

  const postArrival = new Container("Post-arrival");

  postArrival.add("unpack");

  return {
    name: `${destination} ${format(departureDate, "MMM do")} - ${format(
      returnDate,
      "MMM do",
    )}`,
    destination: destination,
    departureDate: departureDate,
    returnDate: returnDate,
    preDeparture: preDeparture.asList(),
    dopp: dopp.asList(),
    backpack: backpack.asList(),
    duffel: duffel.asList(),
    postArrival: postArrival.asList(),
  };
};

export default (): Promise<PackingList> => {
  return inquirer
    .prompt(questions)
    .then((answers) => createPackingList(answers as Answers));
};
