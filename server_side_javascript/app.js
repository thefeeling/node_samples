/*

*/
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');
app.use(express.static('public'));

// Bodyparser MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/form', function(req,res){
	res.render('form');
});

app.get('/form_receiver', function(req,res){
	var title = req.query.title;
	var description = req.query.description;
	res.send(title + ',' + description); 
});

app.post('/form_receiver', function(req,res){
	var title = req.body.title;
	var description = req.body.description;
	res.send(title + ',' + description); 
});


// route param
app.get('/topic', function(req,res){
	var topics = [
		'Javascript is ...',
		'Nodejs is ...',
		'Express is ...'
	];

	var output = `
		<a href="/topic?id=0">JavaScript</a><br>
		<a href="/topic?id=1">Nodejs</a><br>
		<a href="/topic?id=2">Expressjs</a><br><br>
		${topics[req.query.id]}
	`
	res.send(output);
});

// route param
app.get('/topic/:id/:mode', function(req,res){
	res.send(req.params.id + ',' + req.params.mode);
 })

app.get('/');

// Query String Example
app.get('/topic', function(req,res){
	var topics = [
		'Javascript is ...',
		'Nodejs is ...',
		'Express is ...'
	];

	var output = `
		<a href="/topic?id=0">JavaScript</a><br>
		<a href="/topic?id=1">Nodejs</a><br>
		<a href="/topic?id=2">Expressjs</a><br><br>
		${topics[req.query.id]}
	`
	res.send(output);
});

app.get('/template', function(req, res){
	res.render('temp', {
		time : Date(),
		title : 'Jade'
	});
});

app.get('/', function(req, res){
	res.send('Hello home page');
});

app.get('/dynamic', function(req,res){
	var time = Date();
	var output = `
	<html>
	<head></head>
	<body>
		<h1>Hello, Dynamic</h1>
		${time}
	</body>
	</html>`;
	res.send(output);
});

app.get('/', function(req, res){
	res.send('<h1>Login plaease</h1>');
});

app.listen(3000, function(){
	console.log('Connected 3000 Port');
});


