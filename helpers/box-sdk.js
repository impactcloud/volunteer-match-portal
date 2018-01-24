/**
 *  Helper for creating Box node sdk object
 */
var fs = require('fs'),
    path = require('path'),
    BoxSDK = require('box-node-sdk');

// Set up the Box SDK
exports.boxSDK = new BoxSDK({
	clientID: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	appAuth: {
		keyID: process.env.PUBLIC_KEY_ID,
		privateKey: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : fs.readFileSync(path.resolve(__dirname, process.env.PRIVATE_KEY_PATH)),
		passphrase: process.env.PRIVATE_KEY_PASSPHRASE
	}
});
