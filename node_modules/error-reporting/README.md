# error-reporting
Reporting errors to email.

## Usage

Usage of this library is fairly simple. All you need to do is to initialize the library and nodemailer's transport and
you can start reporting errors immediately.

```js
var error = require('error-reporting');
var nodemailer = require('nodemailer');

// initialize transport
var ses = require('nodemailer-ses-transport');
var transporter = nodemailer.createTransport(ses({
    accessKeyId: 'AWSACCESSKEY',
    secretAccessKey: 'AWS/Secret/key'
}));

// initialize error reporting library
error.init({
    transporter: transporter,
    from: 'me@developer.com',
    to: 'another@developer.com',
    subject: 'My Awesome application has encountered an error',
    interval: 60
});

// to report an error, just call error.report() anywhere in your application
var err = new Error();
error.report('A message about your error', {objectThatCasedTheError: {foo: 'bar'}}, err.stack);
```

## Configuration options

* **transporter** - Transporter for Nodemailer, see more about [SMTP transporter](https://nodemailer.com/2-0-0-beta/setup-smtp/) or [other transporters](https://nodemailer.com/2-0-0-beta/setup-transporter/). If transporter is not provided, then all errors are printed out to console with stacktrace.
* **from** - Any address format accepted by [Nodemailer](http://nodemailer.com/address-formatting/)
* **to** - Any address format accepted by [Nodemailer](http://nodemailer.com/address-formatting/)
* **cc** - Array of addresses, format must be accepted by [Nodemailer](http://nodemailer.com/address-formatting/), default is empty array
* **subject** - Subject of email, default is 'Error'
* **interval** - Interval in seconds for sending messages to email, defaults to 30. If set to 0 or null all errors are sent immediately. Please beware, as this might flood your email server.


## Changelog

Changelog is available under [GitHub releases section](https://github.com/Autlo/error-reporting/releases).
