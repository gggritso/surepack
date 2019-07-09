const inquirer = require( 'inquirer' );
inquirer.registerPrompt( 'datetime', require( 'inquirer-datepicker-prompt' ) );

const questions = require( './questions' );
const Container = require ( './container' );

const createPackingList = answers => {

  const {
    name,
    tripType,
    vibe,
    accommodations,
    travelMethod,
    departureDate,
    returnDate,
    accessToBodyOfWater,
    willBeWorking,
    willBeBugs,
    sportsDays,
    rainDays,
    leavingCanada,
    drivingHours,
    peopleInCar,
    lowTemperature,
    highTemperature,
  } = answers;

  const
    willNeedASuit = tripType === 'Wedding' || vibe === 'Classy',
    isStayingWithFriends = accommodations === 'Friends',
    isShortsWeather = lowTemperature > 20,
    nightsOfSleep = Math.floor( ( returnDate - departureDate ) / ( 1000 * 60 * 60 * 24 ) );

  const preDeparture = new Container( 'Pre-departure' );

  preDeparture.addOneOfEach( 'close all windows' );

  if ( leavingCanada || nightsOfSleep > 3 ) {
    preDeparture.addOneOfEach( 'set thermostat to vacation', 'set vacation on CondoControlCentral', 'take out trashes', 'run dishwasher' );
  }

  preDeparture.add( 'take out compost' );

  const dopp = new Container( 'Dopp',
    [ 'toothbrush', 'toothpaste', 'tongue brush', 'floss' ]);

  dopp
    .pack( 'floss threaders', nightsOfSleep + 1 )
    .packOneOfEach( 'mouthwash', 'cleanser', 'moisturizer', 'deodorant', 'tissues', 'lip balm', 'cologne', 'hair gel' );

  if ( nightsOfSleep < 3 ) {
    dopp.pack( 'daily contact', nightsOfSleep + 1 );
  } else {
    dopp.pack( 'contact lens case' );
    dopp.pack( 'contact lens fluid' );
  }

  if ( nightsOfSleep > 3 ) dopp.pack( 'shampoo' );
  dopp.pack( 'shower gel' );
  dopp.pack( 'loofah' );
  dopp.pack( 'basic meds' );
  
  if ( nightsOfSleep > 2 ) dopp.pack( 'condoms' );

  const duffel = new Container( 'Duffel' );

  let setsOfClothes = Math.min( nightsOfSleep + 1, 6 );

  if ( nightsOfSleep === 1 && vibe === 'Lazy' ) setsOfClothes = 1;

  duffel.pack( 'underwear', setsOfClothes );
  duffel.pack( 'socks', setsOfClothes );
  duffel.pack( 't-shirt', setsOfClothes );

  if ( lowTemperature < 15 ) {
    duffel.pack( 'sweater', Math.min( Math.ceil( nightsOfSleep / 3 ), 3 ) );
  }

  duffel.pack( isShortsWeather ? 'shorts' : 'pants', Math.min( Math.floor( nightsOfSleep / 3 ), 3 ) );
  duffel.pack( 'tank top' );
  duffel.pack( lowTemperature < 10 ? 'track pants' : 'gym shorts' ); 

  if ( sportsDays > 0 ) {
    duffel.pack( 'tank top', sportsDays );
    duffel.pack( 'shorts', sportsDays );
    duffel.pack( 'sports socks', sportsDays );
    duffel.pack( 'sports underwear', sportsDays );
    duffel.pack( 'cross-training shoes' );
  }

  if ( ( nightsOfSleep > 4 && highTemperature < 20 ) || rainDays > 1 ) {
    duffel.pack( 'second pair of shoes' );
  }

  if ( willNeedASuit ) {
    duffel.packOneOfEach(
      'suit',
      'formal shoes',
      'formal belt',
      'tie',
      'dress shirt',
      'dress socks' );
  }

  if ( willBeBugs ) {
    duffel.pack( 'high socks' );
  }

  const backpack = new Container( 'Backpack', [
    'sunglasses in case',
    'glasses in case',
    'Kindle',
    'phone charger',
    'garbage bag',
  ]);

  if ( highTemperature > 10 ) backpack.pack( 'sunscreen' );
  if ( rainDays > 1 ) backpack.pack( 'umbrella' );

  if ( drivingHours > 1 ) {
    backpack.pack( 'water bottle' );
  }

  if ( drivingHours > 1 && peopleInCar > 1 ) {
    backpack.pack( 'calories of snacks', peopleInCar * drivingHours * 100 );
  }

  if ( accessToBodyOfWater ) {
    duffel.pack( 'swim trunks' );
    if ( accommodations !== 'Hotel' ) duffel.pack( 'beach towel' );
    duffel.pack( 'flip flops' );
  } else {
    if ( accommodations !== 'Hotel' ) duffel.pack( 'travel towel' );
  }

  if ( nightsOfSleep > 4 ) {
    backpack.pack( 'pack of cards' );
  }

  if ( nightsOfSleep > 5 ) {
    duffel.pack( 'laundry pods', Math.max( Math.floor( nightsOfSleep / 5 ), 1 ) );
  }

  if ( lowTemperature < 10 ) duffel.pack( 'slippers' );

  if ( isStayingWithFriends ) {
    duffel.pack( 'sleep shorts or pajama pants' );
    backpack.pack( 'bottle of wine or a treat' );
  }

  if ( willBeWorking || ( nightsOfSleep > 3 ) ) {
    backpack.pack( 'laptop and charger' );
  }

  if ( sportsDays > 0 ) {
    dopp.pack( 'polysporin' );
    dopp.pack( 'band-aids' );
  }

  if ( sportsDays > 0 || tripType === 'Road Trip' ) backpack.pack( 'water bottle' );

  if ( travelMethod === 'Car' || tripType === 'Road Trip' ) backpack.pack( 'aux cable' );
  if ( leavingCanada ) {
    backpack.pack( 'passport' );
    backpack.pack( 'SIM tool' );
    backpack.pack( 'pen' );
    backpack.pack( 'local currency' );
    backpack.pack( 'transit pass' );
  }

  const postArrival = new Container( 'Post-arrival' );

  postArrival.add( 'unpack' );

  return {
    name: name,
    preDeparture: preDeparture.asList(),
    dopp: dopp.asList(),
    backpack: backpack.asList(),
    duffel: duffel.asList(),
    postArrival: postArrival.asList(),
  };
};

module.exports = () => {
  return inquirer.prompt( questions )
    .then( createPackingList );
};
