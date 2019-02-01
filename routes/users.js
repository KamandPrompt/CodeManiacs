var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");

var authController = require('../controls/auth')
var enforceAuthentication = authController.enforceAuthentication;

router.get("/login", enforceAuthentication(false,false), authController.getLogin);

router.post('/login', enforceAuthentication(false,false), authController.postLogin);

router.get('/logout', enforceAuthentication(true,false), authController.getLogout);

router.get("/signup", enforceAuthentication(false,false), (req, res, next) => {
    res.render("signup");
});

router.post('/signup', enforceAuthentication(false,false), authController.postSignUp);

router.get("/profile", enforceAuthentication(true,false), (req, res, next) => {
    res.render("profile");
});

router.get("/submissions", enforceAuthentication(true,false), (req, res, next) => {
    res.render("submissions");
});

module.exports = router;
