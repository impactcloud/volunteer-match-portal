/**
 * Load all controllers
 */
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// load routes
router.use('/files', auth, require('./files'));
router.use('/user', require('./user'));
router.use('/oauth2', auth, require('./oauth2'));

/**
 * Home page route
 * If user is already logged in, redirect to ""/files" page
 */
router.get('/', function(req, res) {

  var boxAuthUrl = 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id=' +
    process.env.BOX_AUTH_CLIENT_ID + '&state=security_token%YOUR_SECURITY_TOKEN';

  // generate a url that asks permissions for Google+ and Google Calendar scopes
  var scopes = [
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/userinfo.email'
  ];

  var googleAuthUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as string
    scope: scopes
  });


  // If the user is logged in, send them to their files page
	if (req.session && req.session.email) {
		res.redirect('/files');
  // else user is logged out, render the home page
  } else {
    res.render('pages/home', {
      boxAuthUrl: boxAuthUrl,
      googleAuthUrl: googleAuthUrl
    });
	}
});

/**
 * Resurface API request/response to the browser, called via AJAX
 */
router.get('/refresh_box_api', function(req, res) {

  // build API request/response
  let api_info = {
    method: req.session.requestObj.method,
    api_call: req.session.requestObj.api_call,
    request_url: req.session.requestObj.request_url,
    header: req.session.requestObj.header,
    body: req.session.requestObj.body,
    results: JSON.stringify(req.session.responseObj, null, 3)
  };

  res.send(api_info);
});

module.exports = router;
