/*
-------------------------------------------------
require 3rd party modules
-------------------------------------------------
*/
var express      = require('express');
var bodyParser   = require('body-parser');
var cookieParser = require('cookie-parser');
var cors         = require('cors')
var app          = express();

/*
-------------------------------------------------
custom modules(./config, ./routes)
-------------------------------------------------
*/

var env          = require('./environment');                   // env param
var database     = require('./config/database')(env.database); // database
var routes       = require('./routes');                        // routes

/*
-------------------------------------------------
express default setting
-------------------------------------------------
*/
app.locals.pretty = true;
app.use(express.static('public'));                    // static resource
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('1234567890'));
app.use(cors());
app.listen(3003, function(req,res){
	console.log('Connected 3003 port');
});

/*
-------------------------------------------------
express custom setting
-------------------------------------------------
*/
app.dbPool = database // db connection function add
routes(app);
