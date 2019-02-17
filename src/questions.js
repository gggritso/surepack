module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'What are you calling this trip?'
  },
  {
    type: 'list',
    name: 'tripType',
    message: 'What kind of trip is it?',
    choices: [
      'City Visit',
      'Cottage',
      'Road Trip',
      'Wedding',
    ],
    default: 'City Visit',
  },
  {
    type: 'list',
    name: 'accommodations',
    message: 'Where are you living?',
    choices: [
      'Friends',
      'AirBnB',
      'Hotel',
    ],
  },
  {
    type: 'list',
    name: 'travelMethod',
    message: 'How are you getting there?',
    choices: [
      'Car',
      'Plane',
      'Train',
    ],
    default: 'Car',
  },
  {
    type: 'list',
    name: 'vibe',
    message: 'What’s the vibe?',
    choices: [
      'Classy',
      'Casual',
      'Lazy',
    ],
    default: 'Casual',
  },
  {
    type: 'input',
    name: 'nightsOfSleep',
    message: 'How many nights of sleep?',
    filter: parseInt,
  },
  {
    type: 'confirm',
    name: 'leavingCanada',
    message: 'Leaving Canada?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'accessToBodyOfWater',
    message: 'Access to water or hot tub?',
    default: false,
  },
  {
    type: 'confirm',
    name: 'willBeWorking',
    message: 'Will you be working?',
    default: false,
  },
  {
    type: 'input',
    name: 'sportsDays',
    message: 'How many sports days?',
    filter: parseInt,
    default: 0,
  },
  {
    type: 'input',
    name: 'drivingHours',
    message: 'How many hours of driving to get there?',
    filter: parseInt,
    default: 0,
    when: answers => {
      return answers.travelMethod === 'Car';
    },
  },
  {
    type: 'input',
    name: 'peopleInCar',
    message: 'How many people in the car',
    filter: parseInt,
    default: 2,
    when: answers => {
      return answers.travelMethod === 'Car';
    },
  },
  {
    type: 'input',
    name: 'lowTemperature',
    message: 'What’s the low temperature?',
    filter: parseInt,
  },
  {
    type: 'input',
    name: 'highTemperature',
    message: 'What’s the high temperature?',
    filter: parseInt,
  },
  {
    type: 'input',
    name: 'rainDays',
    message: 'How many rain days?',
    filter: parseInt,
    default: 0,
  },
  {
    type: 'confirm',
    name: 'specialCircumstances',
    message: 'Are there any special circumstances you’re forgetting?',
    default: true,
  },
  {
    type: 'confirm',
    name: 'specialCircumstancesConfirm',
    message: 'Are you sure?',
    default: false,
  },
];
