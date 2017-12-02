# SMTP Email Verification

### Install

```
npm install -g email-verify
```

#### Important Note

If you upgrade to > 0.0.12 from a previous version, you will need to make minor changes in your code. The callback was made to be error first.

### Usage
You can use it stand alone with the email-verify command and as many email addresses as you want to check.

```
email-verify addr1@domain.com addr2@anotherdomain.com
```

Using -d

```
email-verify -d domain.com addr1 addr2 addr3
```

Using -d -s, checking the standard email addresses

```
email-verify -d domain.com -s
```

Using -d -n, checking for variations of a name [-n firstname lastname]

```
email-verify -d domain.com -n firstname lastname
```

Using it in a more complicated way

```
email-verify -d domainA.com addr1 addr2 -n firstname1 lastname1 -d domainB -n firstname2 lastname2
```

Each time you use -d, it treats everything after it as that domain until another domain is used. Until you use -d, it treats it as there is no domain so you can't do -s or -n.

Other options supported are -p _port_, -t _timeout_, -sd _sender@email.com_, -f _FDQN_, -dns _DNSIPADDRESS_, -c _concurrency_, --file / -file _FILEPATH_

The FDQN is used on the first HELO of the SMTP protocol. Defaults for the sender are name@example.org and default for the FDQN is mail.example.org. Strongly suggested that you change these. (Previous ones used my email / domain, just removed that)



The module has one asynchronous method: verify( email, _options_, callback )

### Callback
The callback is a function(err, info) that has an info object:
```
{
  success: boolean
  info: string
  addr: the address being verified
  code: info code saying things on verification status
  banner: how server advertize itself
}
```

### Options
The options are:
```
{
  port : integer, port to connect with defaults to 25
  sender : email, sender address, defaults to name@example.org
  timeout : integer, socket timeout defaults to 0 which is no timeout
  fqdn : domain, used as part of the HELO, defaults to mail.example.org
  dns: ip address, or array of ip addresses (as strings), used to set the servers of the dns check,
  ignore: set an ending response code integer to ignore, such as 450 for greylisted emails
}
```

### Flow

The basic flow is as follows:

1. Validate it is a proper email address
2. Get the domain of the email
3. Grab the DNS MX records for that domain
4. Create a TCP connection to the smtp server
5. Send a EHLO message
6. Send a MAIL FROM message
7. Send a RCPT TO message
8. If they all validate, return an object with success: true. If any stage fails, the callback object will have success: false.

This module has tests with Mocha. Run `npm test` and make sure you have a solid connection.

Use (also see the app.js file):

```javascript
var verifier = require('email-verify');
var infoCodes = verifier.infoCodes;

verifier.verify( 'anemail@domain.com', function( err, info ){
  if( err ) console.log(err);
  else{
    console.log( "Success (T/F): " + info.success );
    console.log( "Info: " + info.info );

    //Info object returns a code which representing a state of validation:

    //Connected to SMTP server and finished email verification
    console.log(info.code === infoCodes.finishedVerification);

    //Domain not found
    console.log(info.code === infoCodes.domainNotFound);

    //Email is not valid
    console.log(info.code === infoCodes.invalidEmailStructure);

    //No MX record in domain name
    console.log(info.code === infoCodes.noMxRecords);

    //SMTP connection timeout
    console.log(info.code === infoCodes.SMTPConnectionTimeout);

    //SMTP connection error
    console.log(info.code === infoCodes.SMTPConnectionError)
  }
});
```

### Changes
0.0.10 -> 0.0.11 : changed "CR" to "CRLF" as per SMTP Standard. Added a QUIT message so that the connection is closed from both ends. (thanks @Nomon)

0.0.11 -> 0.0.12 : some refactoring and styles from james075. important to note, the callback order was changed to be error first. if you upgrade to here, you will need to modify your existing code.

0.0.12 -> 0.0.13 : fix cli -t timeout option

0.0.13 -> 0.0.14 : fix on error callback order
                   added the capability to specify the DNS servers for the MX record checking programatically and via cli

0.0.14 -> 0.0.15 : prevent socket from writing after end event fires

0.0.15 -> 0.0.16 : added an ignore option for ignoring greylisted responses

0.0.16 -> 0.0.17 : sancowinx added a file option for the command line

0.0.17 -> 0.0.18 : zh99998 added concurrency to the command line options by adding bluebird

0.0.18 -> 0.1.0  : refactored the verify function to make it compatible with promisfy (bluebird)
                   included changes from Bramzor to allow for greylisting rechecking and to allow for weird addresses more aligned to the RFCs
                   removed the lodash dependency

0.1.0 -> 0.1.1   : fones fixed a typo for the fqdn parameter and added some logging

0.1.1 -> 0.2.0   : provide banner object in callback, use more actual dependencies, properly call mocha for unit tests

0.2.0 -> 0.2.1   : derain adding a return code, robert-irribarren adding try-again / fixes, bryant1410 fixing markdown thanks all! sorry for the late merges!
