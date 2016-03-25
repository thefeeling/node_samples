var express    = require('express');
var bodyParser = require('body-parser');
var multer     = require('multer');
var _storage   = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/');
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname + '-' + Date.now());
	}
});

var upload     = multer({storage : _storage});
var fs         = require('fs');
var app        = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty=true;
app.set('view engine', 'jade');
app.set('views', './views_file');


app.get('/upload', function(req,res){
	res.render('upload');
});

app.post('/upload', upload.single('userfile'), function(req,res){
	console.log(req.file);
	res.send('upload : ' + req.file.filename);
});

// new
app.get('/topic/new', function(req,res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.render('new', {
			topics:files
		});
	});
});

// route array
app.get(['/topic', '/topic/:id'], function(req,res){
	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		var id = req.params.id;
		if(id){
			fs.readFile('data/'+id, 'utf8', function(err,data){
				if(err){
					console.log(err);
					res.status(500).send('Internal Server Error');
				}
				res.render('view', {
					topics : files,
					title : id,
					description : data
				});
			});			
		}
		else{
			res.render('view', {
				topics : files,
				title : 'Welcome',
				description : 'Hello, JavaScript for server'				
			})
		}
	});
});

// reject
app.get('/topic/:id', function(req,res){
	var id = req.params.id;

	fs.readdir('data', function(err, files){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		fs.readFile('data/'+id, 'utf8', function(err,data){
			if(err){
				console.log(err);
				res.status(500).send('Internal Server Error');
			}
			res.render('view', {
				topics : files,
				title : id,
				description : data
			});
		});
	});
})

// new
app.post('/topic', function(req,res){
	var title = req.body.title; // file name
	var description = req.body.description; // file content

	fs.writeFile('data/' + title, description, function(err){
		if(err){
			console.log(err);
			res.status(500).send('Internal Server Error');
		}
		res.redirect('/topic/'+title);
	});
});


app.listen(3000, function(){
	console.log('Connected 3000 Port');
});  