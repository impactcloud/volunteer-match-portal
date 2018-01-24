/**
 * Controller to handle user login/logouts
 * using the Users API endpoint
 */
const express = require('express');
const router = express.Router();
const util = require('util');
const fs = require('fs');
const path = require('path');
const auth = require('../middleware/auth');
const boxSDK = require('../helpers/box-sdk').boxSDK;
const errorReporting = require('../helpers/error-reporting');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const boxOauthSDK = require('box-node-sdk');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');

const oauthSDK = new boxOauthSDK({
  clientID: process.env.BOX_AUTH_CLIENT_ID,
  clientSecret: process.env.BOX_AUTH_CLIENT_SECRET
});

const oauth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Logout user by refreshing destroying their session
 */
router.get('/logout', function(req, res) {
  req.session.destroy();

	res.redirect('/');
});

/**
 * Render Signup page
 */
router.get('/signup', function(req, res) {

  res.render('signup');
});

/**
 * Redirect to log in page
 */
router.get('/login', function(req, res) {

  res.render('home');
});


/**
 * Callback endpoint for parsing user authentication
 */
router.get('/authentication', function(req, res) {

  var authCode = req.query.code,
      authState = req.query.state,
      denyAccess = req.query.error,
      adminAPIClient = boxSDK.getAppAuthClient('enterprise', process.env.ENTERPRISE_ID),
      boxAuthUrl = 'https://account.box.com/api/oauth2/authorize?response_type=code&client_id=' +
      process.env.BOX_AUTH_CLIENT_ID + '&state=security_token%YOUR_SECURITY_TOKEN';

  if (denyAccess) {
    res.redirect('/');
  } else {
    new Promise((resolve, reject) => {

      // If box authentication
      if(authState) {
        BoxAuthentication(authCode).then(function(user) {
          if(user)
            resolve(user);
          else
            reject('Error in Box Auth');
        });
      } else {
        GoogleAuthentication(authCode).then(function(user) {
          if(user)
            resolve(user);
          else
            reject('Error in Google Auth');
        });
      }
    })
    .then((authedUser) => {
      // look for the user by auth id in the database
      return new Promise((resolve, reject) => {
        User.findOne({auth_id: authedUser.auth_id}, function(err, dbUser) {
          resolve({authedUser: authedUser, dbUser: dbUser});
        });
      });
    })
    .then((result) => {
      // if user exists fetch redirect to login page
      // else provision new user
      return new Promise((resolve, reject) => {
        if (result.dbUser) {
          adminAPIClient.get('/users', {qs: {filter_term: result.dbUser.box_id} }, adminAPIClient.defaultResponseHandler(function(err, data) {

            // set up user session
            req.session.email = result.authedUser.email;
            req.session.userID = result.dbUser.box_id;

            res.redirect('/files?init=true');
            resolve();
          }));
        } else {
          CreateNewUser(result.authedUser).then(function(newUser) {

            if (!newUser) {
              reject('Failed to Create New User');
            } else {

              // set up user session
              req.session.email = result.authedUser.email;
              req.session.userID = newUser.box_id;

              res.redirect('/files?welcome=true');
              resolve();
            }
          });
        }
      });
    })
    .catch((err) => {
      console.log('Authentication Error - ' + err);
      errorReporting.send("user.js", "/authentication", err, req.session.email);
      res.redirect('/');
    });
  }

});

/**
 * Get box user token, get user info, revoke token, and return user information
 *
 * @param code - box authorization code used to get tokens
 * @return userInfo - object containing user email, domain, and unique id
 */
function BoxAuthentication(code) {

  var userInfo;

  return new Promise((resolve, reject) => {
    // get oauth tokens from auth code
    oauthSDK.getTokensAuthorizationCodeGrant(code, null, function(err, data) {
      if(err || !data) { reject(err); }

      resolve(data.accessToken);
    });
  })
  .then((accessToken) => {
    return new Promise((resolve, reject) => {
      var client = oauthSDK.getBasicClient(accessToken);

      // get user info
      client.users.get(client.CURRENT_USER_ID, null, function(err, data) {
        if(err) { reject(err); }

        resolve({user: data, token: accessToken});
      });
    });
  })
  .then((result) => {
    return new Promise((resolve, reject) => {
      // revoke tokens and return user data
      oauthSDK.revokeTokens(result.accessToken, function(err) {
        if(err) { reject(err); }
        userInfo = {
          domain: result.user.login.substring(result.user.login.lastIndexOf("@") + 1),
          email: result.user.login,
          auth_id: result.user.id
        };
        resolve(userInfo);
      });
    });
  })
  .catch((err) => {
    console.log('Box Authentication Error - ' + err);
    errorReporting.send("user.js", "/authentication", err.message, req.session.email);
    return false;
  });
}

// Get google user token, get user info, revoke token, and return user information
function GoogleAuthentication(authCode){

  return new Promise((resolve, reject) => {
    // request access token
    oauth2Client.getToken(authCode, function (err, tokens) {
      if (err) {
        return reject(err);
      }
      // set tokens to the client
      oauth2Client.setCredentials(tokens);

      resolve(tokens.access_token);
    });


  })
  .then((accessToken) => {
    return new Promise((resolve, reject) =>{
      // retrieve user profile
      plus.people.get({ userId: 'me', auth: oauth2Client }, function (err, profile) {
        if (err) {
          return reject(err);
        }
        resolve({user: profile, token: accessToken});
      });
    });
  })
  .then((result) => {
    return new Promise((resolve, reject) => {
      //revoke tokens
      oauth2Client.revokeToken(result.token);

      userInfo = {
        domain: result.user.emails[0].value.substring(result.user.emails[0].value.lastIndexOf("@") + 1),
        email: result.user.emails[0].value,
        auth_id: result.user.id
      };
      resolve(userInfo);
    })
  })
  .catch((err) => {
    console.log('Google Authentication Error - ' + err);
    errorReporting.send("user.js", "/authentication", err.message, req.session.email);
    return false;
  });
}

/**
 * Create new user
 *
 * @param authenticatedUser - user object that contains user email, domain, and unique auth id
 * @return newUser - object that contains auth id, app user id, and email domain
 */
function CreateNewUser(authenticatedUser) {

  var adminAPIClient = boxSDK.getAppAuthClient('enterprise', process.env.ENTERPRISE_ID),
      newUser = new User({
        domain: authenticatedUser.domain,
        auth_id: authenticatedUser.auth_id
      });

  // synchronous flow of events
  // 1. create new app user
  // 2. add app user to a group + save "user" model in db
  // 3. copy files into user's root
  return new Promise((resolve, reject) => {
    // create new app user and store in db
    adminAPIClient.enterprise.addAppUser(authenticatedUser.email, null, function(err, data) {

      if (err) { reject(err); return; }

      newUser.box_id = data.id;

      groupParams = {
        body: {
          group: { id: process.env.USER_GROUP_ID, type: "group"},
          user: { id: newUser.box_id}
        }
      };

      resolve(groupParams);
  	});
  })
  .then((groupParams) => {
    return new Promise((resolve, reject) => {
      // add app user to group
      adminAPIClient.post('/group_memberships', groupParams, adminAPIClient.defaultResponseHandler(function(err, data) {

        if (err) { reject(err); }

        resolve();
      }));
    });
  })
  .then((result) => {
    return new Promise((resolve, reject) => {
      var sdk = boxSDK.getAppAuthClient('user', newUser.box_id);

    	sdk.folders.getItems(process.env.STARTER_DOCS_FOLDER, null, function(err, data) {

        if (err) { reject(err); }

        if (data && data.entries) {
          data.entries.forEach( function(item, index) {
            sdk.files.copy(item.id, "0", function(err, file) {
              if(err) { reject(err); }
          	});
          });
        }

        // save user
        newUser.save(function(err, data) {
          if (err) { reject(err); console.log('Error in saving new user');}
          resolve(newUser);
        });
    	});
    });
  })
  .catch((err) => {
    console.log('Sign Up Error - ' + err);
    return false;
  });
}

module.exports = router;
