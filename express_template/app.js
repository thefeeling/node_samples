/*
-------------------------------------------------
require 3rd party modules
-------------------------------------------------
*/
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require("connect-flash");
var cors = require('cors');
var app = express();

/*
-------------------------------------------------
custom modules(./config, ./routes)
-------------------------------------------------
*/

var env = require('./environment'); // env param
var database = require('./config/database')(env.database); // database
var routes = require('./routes'); // routes


/**
 * [pretty description]
 * @type {Boolean}
 */
app.locals.pretty = true;
app.use(express.static('public')); // static resource
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('1234567890'));
app.use(session());
app.use(flash());
app.use(cors());
app.listen(3003, function(req,res){
	console.log('Connected 3003 port');
});

// Custom Middle Ware
app.use(function (req, res, next) {
	console.log('Time:', Date.now());
	next();
});



/*
-------------------------------------------------
express custom setting
-------------------------------------------------
*/
app.dbConn = database                              // db connection function add
require('./config/authenticate')(app, database);   // passport authentication config / authentication route
routes(app);
