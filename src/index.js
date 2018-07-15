const inquirer = require( 'inquirer' );
const questions = require( './questions' );

const createPackingList = answers => {

  const {
    tripType,
    vibe,
    accommodations,
    travelMethod,
    nightsOfSleep,
    accessToBodyOfWater,
    sportsDays,
    rainDays,
    leavingCanada,
    drivingHours,
    peopleInCar,
    lowTemperature,
    highTemperature,
  } = answers;

  const
    willNeedASuit = tripType === 'Wedding',
    isFreeToGroom = tripType === 'Wedding' || vibe === 'Classy' || vibe === 'Casual',
    willNeedToShave = tripType === 'Wedding' || vibe === 'Classy',
    isStayingWithFriends = accommodations === 'Friends',
    isShortsWeather = lowTemperature > 20;

  let bottomsType = 'jeans';

  if ( vibe === 'Classy' ) {
    bottomsType = 'slacks';
  } else if ( vibe === 'Casual' ) {
    if ( tripType === 'Road Trip' || tripType === 'Cottage' ) {
      bottomsType = isShortsWeather ? 'gym shorts' : 'track pants';
    } else {
      bottomsType = isShortsWeather ? 'shorts' : 'jeans';
    }
  } else if ( vibe === 'Lazy' ) {
    bottomsType = isShortsWeather ? 'gym shorts' : 'track pants';
  }


  let dopp = [
    'toothbrush',
    'toothpaste',
    'tongue brush',
    'floss',
  ];

  if ( isFreeToGroom ) {
    dopp = dopp.concat([
      `${ nightsOfSleep + 1 } floss threaders`,
      'mouthwash',

      'cleanser',
      'moisturizer',
      'deodorant',

      'tissues',
    ]);
  }

  if ( lowTemperature < 15 ) dopp.push('lip balm');

  if ( ( sportsDays < nightsOfSleep ) && vibe !== 'Lazy' ) {
    dopp.push( 'cologne' );
    dopp.push( 'hair gel' );
  }

  if ( nightsOfSleep < 3 ) {
    dopp.push( `${ nightsOfSleep + 1 } daily contacts` );
  } else {
    dopp.push( 'contact lens case' );
    dopp.push( 'contact lens fluid' );
  }

  if ( nightsOfSleep > 3 && isStayingWithFriends ) dopp.push( 'shampoo' );
  if ( accommodations !== 'Hotel' ) dopp.push( 'shower gel' );
  dopp.push( 'loofah' );

  let shavingKit = [];

  if ( willNeedToShave ) {
    shavingKit = [
      'shaving cream',
      'razor',
      'alum',
      'nail scissors',
      'nail file',
    ];
  }

  dopp.push( 'tums, advil, imodium' );

  const duffel = [];

  const setsOfClothes = Math.min( nightsOfSleep + 1, 6 );

  duffel.push( `${ setsOfClothes } underwear` );
  if ( lowTemperature > 25 ) {
    duffel.push( `${ Math.floor( setsOfClothes / 2 ) } socks` );
  } else {
    duffel.push( `${ setsOfClothes } socks` );
  }
  duffel.push( `${ setsOfClothes } t-shirts` );

  if ( lowTemperature < 15 ) {
    duffel.push( `${ Math.min( Math.ceil( nightsOfSleep / 3 ), 3 ) } sweaters` );
  }

  duffel.push( `${ Math.min( Math.floor( nightsOfSleep / 3 ), 3 ) } ${ bottomsType }` );

  if ( sportsDays > 0 ) {
    duffel.push( `${ sportsDays } tank tops` );
    duffel.push( `${ sportsDays } shorts` );
    duffel.push( `${ sportsDays } sports socks` );
    duffel.push( `${ sportsDays } sports underwear` );
    duffel.push( 'cross-training shoes' );
  }

  if ( ( nightsOfSleep > 4 && highTemperature < 20 ) || rainDays > 1 ) {
    duffel.push( 'second pair of shoes' );
  }

  if ( willNeedASuit ) {
    duffel.push( 'suit' );
    duffel.push( 'formal shoes' );
    duffel.push( 'formal belt' );
    duffel.push( 'tie' );
    duffel.push( 'dress shirt' );
    duffel.push( 'dress socks' );
  }

  const backpack = [
    'sunglasses in case',
    'glasses in case',
    'book',
    'phone charger',
    'garbage bag',
  ];

  if ( highTemperature > 10 ) backpack.push( 'sunscreen' );
  if ( rainDays > 1 ) backpack.push( 'umbrella' );

  if ( drivingHours > 2 && peopleInCar > 1 ) {
    backpack.push( `${ peopleInCar * drivingHours * 50 + nightsOfSleep * 200 } calories of snacks` );
  } else if ( !leavingCanada && nightsOfSleep < 4 ) {
    backpack.push( `${ nightsOfSleep * 200 } calories of snacks` );
  }

  if ( accessToBodyOfWater ) {
    duffel.push( 'swim trunks' );
    if ( accommodations !== 'Hotel' ) duffel.push( 'beach towel' );
    duffel.push( 'flip flops' );
  } else {
    if ( accommodations !== 'Hotel' ) duffel.push( 'travel towel' );
  }

  if ( nightsOfSleep > 4 ) {
    backpack.push( 'pack of cards' );
  }

  if ( nightsOfSleep > 5 ) {
    duffel.push( `${ Math.max( Math.floor( nightsOfSleep / 5 ), 1 ) } laundry pods` );
  }

  if ( lowTemperature < 10 ) duffel.push( 'slippers' );

  if ( isStayingWithFriends ) {
    duffel.push( 'sleep shorts or pajama pants' );
    backpack.push( 'bottle of wine or a treat' );
  }

  if ( nightsOfSleep > 2 ) {
    backpack.push( 'laptop and charger' );
  }

  if ( sportsDays > 0 ) {
    dopp.push( 'polysporin' );
    dopp.push( 'band-aids' );
  }

  if ( sportsDays > 0 || tripType === 'Road Trip' ) backpack.push( 'water bottle' );

  if ( travelMethod === 'Car' || tripType === 'Road Trip' ) backpack.push( 'aux cable' );
  if ( leavingCanada ) backpack.push( 'passport' );

  return {
    dopp,
    shavingKit,
    backpack,
    duffel,
  };
};

module.exports = () => {
  return inquirer.prompt( questions )
    .then( createPackingList );
};
