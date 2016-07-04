'use strict';
var mysql   = require('mysql');
var Promise = require('bluebird');
var using   = Promise.using;
//var mysql = require('promise-mysql');
// 일단 미사용

Promise.promisifyAll(require('mysql/lib/Connection').prototype);
Promise.promisifyAll(require('mysql/lib/Pool').prototype);

module.exports = function(config){
	var pool  = mysql.createPool({
		connectionLimit : config.connectionLimit,
		host: config.host,
		user: config.user,
		password: config.password,
		database: config.database
	});

	// pool.on('connection', function (connection) {
	// 	connection.query('SET SESSION auto_increment_increment=1')
	// });

	// pool.on('enqueue', function () {
	// 	console.log('Waiting for available connection slot');
	// });
	function getConnection() {
		return pool.getConnectionAsync().disposer(function (connection) {
			return connection.release();
		});
	}

	function getTransaction() {
		return pool.getConnectionAsync()
		.then(function (connection) {
			return connection.beginTransactionAsync().then(function () {
				return connection;
			});
		})
		.disposer(function (connection, promise) {
			var result = promise.isFulfilled() ? connection.commitAsync() : connection.rollbackAsync();
			return result.finally(function () {
				connection.release();
			});
		});
	}


	return {
		single: function (sql, values) {
			return using(getConnection(), function (connection) {
				return connection.queryAsync({
					sql: sql,
					values: values
					// nestTables: true,
					// typeCast: false,
					// timeout: 10000
				});
			});
		},
		query: function (callback) {
			return using(getConnection(), function (connection) {
				return callback(connection);
			});
		},
		trans: function (callback) {
			return using(getTransaction(), function (connection) {
				return callback(connection);
			});
		},
		connection : function(){
			return getConnection();
		}
	}
}
