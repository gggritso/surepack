import { input, confirm, checkbox, number } from "@inquirer/prompts";
import { datePrompt } from "./datePrompt";
import type { Answers } from "./types/types";

export const askQuestions = async (): Promise<Answers> => {
  const destination = await input({
    message: "Where are you going?",
    default: "Trip",
  });

  const departureDate = await datePrompt({
    message: "When are you heading out? (e.g., 15 Jan)",
  });

  const returnDate = await datePrompt({
    message: "When are you heading back? (e.g., 20 Jan)",
  });

  const leavingCanada = await confirm({
    message: "Leaving Canada?",
    default: false,
  });

  const accessToBodyOfWater = await confirm({
    message: "Access to water or hot tub?",
    default: false,
  });

  const willNeedASuit = await confirm({
    message: "Will you need a suit?",
    default: false,
  });

  const willBeWorking = await confirm({
    message: "Will you be working?",
    default: false,
  });

  const willHaveLaundry = await confirm({
    message: "Are you planning to do laundry?",
    default: false,
  });

  const workouts = await number({
    message: "How many workouts are you doing?",
    default: 0,
  });

  const lowTemperature = await number({
    message: "What's the low temperature?",
    required: true,
  });

  const highTemperature = await number({
    message: "What's the high temperature?",
    required: true,
  });

  const rainDays = await number({
    message: "How many rain days?",
    default: 0,
  });

  const flights = await number({
    message: "How many flights?",
    default: 0,
  });

  const areThereBugs = await confirm({
    message: "Will there be bugs?",
    default: false,
  });

  const extras = await checkbox({
    message: "Any extras?",
    choices: [
      { value: "drinks", name: "drinks" },
      { value: "bluetooth speaker", name: "bluetooth speaker" },
      { value: "cards", name: "cards" },
      { value: "chess set", name: "chess set" },
      { value: "Instax", name: "Instax" },
      { value: "head lamp", name: "head lamp" },
      { value: "slippers", name: "slippers" },
      { value: "presents", name: "presents" },
      { value: "battery charger", name: "battery charger" },
      { value: "travel adapter", name: "travel adapter" },
      { value: "dock bag", name: "dock bag" },
    ],
  });

  return {
    destination,
    departureDate,
    returnDate,
    leavingCanada,
    accessToBodyOfWater,
    willNeedASuit,
    willBeWorking,
    willHaveLaundry,
    workouts: workouts ?? 0,
    lowTemperature: lowTemperature!,
    highTemperature: highTemperature!,
    rainDays: rainDays ?? 0,
    flights: flights ?? 0,
    areThereBugs,
    extras,
  };
};
