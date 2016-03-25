var mysql      = require('mysql');
var conn = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '1234',
	database : 'o2'
});

conn.connect();

// [Select]
// connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
// 	if (err){
// 	 throw err;	
// 	}

//   console.log('The solution is: ', rows[0].solution);
// });

// connection.end();

/*
var sql =  'SELECT * FROM topic'
conn.query(sql, function(err, rows, fields){
	if(err){
		console.log(err);
	}
	else{
		for(var i = 0 ; i<rows.length ; i++){
			console.log(rows[i].description);
		}
	}
});
*/

/*
var sql = 'INSERT INTO topic(title, description, author) VALUES(?, ?, ?)';
var params = ['Supervisor', 'Watcher', 'graphtittie'];
conn.query(sql, params, function(err,rows, fields){
	if(err){
		console.log(err);
	}
	else{
		console.log(rows.insertId);
	}
});
*/

/*
var sql = 'UPDATE topic SET title=?, author=? WHERE id=?';
var params = ['NPM', 'leezche', 1];
conn.query(sql, params, function(err,rows, fields){
	if(err){
		console.log(err);
	}
	else{
		console.log(rows);
		console.log(rows.insertId);
	}
});
*/

var sql = 'DELETE FROM topic WHERE id=? ';
var params = [1];
conn.query(sql, params, function(err,rows, fields){
	if(err){
		console.log(err);
	}
	else{
		console.log(rows);
		console.log(rows.insertId);
	}
});


conn.end();