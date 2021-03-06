/**
 * Volunteer Sign Up API Controller
 */
const express = require('express');
const router = express.Router();
const fs = require('fs');
// const errorReporting = require('../helpers/error-reporting');
const multipart = require('express-formidable').parse;
const cache = require('memory-cache');

router.get('/', function(req, res) {
    res.render('pages/volunteer-dashboard');
})

module.exports = router;
