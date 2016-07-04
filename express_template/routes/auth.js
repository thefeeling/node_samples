var commonMsg     = require('../common/commonMsg');

module.exports = function(app){
	var passport = app.passport;
	var ensureAuthenticated = app.passport.ensureAuthenticated;
	var suffix = "/auth"

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

	app.post('/login', passport.authenticate('local', {failureFlash: true, successRedirect: '/main/m1', failureRedirect: '/auth/login'}), function(req,res){
		if(req.isAuthenticated()){
			res.json(commonMsg.auth.success);
		}
		else{
			res.json(commonMsg.auth.fail);
		}
	});

	/**
	 * 유저 세션 확인
	 * @param  {[type]} '/authPage'         [접근 URL]
	 * @param  {[type]} ensureAuthenticated [Authentication 확인]
	 * @param  {[type]} function(req,res){}    [Reqeust, Response]
	 */
	app.get('/authPage', ensureAuthenticated, function(req,res){
		res.send(req.user);
	})

	/**
	 * 유저 세션 invalidate
	 * @param  {[type]} '/logout'     [접근 URL]
	 * @param  {[type]} function(req, res){}           [Request, Response]
	 */
	app.get('/logout', function(req, res){
		req.logout();
	 	res.redirect('/');
	});
	
	// ** redirect url **
	// app.post('/login', passport.authenticate('local', { successRedirect: '/success',
	// 													failureRedirect: '/failure',
	// 													failureFlash: true }));
}
