var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/problems/all", (req, res) => {    
    const ProblemsModel = require("../models/problems");
    var table = ProblemsModel.find({isVisible: 1},{id: -1,name: 1,tags: 1,difficulty: 1}).sort({id: -1}).then(function(doc){
        res.render("problem_set",{db: doc});
    });
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display");
});

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;
