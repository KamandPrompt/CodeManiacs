var passport = require('passport');
var user = require('../models/users');

exports.postSignUp= function(req, res){
    var acc = new user({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        isAdmin: false
    });
    user.register(acc, req.body.password, function(err, user){
        if (err){
            return res.render('signup', {user: user});
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
};

exports.getLogin = function(req, res){
    if (req.user){
        res.render('login', {message: "You have already logged in"});
    }
    else{
        res.render('login',{user: null, message: null});
    }
};

exports.postLogin = function(req, res){
    passport.authenticate('local', function(err, user){
        if (!user){
            return res.render('login', {message: "Wrong username or password"});
        }
        req.logIn(user, function(err){
            if (err){
                console.log(err);
                return res.render('login', {message: "Wrong username or password"});
            }
            return res.redirect('/');
        });
    })(req,res);
};

exports.getLogout = function(req, res){
    req.logout();
    res.redirect('/');
}

exports.enforceAuthentication = (loginRequired=true,adminRequired=false) => (req,res,next) => {
    if(loginRequired === req.isAuthenticated()){
        if(!adminRequired || req.user.isAdmin ){
            next();
        } else {
            res.redirect('/');
        }
    } else if(loginRequired){
        res.redirect('/user/login');
    } else {
        res.redirect('/');
    }
}
