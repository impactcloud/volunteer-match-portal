/**
 * Volunteer Sign Up API Controller
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
const errorReporting = require('../helpers/error-reporting');
const multipart = require('express-formidable').parse;
const cache = require('memory-cache');

/**
 * Fetch all root files for app user
 */
router.get('/', function(req, res) {

    var err;
  
    // refresh request/response
    if (req.query.init) {
      req.session.requestObj = req.session.responseObj = false;
    }

    // Get the user's files in their root folder.  Box uses folder ID "0" to
    req.sdk.folders.getItems('0', {fields: 'id,name,extension'}, function(err, data) {

    res.render('pages/volunteer-form', {
        error: err,
        accessToken: req.sdk._session.getAccessToken(),
        });
    });
});

module.exports = router;
