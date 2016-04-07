/*
----------------------------------------------------------
 + api reference by myself
----------------------------------------------------------
*/

var express = require('express');
var app = express();
var Sequelize = require("sequelize");
var sequelize = new Sequelize('o2', 'root', '1234', {
	host    : 'localhost',
	dialect : 'mysql',
	pool    : {
		max: 5,
		min: 0,
		idle: 10000
	}
});

app.listen(3000, function(){
	console.log("express-sequlize app");
});

var User = sequelize.define('boardMaster', {
	boardCode : {
		type:
		field : 'BOARD_CODE'
	},
	boardName : {
		type : Sequelize.STRING,
		field : 'BOARD_NAME'
	}

	firstName: {
		type: Sequelize.STRING,
		field: 'first_name' // Will result in an attribute that is firstName when user facing but first_name in the database
	},
	lastName: {
		type: Sequelize.STRING
	}
}, 
{
  freezeTableName: true // Model tableName will be the same as the model name
});

