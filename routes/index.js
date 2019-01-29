var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {user: req.user});
});

router.get("/problems/all", (req, res) => {
    res.render("problem_set", {user: req.user});
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display,", {user: req.user});
});

router.get("/rankings", (req, res) => {
    res.render("rankings", {user: req.user});
});

module.exports = router;
