const querystring = require("querystring");

class ThingsFormatter {
  static format(data) {
    const thingsData = [
      {
        type: "project",
        attributes: {
          title: `${data.destination}`,
          notes: `Leaving ${data.departureDate}, coming back ${data.returnDate}`,
          items: [
            ...data.preDeparture.map((item) => ({
              type: "to-do",
              attributes: {
                title: item,
              },
            })),
            {
              type: "to-do",
              attributes: {
                title: "pack dopp",
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
