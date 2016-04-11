var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var squel         = require("squel");
var commonMsg     = require('../common/commonMsg');


module.exports = function(app, dbConn){
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy({
	    usernameField : 'email',
	    passwordField : 'password',
	    passReqToCallback : true
	}
	,function(req,userid, password, done) {
		var sql = squel.select().from('user', 'us')
						.field('us._EMAIL')
						.field('us._USERNAME')
						.field('us._ROLE_NO')
						.field('us._COMPANY_NO')
						.where("us._EMAIL = ? AND us._PWD = ?", userid, password)
						.toString();
		
		console.log(sql);
		dbConn.single(sql).then(function(rows){
			var result = JSON.parse(JSON.stringify(rows[0][0]));
			if(result){
			    var user = {
			    	'email'     : result._EMAIL,
			    	'username'  : result._USERNAME,
					'roleNo'    : result._ROLE_NO,
					'companyNo' : result._COMPANY_NO
				};
			    return done(null,user);
			}
			else{
			    return done(null,false);
			}
		})
		.catch(function(){
			console.log('catch');
		    return done(null,false);
		});
	}));

	passport.serializeUser(function(user, done) {
	    console.log('serialize');
	    done(null, user);
	});
	passport.deserializeUser(function(user, done) {
	    console.log('deserialize');
	    done(null, user);
	});



	function ensureAuthenticated(req, res, next) {
	    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
	    if (req.isAuthenticated()){
	        console.log('----------session True-----------------');
	        return next();
	    }
	    res.json(commonMsg.auth.fail);
	}

	app.get('/login', function(req,res){
	    var html = '';
	    if(req.isAuthenticated()){
	        html = "로그인중"    
	        res.send(html);
	    }
	    else{
	        res.redirect('/index.html');
	    }
	})
	
	app.get('/success', ensureAuthenticated, function(req,res){
		res.json(commonMsg.auth.success);
	});


	app.get('/failure', function(req,res){
	    res.json(commonMsg.auth.fail);
	});


	app.get('/authPage', ensureAuthenticated, function(req,res){
	    res.send(req.user);
	})	

	// app.post('/login', 
	//      passport.authenticate('local', { successRedirect: '/success',
	//                                       failureRedirect: '/failure',
	//                                       failureFlash: true }));

   	app.post('/login', passport.authenticate('local', { failureFlash: true }), function(req,res){
	    if(req.isAuthenticated()){
			res.json(commonMsg.auth.success);
	    }
	    else{
			res.json(commonMsg.auth.fail);
	    }	
	});
}