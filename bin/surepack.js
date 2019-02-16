#!/usr/bin/env node

const fs = require( 'fs' );
const argv = require( 'yargs' ).argv;

const handlebars = require( 'handlebars' );

const surepack = require( '../src/index' );

const path = __dirname + '/../src/' + (argv.format || 'markdown' ) + '.handlebars';
const template = handlebars.compile( fs.readFileSync( path ).toString() );

surepack().then( packingList => {
  console.log( template( packingList ) );
});
