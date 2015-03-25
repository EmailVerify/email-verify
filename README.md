#SMTP Email Verification

##Install

```
npm install -g email-verify
```

##Usage
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

Other options supported are -p _port_, -t _timeout_, -sd _sender@email.com_, -f _FDQN_

The FDQN is used on the first HELO of the SMTP protocol. Defaults for the sender are name@example.org and default for the FDQN is mail.example.org. Strongly suggested that you change these. (Previous ones used my email / domain, just removed that)

The module has one asynchronous method: verify( email, _options_, callback )

#Callback
The callback is a function(err, info) that has an info object:
```
{
  success: boolean
  info: string
  addr: the address being verified
}
```

#Options
The options are:
```
{
  port : integer, port to connect with defaults to 25
  sender : email, sender address, defaults to name@example.org
  timeout : integer, socket timeout defaults to 0 which is no timeout
  fdqn : domain, used as part of the HELO, defaults to mail.example.org
}
```

#Flow

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

Use:

```
var verifier = require('email-verify');
verifier.verify( 'anemail@domain.com', function( err, info ){
  if( err ) console.log(err);
  else{
    console.log( "Success (T/F): " + info.success );
    console.log( "Info: " + info.info );
  }
});
```

### Changes

0.0.10 -> 0.0.11 : changed "CR" to "CRLF" as per SMTP Standard. Added a QUIT message so that the connection is closed from both ends. (thanks @Nomon)
