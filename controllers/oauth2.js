/**
 * Oauth2 Auth Controller
 */
const express = require('express');
const router = express.Router();
//const errorReporting = require('../helpers/error-reporting');
const REDIRECT_URI = process.env.BASE_URL + process.env.REDIRECT_URI;
const BoxSDK = require('box-node-sdk');
    
const oauthSDK = new BoxSDK({
  clientID: process.env.OAUTH2_CLIENT_ID,
  clientSecret: process.env.OAUTH2_CLIENT_SECRET
});

/**
 * Fetch oauth2 auth stuff
 */
router.get('/', function(req, res) {

  // refresh request/response
  if (req.query.init) {
    req.session.requestObj = req.session.responseObj = false;
  }

  var oauthUrl = 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id=' +
                  process.env.OAUTH2_CLIENT_ID + '&redirect_uri=' + REDIRECT_URI +
                  '&state=security_token%YOUR_SECURITY_TOKEN'

  if (req.session.responseObj && req.query.get_folder_items &&
      req.session.responseObj.accessToken) {

    var oauthClient = oauthSDK.getBasicClient(req.session.responseObj.accessToken);

    // Get the oauth user's files in their root folder
  	oauthClient.folders.getItems('0', null, function(err, data) {

      res.render('pages/oauth2', {
        // error: err,
        oauth2Tab: true,
        oauthUrl: oauthUrl,
        items: data ? data.entries: [],
        getFolderItems: true,
        request: req.session.requestObj,
        response: JSON.stringify(req.session.responseObj, null, '  ')
      });
    });
  } else {
    res.render('pages/oauth2', {
      // error: err,
      oauth2Tab: true,
      oauthUrl: oauthUrl,
      authUrl: true,
      request: req.session.requestObj,
      response: req.session.responseObj ? JSON.stringify(req.session.responseObj, null, '  ') : false
    });
  }
});


router.get('/callback', function(req, res) {

  //console.log('Callback');``

  var queryParams = {
    body: {
      grant_type: 'authorization_code',
      code: req.query.code,
      client_id: process.env.OAUTH2_CLIENT_ID,
      client_secret: process.env.OAUTH2_CLIENT_SECRET
    }
  };

  // get oauth tokens from auth code
  oauthSDK.getTokensAuthorizationCodeGrant(req.query.code, null, function(err, data) {

    if (err) {
      console.log(err);
      //errorReporting.send("oauth2.js", "/callback", err.message, req.session.email);
    }

    // build API request/response strings
    req.session.requestObj = {
      method: "POST",
      api_call: "Request Tokens",
      request_url: "https://upload.box.com/api/oauth2/token",
      header: null,
      body: JSON.stringify({ grant_type: 'authorization_code',
                                code: req.query.code,
                                client_id: 'YOUR_CLIENT_ID',
                                client_secret: 'YOUR_CLIENT_SECRET'})
    };
    req.session.responseObj = data;

    res.redirect('/oauth2?get_folder_items=true');
  });

});


module.exports = router;
