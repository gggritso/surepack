export interface PackingList {
	name: string;
	destination: string;
	departureDate: Date;
	returnDate: Date;
	preDeparture: string[];
	dopp: string[];
	backpack: string[];
	duffel: string[];
	postArrival: string[];
}

export interface ContainerItem {
	item: string;
	quantity: number;
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
	areThereBugs: boolean;
	leavingCanada: boolean;
	lowTemperature: number;
	highTemperature: number;
	extras: string[];
}

export interface ThingsItem {
	type: string;
	attributes: {
		title: string;
		when?: string;
		"checklist-items"?: ChecklistItem[];
	};
}

export interface ChecklistItem {
	type: string;
	attributes: {
		title: string;
	};
}
