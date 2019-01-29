var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {user: req.user});
});

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
