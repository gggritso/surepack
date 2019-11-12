module.exports = [
  {
    type: "input",
    name: "name",
    message: "What are you calling this trip?",
    default: "My Trip"
  },
  {
    type: "datetime",
    name: "departureDate",
    message: "When are you heading out?",
    format: ["d", "/", "mmm"]
  },
  {
    type: "datetime",
    name: "returnDate",
    message: "When are you heading back?",
    format: ["d", "/", "mmm"]
  },
  {
    type: "confirm",
    name: "leavingCanada",
    message: "Leaving Canada?",
    default: false
  },
  {
    type: "confirm",
    name: "accessToBodyOfWater",
    message: "Access to water or hot tub?",
    default: false
  },
  {
    type: "confirm",
    name: "willNeedASuit",
    message: "Will you need a suit?",
    default: false
  },
  {
    type: "confirm",
    name: "willBeWorking",
    message: "Will you be working?",
    default: false
  },
  {
    type: "confirm",
    name: "willHaveLaundry",
    message: "Will you have access to laundry?",
    default: false
  },
  {
    type: "confirm",
    name: "willBeBugs",
    message: "Will there be bugs?",
    default: false
  },
  {
    type: "input",
    name: "workouts",
    message: "How many workkouts are you doing?",
    filter: parseInt,
    default: 0
  },
  {
    type: "input",
    name: "lowTemperature",
    message: "What’s the low temperature?",
    filter: parseInt
  },
  {
    type: "input",
    name: "highTemperature",
    message: "What’s the high temperature?",
    filter: parseInt
  },
  {
    type: "input",
    name: "rainDays",
    message: "How many rain days?",
    filter: parseInt,
    default: 0
  }
];
