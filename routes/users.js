var express = require("express");
var router = express.Router();

var authController = require('../controls/auth')
var enforceAuthentication = authController.enforceAuthentication;

router.get("/login", enforceAuthentication(false, false), authController.getLogin);

router.post('/login', enforceAuthentication(false, false), authController.postLogin);

router.get('/logout', enforceAuthentication(true, false), authController.getLogout);

router.get("/signup", enforceAuthentication(false, false), (req, res, next) => {
    res.render("signup");
});

router.post('/signup', enforceAuthentication(false, false), authController.postSignUp);

router.get("/profile", enforceAuthentication(true, false), authController.showProfile);

router.get("/submissions", enforceAuthentication(true, false), authController.submissionHistory);

router.get("/submission/:subID", enforceAuthentication(true, false), authController.submission_subID);

module.exports = router;
