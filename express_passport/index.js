var express       = require('express');
var bodyParser    = require('body-parser');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash         = require("connect-flash");
var session       = require('express-session');
var MySQLStore    = require('express-mysql-session')(session);
var cookieParser  = require('cookie-parser');
var app           = express();

app.use(express.static('public'));
app.locals.pretty = true;

app.use(cookieParser('1234567890'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session({
    secret : 'kasdfasdf123!', // Secret Key
    resave : false,
    saveUninitialized : true,
    store : new MySQLStore({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'o2',
        expiration: 10000,
        checkExpirationInterval : 20000     
    })
}));

app.listen(3000, function(){
	console.log('Connected 3000 Port');
});

passport.use(new LocalStrategy({
    usernameField : 'userid',
    passwordField : 'password',
    passReqToCallback : true
}
,function(req,userid, password, done) {
    console.log(userid + "//" + password);
    if(userid=='hello' && password=='world'){
        var user = {
            'userid':'hello',
            'email':'hello@world.com'
        };
        return done(null,user);
    }
    else{
        return done(null,false);
    }
}));

passport.serializeUser(function(user, done) {
    console.log('serialize');
    done(null, user);
});
// 인증 후, 페이지 접근시 마다 사용자 정보를 Session에서 읽어옴.
passport.deserializeUser(function(user, done) {
    console.log('deserialize');
    done(null, user);
});

app.get('/login_success', ensureAuthenticated, function(req,res){
	res.send("login success");
})

app.get('/login_fail', function(req,res){
	res.send("login fail");
})

app.get('/login', function(req,res){
    var html = '';
    if(req.isAuthenticated()){
        html = "로그인중"    
    }
    else{
        html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title></title>
            </head>
            <body>
            <form action="/login" method="post">
                <div>
                    <label>UserId:</label>
                    <input type="text" name="userid"/><br/>
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password"/>
                </div>
                <div>
                    <input type="submit" value="Submit"/>
                </div>
            </form>
            </body>
            </html>
        `
    }
    res.send(html);
})


app.get('/authPage', ensureAuthenticated, function(req,res){
    res.send(req.user);
})




function ensureAuthenticated(req, res, next) {
    console.log(req.isAuthenticated());
    console.log('----------ensureAuthenticated-----------------');
    // 로그인이 되어 있으면, 다음 파이프라인으로 진행
    if (req.isAuthenticated()){
        console.log('----------session True-----------------');
        return next();
    }
    
    // 로그인이 안되어 있으면, login 페이지로 진행
    res.redirect('/index.html');
}
app.post('/login',
     passport.authenticate('local', { successRedirect: '/login_success',
                                      failureRedirect: '/login',
                                      failureFlash: true }));
