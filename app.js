#!/usr/bin/env node

var emailAddresses = process.argv.slice(2);

if (emailAddresses.length === 0) {
    throw new Error('You must provide one or more email addresses.');
}

emailAddresses.forEach(function (val, index, array) {
  var verifier = require( './index.js' );
  verifier.verify(val, function(info,err){
      if( err ) console.log(err);
      else console.log(info);
  });
});
