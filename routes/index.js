var express = require("express");
var router = express.Router();

var problemController = require('../controls/problems');
var upload = multer({dest: 'tmp/'});

router.get("/", (req, res) => {
    res.render("index");
});

router.get("/problems/all", (req, res) => {
    res.render("problem_set");
});

router.get("/problem/:qID", (req, res) => {
    res.render("problem_display");
});

router.post("/problem/:qID", upload.single('submit-file'), problemController.submitSolution);

router.get("/rankings", (req, res) => {
    res.render("rankings");
});

module.exports = router;
