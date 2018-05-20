#!/usr/bin/env node
const fs = require( 'fs' );
const handlebars = require( 'handlebars' );

const surepack = require( '../src/index' );

const path = __dirname + '/../src/taskpaper.handlebars';
const template = handlebars.compile( fs.readFileSync( path ).toString() );

console.log( template( surepack() ) );
