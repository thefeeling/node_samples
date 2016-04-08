var mainModel = require('../models/mainModel');


module.exports = function(app){
	var model = mainModel(app.dbPool);
	var suffix = "/main"

	
	app.route(suffix + '/m1').get(function(req,res){
		var data = {
			d : "Hello"
		}
		res.send(data);
	})
	.post(function(req,res){
		res.send('m1 post');
	})


	app.route(suffix + '/m2').get(function(req,res){
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
	})
	//other routes..
}