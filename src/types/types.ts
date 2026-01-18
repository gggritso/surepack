import type { Container } from "../container";
import type { Checklist } from "../checklist";

export interface PackingList {
  name: string;
  destination: string;
  departureDate: Date;
  returnDate: Date;
  preDeparture: Checklist;
  containers: Container[];
  postArrival: Checklist;
}

export interface ContainerItem {
  item: string;
  quantity: number;
}

export type ContainerAffinity = "backpack" | "dopp" | "main";

export interface ManifestItem {
  name: string;
  quantity: number;
  affinity: ContainerAffinity;
}

export interface Answers {
  destination: string;
  departureDate: Date;
  returnDate: Date;
  accessToBodyOfWater: boolean;
  willBeWorking: boolean;
  willNeedASuit: boolean;
  willHaveLaundry: boolean;
  workouts: number;
  rainDays: number;
  flights: number;
  areThereBugs: boolean;
  leavingCanada: boolean;
  lowTemperature: number;
  highTemperature: number;
  extras: string[];
}
