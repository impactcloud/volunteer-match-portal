const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const compression = require('compression');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const handlebarsHelpers = require('./helpers/handlebars');

// require env + user models
require('dotenv').config();

// connect to db and include models
 mongoose.connect('mongodb://' +
	process.env.DB_USER + ':' +
	process.env.DB_PASSWORD +
	'@ds047732.mlab.com:47732/api-navigator-user-entries', {
		useMongoClient: true,
});

require('./models/Users');


// Set up Express
const app = express();
const PORT = process.env.PORT || 3000;

// GZIP all assets
app.use(compression());

// configure body parser
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());

// Set up sessions, so we can log users in and out
let expiryDate = new Date(Date.now() + 60 * 60 * 12000) // 12 hours
app.use(session({
	secret: 'session secret',
	secure: true,
	httpOnly: true,
	resave: false,
	saveUninitialized: false
}));

// ensure https
app.use(require('./middleware/requireHTTPS'));

// include stylesheets, javascript, images + cache these assets
app.use(express.static(path.join(__dirname, 'public')));

// load controllers
app.use(require('./controllers'));


app.set('json spaces', 1);

// Set up the templating engine (Handlebars)
// view engine setup (Handlebars)
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
	extname: '.hbs',
	helpers: handlebarsHelpers
}));
app.set('views', path.join(__dirname, 'views'));
// register handlebars partials
hbs.registerPartials(__dirname + '/views/partials');

// favicon
app.use(favicon(__dirname + '/public/img/box-platform.png'));

// start server
app.listen(PORT, function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Starting server on port ' + PORT);
  }
});
