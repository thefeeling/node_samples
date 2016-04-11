var commonMsg     = require('../common/commonMsg');

module.exports = function(app){
	var passport            = app.passport;
	var ensureAuthenticated = app.passport.ensureAuthenticated;
	var suffix              = "/auth"

	app.get(suffix + '/login', function(req,res){
		var html = '';
		if(req.isAuthenticated()){
			html = "로그인중"    
			res.send(html);
		}
		else{
			res.redirect('/index.html');
		}
	})

   	app.post('/login', passport.authenticate('local', { failureFlash: true }), function(req,res){
	    if(req.isAuthenticated()){
			res.json(commonMsg.auth.success);
	    }
	    else{
			res.json(commonMsg.auth.fail);
	    }	
	});

	app.get('/authPage', ensureAuthenticated, function(req,res){
	    res.send(req.user);
	})	

	// ** redirect url **
	// app.post('/login', passport.authenticate('local', { successRedirect: '/success',
	// 													failureRedirect: '/failure',
	// 													failureFlash: true }));
}