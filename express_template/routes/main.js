var mainModel = require('../models/mainModel');
module.exports = function(app){
	var model = mainModel(app.dbConn);
	var suffix = "/main"

	app.route(suffix + '/m1')
	.get(function(req,res){
		var result = model.main({})
		result.then(function(rows){
			console.log('mainRoutes-----');
			console.log(rows[0]);
			res.json(rows[0]);
		})
		.catch(function(){
			console.log('catch');
		});
	})
	.post(function(req,res){
		res.send('m2 post');
	});


	var cb0 = function (req, res, next) {
		console.log('CB0');
		next();
	}

	var cb1 = function (req, res, next) {
		console.log('CB1');
		next();
	}

	app.get('/example/a', [cb0, cb1], function (req, res, next) {
		console.log('the response will be sent by the next function ...');
		next();
	}, function (req, res) {
		res.send('Hello from A!');
	});

	app.get('/example/b', function (req, res, next) {
		console.log('first handler');
		next();
	}, function (req, res) {
		console.log('second handler');
		res.send('Hello from B!');
	});

	
}
