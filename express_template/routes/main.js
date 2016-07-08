let commonMsg = require('../common/commonMsg');
let mainModel = require('../models/mainModel');
let squel = require("squel");

module.exports = function(app){
	let db = app.dbConn;
	let model = mainModel(app.dbConn);
	let suffix = "/main"

	app.route(suffix + '/m1').get((req,res)=>{
		var result = model.main({})
		result.then(function(rows){
			console.log(rows[0]);
			res.json(rows[0]);
		})
		.catch(function(){
			console.log('catch');
		});
	})
	.post((req,res)=>{
		res.send('m2 post');
	});

	app.route(suffix + '/topic')
	.get((req,res)=>{
		res.redirect('topic.html');
	})
	.post((req,res)=>{
		db.trans((conn)=>{
			const sql = squel
					.insert().into("topic")
					.set("title"            , "test1")					.set("description"  , "param.description")
					.set("author"         , "param.author")
					.toString();
			return conn.queryAsync(sql)
			.then((result)=>{
				const sql = squel
						.insert().into("topic")
						.set("title"            , "test2")
						.set("description"  , "param.description")
						.set("author"         , "param.author")
						.toString();
				console.log("then(1)");
				return conn.queryAsync(sql);
			})
			.then((result)=>{
				console.log("then(1-1)");
				return "success";
				//conn.commit(function(){
				//	return "true"
				//})
			})
		})
		.then((msg) =>{
			//console.log(msg);
			res.send(msg);
		})
		.catch((err)=>{
			console.dir(arguments);
			console.log("outer catch");
			res.send("failure");
		})
	});

	// ------------------------------- Sample Routers ---------------------
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
