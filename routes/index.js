var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/problems/all", (req, res) => {
    res.render("problem_set");
    finder();
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display");
});

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;


//to check for visibility of a question and then print it on to the required page.
const ProblemsModel = require("../models/problems");
function finder() { 
        ProblemsModel.find({isVisible: 1}).then(function(doc) {
        var table = [];
        for(var i=0; i < doc.length ; i++ )
        {
            table.push([doc[i].id,doc[i].name,doc[i].tags,doc[i].difficulty]);
        }
        console.log(table);
    })
}