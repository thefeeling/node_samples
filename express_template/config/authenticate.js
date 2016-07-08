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
		var sql = squel
		.select()
		.from('user', 'us')
		.field('us._EMAIL')
		.field('us._USERNAME')
		.field('us._ROLE_NO')
		.field('us._COMPANY_NO')
		.where("us._EMAIL = ? AND us._PWD = ?", userid, password)
		.toString();

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

	/**
	 * 세션 인증 확인 미들웨어
	 * @param  {[type]}   req  [description]
	 * @param  {[type]}   res  [description]
	 * @param  {Function} next [description]
	 * @return {[type]}        [description]
	 */
	function ensureAuthenticated(req, res, next) {
		// 로그인이 되어 있으면, 다음 파이프라인으로 진행
		if (req.isAuthenticated()){
			return next();
		}
		res.json(commonMsg.auth.fail);
	}

	// Export passport reference
	passport.ensureAuthenticated = ensureAuthenticated;
	app.passport = passport;
}
