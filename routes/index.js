var express = require("express");
var router = express.Router();
var contests = require("../controls/contests");
var problems = require("../controls/problems");

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/contests", contests.showContests);

router.get("/problems/all", (req, res) => {
    res.render("problem_set");
});

router.get("/problem/:qID", problems.displayProblem);

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;
