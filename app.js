#!/usr/bin/env node

var arguments = process.argv.slice(2);

if (arguments.length === 0) {
    throw new Error('You must provide one or more email addresses.');
}

// Support -d domain name name name ...
// domain + names

// Support -d domain -s
// standard mails

// Support -d domain -n firstname lastname
// combinations of firstname lastname

var addresses = [];
var domain = null;
var err_msg = null;
var options = { port : 25, sender : "rob@below.io" };
for( var i = 0 ; i < arguments.length ; i++ )
{
  if( arguments[i] === '-d' ){
    if( arguments[++i] ){
      domain = "@" + arguments[i];
    }
    else{
      err_msg = "Malformed Domain Command"; break;
    }
  }
  else if( domain && arguments[i] === '-n' )
  {
    if( arguments[i+1] && arguments[i+2] ) {
      var first = arguments[++i];
      var firstletter = first.charAt(0);
      var last = arguments[++i];
      var lastletter = last.charAt(0);

      addresses.push( first + domain );
      addresses.push( last + domain );

      addresses.push( first + last + domain );
      addresses.push( first + '.' + last + domain );
      addresses.push( last + first + domain );
      addresses.push( last + '.' + first + domain );

      addresses.push( firstletter + last + domain );
      addresses.push( firstletter + '.' + last + domain );
      addresses.push( firstletter + lastletter + domain );
      addresses.push( firstletter + domain );

      addresses.push( last + firstletter + domain );
      addresses.push( last + '.' + firstletter + domain );
      addresses.push( first + lastletter + domain );
      addresses.push( first + '.' + lastletter + domain );

    }
    else {
      err_msg = "Malformed Domain Command"; break;
    }
  }
  else if( domain && arguments[i] === '-s' )
  {
    require( './standard.json' ).addresses.forEach( function (val, index, array) {
      addresses.push(val + domain);
    });
  }
  else if( arguments[i] === '-sd' && arguments[i+1] ){
    options.sender = arguments[++i];
  }
  else if( arguments[i] === '-p' && arguments[i+1] && arguments[i+1] % 1 === 0 ){
    options.port = arguments[++i];
  }
  else if( arguments[i] === '-t' && arguments[i+1] && arguments[i+1] % 1 === 0 ){
    options.timeout = arguments[++i];
  }
  else if( domain ){
    addresses.push( arguments[i] + domain );
  }
  else{
    addresses.push( arguments[i] );
  }


}

if( err_msg ) console.log( err_msg );
else{
    addresses.forEach( function (val, index, array ) {
      var verifier = require( './index.js' );
      verifier.verify(val, options, function(info,err){
          if( !err && info.success ) console.log(info.addr);
      });
    });
}
