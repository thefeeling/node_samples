/*
----------------------------------------------------------
 + add winston about file logging
----------------------------------------------------------
*/
var winston = require('winston');
var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({
		  name: 'info-file',
		  filename: './log/filelog-info.log',
		  level: 'info'
		}),
		new (winston.transports.File)({
		  name: 'error-file',
		  filename: './log/filelog-error.log',
		  level: 'error'
		})
	]
});
var express = require('express');
var app = express();
var Sequelize = require("sequelize");
var sequelize = new Sequelize('o2', 'root', '1234', {
	host    : 'localhost',
	dialect : 'mysql',
	logging: logger.info,
	pool    : {
		max: 5,
		min: 0,
		idle: 10000
	}
});

app.listen(3000, function(){
	console.log("express-sequlize app");
});

var User = sequelize.define('user', {
  firstName: {
    type: Sequelize.STRING,
    field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  lastName: {
    type: Sequelize.STRING
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});


/*
[findById]
*/
app.get('/findById', function(req,res){
	logger.info("/findById");
	User.findById(1).then(function(user){
		res.send(user);
	});
});

/*
[findOne]
*/
app.get('/findOne', function(req,res){
	User.findOne({
		where : {
			lastName:'Hancock'
		}
	})
	.then(function(user){
		res.send(user);
	})
});


/*
[findAll]
 - default
*/
app.get('/findAll', function(req,res){
	User.findAll().then(function(Users){
		res.send(Users);
	})
});

/*
[findAll]
 - attributes
*/
app.get('/findAllAttr', function(req,res){
	User.findAll({
		attributes : ['id','first_name', 'lastName']
	}).then(function(Users){
		res.send(Users);
	})
});

/*
[create]
*/
app.get('/create', function(req,res){
	User.create({
		firstName : "daniel",
		lastName :"choi"	
	})
	.then(function(result){
		res.send(result);
	});
});

/*
[findOrCreate]
 : Find a row that matches the query, or build and save the row if none is found 
*/
app.get('/findOrCreate', function(req,res){
	User.findOrCreate({
		where : {
			firstName : "JohnSon"
		},
		defaults : {
			firstName : "JohnSon",
			lastName : "Sam"
		}
	})
	.then(function(result){
		res.send(result);
	})
})


app.get('/update', function(req,res){

});


app.get('/destroy', function(req,res){
	User.destroy({
		where : {
			firstName : "JohnSon"
		}
	})
	.then(function(result){
		console.log(result);
		res.status(200).send(result);
	})
	.catch(function(err){
		res.status(500).send("Internal Error!!");	
	});	
})


/*
[RAW QUERY EXAMPLE]
*/
app.get('/rawQuery/:id', function(req,res){
	var id = req.params.id;
	
	// Raw Query Str
	var sql = `
		SELECT * FROM user
		WHERE id = ${id}
	`;

	sequelize.query(sql, { type: sequelize.QueryTypes.SELECT})
	.then(function(users) {
		res.send(users);
	})
})

app.get("/describe", function(req,res){
	res.send(User.describe());
})