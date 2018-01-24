/**
 * Files API Controller
 */
var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    errorReporting = require('../helpers/error-reporting'),
  	multipart = require('express-formidable').parse,
    cache = require('memory-cache');

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

    if (req.query.error) {
      if (req.query.error == 'upload')
        err = "Duplicate file, could not upload";
    }
    console.log('Access Token: ' + JSON.stringify(req.sdk._session.getAccessToken()));

  	res.render('pages/files', {
			error: err,
      files: data ? data.entries.filter(isFile): [],
			filesTab: true,
      accessToken: req.sdk._session.getAccessToken(),
      request: req.session.requestObj,
      response: req.session.responseObj ? JSON.stringify(req.session.responseObj, null, '  ') : false
		});
	});
});

/**
 * Build upload api request/response
 */
router.get('/upload', function(req, res) {

  // build API request/response strings
  req.session.requestObj = {
    method: "POST",
    api_call: "Upload File",
    request_url: "https://upload.box.com/api/2.0/files/content",
    header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken,
    body: 'attributes={"name":"' + req.query.name + '", "parent":{"id":"0"}}'
  };
  req.session.responseObj = JSON.parse(req.query.json);

	res.send('200');
});

/**
 * Download file of specified id
 */
router.get('/download/:id', function(req, res) {
	// API call to get the temporary download URL for the user's file
	req.sdk.files.getDownloadURL(req.params.id, null, function(err, url) {

		if (err) {
      errorReporting.send("files.js", "/download/:id", err.message, req.session.email);
			res.redirect('/files');
			return;
		}

    // build API request/response
    req.session.requestObj = {
      method: "GET",
      api_call: "Download File",
      request_url: "https://api.box.com/2.0/files/" + req.params.id + "/content",
      header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken,
      body: null
    }
    req.session.responseObj = url;

		// Redirect to the download URL, which will cause the user's browser to
		// start the download
    res.send({url: url});
	});
});


/**
 * Preview file, return "expiring_embed_link"
 */
router.get('/preview/:id', function(req, res) {

	// The Box file object has a field called "expiring_embed_link", which can
	// be used to embed a preview of the file.  We'll fetch this field only.
	req.sdk.files.get(req.params.id, {fields: 'expiring_embed_link'}, function(err, data) {

		if (err) {
      errorReporting.send("files.js", "/preview/:id", err.message, req.session.email);
			res.redirect('/files');
			return;
		}

    // build API request/response
    req.session.requestObj = {
      method: "GET",
      api_call: "Get Embed Link",
      request_url: "https://api.box.com/2.0/files/" + req.params.id + "?fields=expiring_embed_link",
      header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken,
      body: null
    }
    req.session.responseObj = JSON.parse(JSON.stringify(data,null,'  '));

		res.redirect(data.expiring_embed_link.url);
	})
});


/**
 * Delete file from root rolder
 */
router.get('/delete/:id/:etag', function(req, res) {

	req.sdk.files.delete(req.params.id, function(err, data) {

		if (err) {
      errorReporting.send("files.js", "/delete/:id/:etag", err.message, req.session.email);
			res.redirect('/files');
			return;
		}

    // build API request/response
    req.session.requestObj = {
      method: "DELETE",
      api_call: "Delete File",
      request_url: "https://api.box.com/2.0/files/" + req.params.id,
      header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken +
              " If-Match: " + req.params.etag,
      body: null
    }
    req.session.responseObj = false;

		res.redirect('/files');
	});
});


/**
 * Fetch file thumbnail, return image data
 */
router.get('/thumbnail/:id',  function(req, res) {

	req.sdk.files.getThumbnail(req.params.id, {}, function(err, data) {

		if (err) {
			res.status(err.statusCode || 500).json(err);
			return;
		}

		if (data.file) {
			// We got the thumbnail file, so send the image bytes back
			res.send(data.file);
		} else if (data.location) {
			// We got a placeholder URL, so redirect the user there
			res.redirect(data.location);
		} else {
			// Something went wrong, so return a 500
			res.status(500).end();
		}
	});
});


/**
 * Fetch file info
 */
router.get('/get-info/:id', function(req, res) {

	req.sdk.files.get(req.params.id, null, function(err, data) {

		if (err) {
      errorReporting.send("files.js", "/get-info/:id", err.message, req.session.email);
			res.redirect('/files');
			return;
		}

    // build API request/response
    req.session.requestObj = {
      method: "GET",
      api_call: "Get File's Info",
      request_url: "https://api.box.com/2.0/files/" + req.params.id,
      header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken,
      body: null
    }
    req.session.responseObj = JSON.parse(JSON.stringify(data,null,'  '));

		res.send(data);
	});
});


/**
 * Fetch all root folder items
 */
router.get('/root-folder-items', function(req, res) {

	// Get the user's files in their root folder.  Box uses folder ID "0" to
	req.sdk.folders.getItems('0', null, function(err, data) {
    // build API request/response
    req.session.requestObj = {
      method: "GET",
      api_call: "Get Folder Items",
      request_url: "https://api.box.com/2.0/folders/0/items",
      header: "Authorization: Bearer " + req.sdk._session.tokenInfo.accessToken,
      body: null
    }
    req.session.responseObj = JSON.parse(JSON.stringify(data,null,'  '));
		res.send(data);

	});
});




// Extract file items from item array, remove folder items
function isFile(item) {
  return item.type == "file";
}

module.exports = router;
