SMTP Email Verification

The module has one asynchronous method: verify( email, callback )

The callback is a function( info, err ) that has an info object:
{
  success: boolean
  info: string
}

The basic flow is as follows:

1. Validate it is a proper email address
2. Get the domain of the email
3. Grab the DNS MX records for that domain
4. Create a TCP connection to the smtp server
5. Send a EHLO message
6. Send a MAIL FROM message
7. Send a RCPT TO message
8. If they all validate, return an object with success: true. If any stage fails, the callback object will have success: false.
