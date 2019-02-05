var passport = require('passport');
var user = require('../models/users');
var submissions = require('../models/submission');
var moment = require("moment");

exports.postSignUp = function (req, res) {
    var acc = new user({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        isAdmin: false
    });
    user.register(acc, req.body.password, function (err, user) {
        if (err) {
            return res.render('signup', { user: user });
        }
        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
};

exports.getLogin = function (req, res) {
    if (req.user) {
        res.render('login', { message: "You have already logged in" });
    }
    else {
        res.render('login', { user: null, message: null });
    }
};

exports.postLogin = function (req, res) {
    passport.authenticate('local', function (err, user) {
        if (!user) {
            return res.render('login', { message: "Wrong username or password" });
        }
        req.logIn(user, function (err) {
            if (err) {
                console.log(err);
                return res.render('login', { message: "Wrong username or password" });
            }
            return res.redirect('/');
        });
    })(req, res);
};

exports.getLogout = function (req, res) {
    req.logout();
    res.redirect('/');
}

exports.enforceAuthentication = (loginRequired = true, adminRequired = false) => (req, res, next) => {
    if (loginRequired === req.isAuthenticated()) {
        if (!adminRequired || req.user.isAdmin) {
            next();
        } else {
            res.redirect('/');
        }
    } else if (loginRequired) {
        res.redirect('/user/login');
    } else {
        res.redirect('/');
    }
}

/**To show the user profile when logged in
 * route: /user/profile 
 * */
exports.showProfile = async (req, res, next) => {
    /**Collecting the user's data from the submissions collection */
    submissions.find({ username: res.locals.user.username })
        .then((data) => {
            stats = {
                AC: 0,
                WA: 0,
                TLE: 0,
                RE: 0,
                CE: 0
            };
            data.forEach(subm => {
                if (subm.verdict === "Accepted") {
                    stats.AC += 1;
                }
                else if (subm.verdict === "Wrong Answer") {
                    stats.WA += 1;
                }
                else if (subm.verdict === "Time Limit Exceeded") {
                    stats.TLE += 1;
                }
                else if (subm.verdict === "Compilation Error") {
                    stats.CE += 1;
                }
                else {
                    stats.RE += 1;
                }
            });
            console.log(stats);
            res.render("profile", { stats: stats });
        })
        .catch((err) => {
            console.log(err);
        })
}

/**To show the user submission history table when logged in
 * route: /user/submissions
 */
exports.submissionHistory = async (req, res, next) => {
    /**Collecting the user submission data from the submissions collection */
    submissions.find({ username: res.locals.user.username }).sort({ timeStamp: -1 })
        .then((data) => {
            /**Changing the date-time format */
            for (var i = 0; i < data.length; i++) {
                data[i].date = moment(data[i].timeStamp).format("MMMM Do YYYY, h:mm:ss A");
            }
            res.render("submissions", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}
