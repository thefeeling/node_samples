var express    = require('express');
var session    = require('express-session');
var bodyParser = require('body-parser');
var FileStore  = require('session-file-store')(session);

/*----------------------
md5 - sha256 - bkfd2
------------------------*/
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
	secret : 'kasdfasdf123!', // Secret Key
	resave : false,
	saveUninitialized : true,
	store : new FileStore()
}));
 
app.listen(3003, function(req,res){
	console.log('Connected 3003 port');
});

var users = [
	{
		username    : 'egoing',
		password    : 'syF9wKjOcCTRMuAlZrQMiqx+qcDFuvQHjKT4Q9WTJOW4t7P65vf3tyM8u+GrMRLWl95Y/NsLM7YYVzBvmXOkJVl/y3dfl2KKgjwYGdgO8S4/e0G0XUfY9IXD6UBPmriE+xBwrp6/m9oGWvV7OkUM/z8b8vwgzWmUP/jB8FJYE1Y=', // 111
		salt        : 'bdzOy7FAymSzG+2C4qlMOL90XO3nNDeChDWIdhoSXWnvSPHJtPuWDALYj/X4INmMkHodsPcsyJzTUn6zKVVWqw==',
		displayName : 'Egoing'
	}	
];


app.get('/auth/logout', function(req,res){
	delete req.session.displayName;
	res.redirect('/welcome');
});

app.get('/welcome', function(req,res){
	if(req.session.displayName){
		res.send(`
			<h1>Hello, ${req.session.displayName}</h1>
			<a href="/auth/logout">logout</a>
		`)
	}
	else{
		res.send(`
			<h1>Welcome</h1>
			<ul>
				<li><a href="/auth/login">login</a></li> 
				<li><a href="/auth/register">Register</a></li> 
			</ul>
		`);
	}
})

app.get('/auth/register', function(req, res){
	var output = `
	<h1>Register</h1>
	<form action="/auth/register" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="text" name="displayName" placeholder="displayName">
		</p>
		<p>
			<input type="submit">
		</p>
	</form>	
	`
	res.send(output);
});


app.post('/auth/register', function(req,res){
	hasher({password : req.body.password}, function(err, password, salt, hash){
		var user = {
			username    : req.body.username,
			password    : hash,
			salt        : salt,
			displayName : req.body.displayName
		}
		users.push(user);
		req.session.displayName = req.body.displayName;
		req.session.save(function(){
			res.redirect('/welcome');
		});
	});
});



app.post('/auth/login', function(req,res){
	var uname = req.body.username;
	var pwd   = req.body.password;
	for(var i = 0 ; i < users.length ; i++){
		var user = users[i];
		if(uname === user.username){
			return hasher({password : pwd, salt : user.salt}, function(err, pass, salt, hash){
				if(hash === user.password){
					req.session.displayName = user.displayName;
					req.session.save(function(){
						res.redirect('/welcome');
					})
				}
				else{
					res.send('Who are you? <a href="/auth/login">login</a>');					
				}
			});
		}
		// 기존 소스
		// if(uname === user.username && sha256(pwd+user.salt) === user.password){
		// 	req.session.displayName = user.displayName;
		// 	return req.session.save(function(){
		// 		res.redirect('/welcome');
		// 	});
		// }
	}
});

app.get('/auth/login', function(req,res){
	var output = `
	<h1>Login</h1>
	<form action="/auth/login" method="post">
		<p>
			<input type="text" name="username" placeholder="username">
		</p>
		<p>
			<input type="password" name="password" placeholder="password">
		</p>
		<p>
			<input type="submit">
		</p>
	</form>
	`;
	res.send(output);
})


app.get('/count', function(req,res){
	if(req.session.count){
		req.session.count++;
	}
	else{
		req.session.count = 1;
	}
	res.send('count : ' + req.session.count);
});