/*
Promise Sample

module.exports = function(pool){
	var mainDao = {};
	mainDao.main = function(param){

		// return pool.query('SELECT * FROM o2.topic LIMIT 0, 10')
		// .then(function(rows){
		// 	console.log("suc");
		// 	return rows[0];
		// })
		// .catch(function(err){
		// 	console.log("err");
		// 	result = err;
		// 	return rows;
		// })

		return pool.getConnection().then(function(connection){

			return connection.query('SELECT * FROM o2.topic LIMIT 0, 10')
			.then(function(rows){
				var str = JSON.stringify(rows);
				//console.log(str);
				var ttt = JSON.parse(str);
				//console.log(ttt);
				return ttt;
			})
			.catch(function(err){
				console.log(err);
				console.log('ddddddddddd');
			})
		})
	}



	return mainDao
}
*/
var squel = require("squel");


module.exports = function(conn){
	var mainDao = {};
	mainDao.main = function(param){
		var sql = squel.select().from('topic', 'to')
								.field('to.id')
								.field('to.title')
								.field('to.description')
								.field('to.author')
								.where('to.id > 2')
								.toString();

		var topics = conn.single(sql)
		return topics;
	}



	return mainDao
}

