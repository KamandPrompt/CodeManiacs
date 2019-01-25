var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");

/**
 * Import the user schema
 * */

router.get("/login", (req, res, next) => {
    res.render("login");
});

router.get("/signup", (req, res, next) => {
    res.render("signup");
});

module.exports = router;
