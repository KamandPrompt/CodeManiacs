var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/problems/all", (req, res) => {
    res.render("problem_set");
    const ProblemsModel = require("../models/problems");
    ProblemsModel.find({isVisible: 1},{id: -1,name: 1,tags: 1,difficulty: 1}).sort({id: -1}).then(doc => console.log(doc));
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display");
});

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;
