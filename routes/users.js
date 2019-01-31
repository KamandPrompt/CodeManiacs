var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");

var authController = require('../controls/auth')

router.get("/login", authController.getLogin);

router.post('/login', authController.postLogin);

router.get('/logout', authController.getLogout);

router.get("/signup", (req, res, next) => {
    res.render("signup");
});

router.post('/signup', authController.postSignUp);

router.get("/profile", (req, res, next) => {
    res.render("profile");
});

router.get("/submissions", (req, res, next) => {
    res.render("submissions");
});

module.exports = router;
