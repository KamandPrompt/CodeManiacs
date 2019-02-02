var express = require("express");
var router = express.Router();
var contests = require("../controls/contests");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contests", contests.showContests);

router.get("/problems/all", (req, res) => {
    res.render("problem_set");
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display");
});

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;
