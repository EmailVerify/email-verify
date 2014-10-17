

module.exports.timeout = 1500;

module.exports.verify = function( email, callback ){
  var validator = require( 'email-validator' );
  if( !validator.validate(email) ){
      callback({ success: false, info: "Invalid Email Structure" }, null );
      return false;
  }

  // Get the domain of the email address
  var domain = email.split(/[@]/)[1];

  var dns = require('dns');

  // Get the MX Records to find the SMTP server
  dns.resolveMx(domain, function(err,addresses){
    if( err ) callback(null,err);

    if( addresses.length < 0 ){
        callback({ success: false, info: "No MX Records" }, null );
    }
    else{
        // Find the lowest priority mail server
        var priority = 10000;
        var index = 0;
        for( var i = 0 ; i < addresses.length ; i++ ){
            if( addresses[i].priority < priority ){
                priority = addresses[i].priority;
                index = i;
            }
        }
        var smtp = addresses[index].exchange;
        var stage = 0;

        var net = require( 'net' );
        var socket = net.createConnection( 25, smtp );
        var success = false;
        var response = "";
        var completed = false;

        socket.on('data', function(data) {
          response += data.toString();
          completed = response.slice(-1) === '\n';

          if( completed ) {
              switch(stage){
                  case 0: if( response.indexOf('220') > -1 ){
                              // Connection Worked
                              socket.write("EHLO rob\n",function(){ stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 1: if( response.indexOf('250') > -1 ){
                              // Connection Worked
                              socket.write("MAIL FROM:<rob@below.io>\n",function(){ stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 2: if( response.indexOf('250') > -1 ){
                              // MAIL Worked
                              socket.write("RCPT TO:<" + email + ">\n",function(){ stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 3: if( response.indexOf('250') > -1 ){
                              // RCPT Worked
                              success = true;
                              socket.end();
                          }
                          else{
                              socket.end();
                          }
                          break;
              }
          }


        }).on('connect', function(data) {

        }).on('error', function(err) {
          callback({ success: false, info: null }, err );
        }).on('end', function() {
          callback({ success: success, info: (email + " is " + (success ? "a valid" : "an invalid") + " address") }, null );
        });

    }
  });
  return true;
}
