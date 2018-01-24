var error = require('error-reporting'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    email = process.env.MAILER_EMAIL,
    password = process.env.MAILER_PASSWORD;

// initialize transport
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
      user: email,
      pass: password
  }
}));

// initialize error reporting library
error.init({
    transporter: transporter,
    from: email,
    to: email,
    subject: 'API Navigator has encountered an error',
    interval: 60
});

module.exports = {
  send: function(file, request, msg, user) {
    var err = new Error();
    error.report('A message about your error', {objectThatCasedTheError: {file: file, request: request, message: msg, user: user}}, err.stack);
  }
}
