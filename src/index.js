const inquirer = require( 'inquirer' );
const questions = require( './questions' );

const createPackingList = answers => {
  const toiletries = [];

  const {
    nightsOfSleep,
    formalDays,
    accessToBodyOfWater,
    lazy,
    accommodations,
    sportsDays,
    rainDays,
    leavingCanada,
    drivingHours,
    drivingPeople,
    lowTemperature,
    highTemperature,
  } = answers;

  const isStayingWithFriends = accommodations === 'Friends';
  const roughingIt = accommodations === 'Camping';

  toiletries.push( 'toothbrush' );
  toiletries.push( 'toothpaste' );
  toiletries.push( 'tongue brush' );
  toiletries.push( 'floss' );
  toiletries.push( `${ nightsOfSleep + 1 } threaders` );
  toiletries.push( 'mouthwash' );

  toiletries.push( 'cleanser' );
  toiletries.push( 'moisturizer' );
  toiletries.push( 'deodorant' );

  if ( ( sportsDays < nightsOfSleep ) && !lazy ) {
    toiletries.push( 'cologne' );
    toiletries.push( 'hair gel' );
  }

  toiletries.push( 'lip balm' );
  toiletries.push( 'tissues' );

  if ( nightsOfSleep > 3 && isStayingWithFriends ) toiletries.push( 'shampoo' );
  if ( accommodations !== 'Hotel' && accommodations !== 'Camping' ) toiletries.push( 'shower gel' );
  toiletries.push( 'loofah' );

  toiletries.push( 'sunglasses' );
  toiletries.push( 'glasses' );

  if ( nightsOfSleep < 3 || roughingIt ) {
    toiletries.push( `${ nightsOfSleep + 1 } daily contacts` );
  } else {
    toiletries.push( 'contact lens case' );
    toiletries.push( 'contact lens fluid' );
  }

  if ( ( nightsOfSleep > 4 || formalDays > 0 ) && !lazy ) {
    toiletries.push( 'shaving cream' );
    toiletries.push( 'razor' );
    toiletries.push( 'alum' );
    toiletries.push( 'nail scissors' );
    toiletries.push( 'nail file' );
  }

  toiletries.push( 'tums, advil, imodium' );

  const clothing = [];

  clothing.push( `${ Math.min( nightsOfSleep + 1, 6 ) } underwear` );
  clothing.push( `${ Math.min( ( nightsOfSleep - formalDays ) + 1, 6 ) } socks` );
  clothing.push( `${ Math.min( ( nightsOfSleep - formalDays ) + 1, 6 ) } t-shirts` );

  if ( lowTemperature < 20 ) {
    clothing.push( `${ Math.min( Math.ceil( nightsOfSleep / 3 ), 3 ) } sweaters` );
  }

  clothing.push( `${ Math.min( Math.floor( nightsOfSleep / 3 ), 3 ) } bottoms` );

  if ( sportsDays > 0 ) {
    clothing.push( `${ sportsDays } tank tops` );
    clothing.push( `${ sportsDays } shorts` );
    clothing.push( `${ sportsDays } sports socks` );
    clothing.push( `${ sportsDays } sports underwear` );
    clothing.push( 'cross-training shoes' );
  }

  if ( ( nightsOfSleep > 4 && highTemperature < 20 ) || rainDays > 1 ) {
    clothing.push( 'second pair of shoes' );
  }

  if ( formalDays > 0 ) {
    clothing.push( 'suit' );
    clothing.push( 'formal shoes' );
    clothing.push( 'formal belt' );
    clothing.push( 'tie' );
    clothing.push( `${ formalDays } dress shirts` );
    clothing.push( `${ formalDays } dress socks` );
  }

  const circumstances = [];

  if ( highTemperature > 10 ) {
    circumstances.push( 'sunscreen' );
  }

  if ( rainDays > 1 ) {
    circumstances.push( 'umbrella' );
  }

  if ( drivingHours > 2 && drivingHours < 10 && drivingPeople > 0 ) {
    circumstances.push( `${ drivingPeople * drivingHours * 50 + nightsOfSleep * 200 } calories of snacks` );
  } else if ( !leavingCanada && nightsOfSleep < 4 ) {
    circumstances.push( `${ nightsOfSleep * 200 } calories of snacks` );
  }

  if ( accessToBodyOfWater ) {
    circumstances.push( 'swim trunks' );
    circumstances.push( 'beach towel' );
    circumstances.push( 'flip flops' );
  } else {
    circumstances.push( 'travel towel' );
  }

  if ( nightsOfSleep > 4 && !leavingCanada ) {
    circumstances.push( 'indoor game or activity' );
  }

  if ( nightsOfSleep > 5 ) {
    circumstances.push( `${ Math.max( Math.floor( nightsOfSleep / 5 ), 1 ) } laundry pods` );
  }

  if ( lowTemperature < 10 && !roughingIt && !isStayingWithFriends ) {
    circumstances.push( 'slippers' );
  }

  if ( isStayingWithFriends ) {
    circumstances.push( 'sleep shorts or pajama pants' );
    circumstances.push( 'bottle of wine or a treat' );
  }

  const misc = [
    'book',
    'phone charger',
    'garbage bag',
  ];

  if ( ( nightsOfSleep > 2 || isStayingWithFriends ) && !lazy ) {
    misc.push( 'laptop and charger' );
  }

  if ( sportsDays > 0 ) {
    misc.push( 'polysporin' );
    misc.push( 'band-aids' );
  }

  if ( sportsDays > 0 || accommodations === 'Camping' ) {
    misc.push( 'water bottle' );
  }

  if ( drivingHours > 0 ) {
    misc.push( 'aux cable' );
  }

  if ( leavingCanada ) {
    misc.push( 'passport' );
  }

  return {
    toiletries,
    clothing,
    circumstances,
    misc,
  };
};

module.exports = () => {
  return inquirer.prompt( questions )
    .then( createPackingList );
};
