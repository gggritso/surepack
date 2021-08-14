const querystring = require("querystring");
const { format, subDays } = require("date-fns");

class ThingsFormatter {
  static format(data) {
    const formattedDepartureDate = `${format(data.departureDate, "MMM do")}`;
    const formattedReturnDate = `${format(data.returnDate, "MMM do")}`;
    const packingDate = subDays(data.departureDate, 1);
    const formattedPackingDate = `${format(packingDate, "MMM do")}`;

    const thingsData = [
      {
        type: "project",
        attributes: {
          title: `${data.destination}`,
          notes: `Leaving ${formattedDepartureDate}, coming back ${formattedReturnDate}`,
          items: [
            ...data.preDeparture.map((item) => ({
              type: "to-do",
              attributes: {
                title: item,
                when: formattedDepartureDate,
              },
            })),
            {
              type: "to-do",
              attributes: {
                title: "pack dopp",
                when: formattedPackingDate,
                "checklist-items": data.dopp.map((item) => ({
                  type: "checklist-item",
                  attributes: {
                    title: item,
                  },
                })),
              },
            },
            {
              type: "to-do",
              attributes: {
                title: "pack backpack",
                when: formattedDepartureDate,
                "checklist-items": data.backpack.map((item) => ({
                  type: "checklist-item",
                  attributes: {
                    title: item,
                  },
                })),
              },
            },
            {
              type: "to-do",
              attributes: {
                title: "pack duffel",
                when: formattedPackingDate,
                "checklist-items": data.duffel.map((item) => ({
                  type: "checklist-item",
                  attributes: {
                    title: item,
                  },
                })),
              },
            },
            ...data.postArrival.map((item) => ({
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

    return "things:///json?data=" + querystring.escape(JSON.stringify(thingsData));
  }
}

module.exports = ThingsFormatter;
