/**
 *  Middleware to ensure app user auth
 */
var boxSDK = require('../helpers/box-sdk').boxSDK,
		cache = require('memory-cache');

// User authentication middleware
module.exports = function(req, res, next) {

  // if user is logged in, fetch box sdk object
  // else, redirect to login page
  if (req.session.email) {
		res.locals.email = req.session.email;

		if(cache.get(process.env.ENVIRONMENT + '/token/' + req.session.userID) == null) {
			req.sdk = boxSDK.getAppAuthClient('user', req.session.userID);
			cache.put(process.env.ENVIRONMENT + '/token/' + req.session.userID, req.sdk, 2700000, function(key, value) {});
		} else {
			req.sdk = cache.get(process.env.ENVIRONMENT + '/token/' + req.session.userID);
		}

	} else {
		res.redirect('/');
		return;
  }
	next();
};
