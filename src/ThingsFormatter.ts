import querystring from "node:querystring";
import { addDays, format } from "date-fns";
import type { PackingList } from "./types/types";

interface ChecklistItem {
  type: string;
  attributes: {
    title: string;
  };
}

interface ThingsItem {
  type: string;
  attributes: {
    title: string;
    when?: string;
    "checklist-items"?: ChecklistItem[];
  };
}

export class ThingsFormatter {
  static format(data: PackingList): string {
    const formattedDepartureDate = `${format(data.departureDate, "MMM do")}`;
    const formattedReturnDate = `${format(data.returnDate, "MMM do")}`;

    // Build container pack tasks
    const containerTasks = data.containers.map((container) => {
      const when = `${format(addDays(data.departureDate, container.packDayOffset), "MMM do")}`;

      return {
        type: "to-do",
        attributes: {
          title: `pack ${container.name.toLowerCase()}`,
          when,
          "checklist-items": container.asList().map((item): ChecklistItem => ({
            type: "checklist-item",
            attributes: {
              title: item,
            },
          })),
        },
      };
    });

    const thingsData = [
      {
        type: "project",
        attributes: {
          title: `${data.destination}`,
          notes: `Leaving ${formattedDepartureDate}, coming back ${formattedReturnDate}`,
          items: [
            ...data.preDeparture.toArray().map((item): ThingsItem => ({
              type: "to-do",
              attributes: {
                title: item,
                when: formattedDepartureDate,
              },
            })),
            ...containerTasks,
            ...data.postArrival.toArray().map((item): ThingsItem => ({
              type: "to-do",
              attributes: {
                title: item,
                when: formattedReturnDate,
              },
            })),
          ],
        },
      },
    ];

    return `things:///json?data=${querystring.escape(JSON.stringify(thingsData))}`;
  }
}
