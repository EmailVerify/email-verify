
module.exports.verify = function (email, options, callback) {
  // Handle optional parameters
  if (!email || !options) {
    throw new Error("Missing parameters in email-verify.verify()");
  }
  else if (typeof callback === 'undefined' && options) {
    callback = options;
    options = {};
  }

  // Default Values
  if (options && !options.port) options.port = 25;
  if (options && !options.sender) options.sender = "name@example.org";
  if (options && !options.timeout) options.timeout = 0;
  if (options && !options.fqdn) options.fqdn = "mail.example.org";

  var validator = require('email-validator');

  if (!validator.validate(email)) {
      callback(null, { success: false, info: "Invalid Email Structure", addr: email });
      return false;
  }

  // Get the domain of the email address
  var domain = email.split(/[@]/)[1];

  var dns = require('dns');


  // Get the MX Records to find the SMTP server
  dns.resolveMx(domain, function(err,addresses) {
    if (err || (typeof addresses === 'undefined')) {
      callback(err, null);
    }
    else if (addresses && addresses.length <= 0) {
      callback(null, { success: false, info: "No MX Records" });
    }
    else{
        // Find the lowest priority mail server
        var priority = 10000;
        var index = 0;
        for (var i = 0 ; i < addresses.length ; i++) {
            if (addresses[i].priority < priority) {
                priority = addresses[i].priority;
                index = i;
            }
        }
        var smtp = addresses[index].exchange;
        var stage = 0;

        var net = require('net');
        var socket = net.createConnection(options.port, smtp);
        var success = false;
        var response = "";
        var completed = false;
        var calledback = false;

        if (options.timeout > 0) {
          socket.setTimeout(options.timeout, function() {
            if( !calledback ){
              calledback = true;
              callback(null,
                       {
                          success: false,
                          info: "Connection Timed Out",
                          addr: email
                       });
            }
            socket.destroy()
          });
        }



        socket.on('data', function(data) {
          response += data.toString();
          completed = response.slice(-1) === '\n';

          if (completed) {
              switch(stage) {
                  case 0: if (response.indexOf('220') > -1) {
                              // Connection Worked
                              socket.write("EHLO "+options.fqdn+"\r\n",function() { stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 1: if (response.indexOf('250') > -1) {
                              // Connection Worked
                              socket.write("MAIL FROM:<"+options.sender+">\r\n",function() { stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 2: if (response.indexOf('250') > -1) {
                              // MAIL Worked
                              socket.write("RCPT TO:<" + email + ">\r\n",function() { stage++; response = ""; });
                          }
                          else{
                              socket.end();
                          }
                          break;
                  case 3: if (response.indexOf('250') > -1) {
                              // RCPT Worked
                              success = true;
                          }
                          stage++;
                          response = "";
                          // close the connection cleanly.
                          socket.write("QUIT\r\n");
                          break;
                  case 4:
                    socket.end();
              }
          }
        }).on('connect', function(data) {

        }).on('error', function(err) {
          if( !calledback ){
            calledback = true;
            callback( err, { success: false, info: null, addr: email });
          }
        }).on('end', function() {
          if( !calledback ){
            calledback = true;
            callback(null, {
              success: success,
              info: (email + " is " + (success ? "a valid" : "an invalid") + " address"),
              addr: email });
          }
        });
    }
  });
  return true;
}
