var express = require("express");
var router = express.Router();
var functions = require("../controls/functions");

router.get("/", (req, res, next) => {
    res.render("admin");
});

router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

router.get("/edit/:qID", (req, res, next) => {
    res.render("problem_edit");
});

router.post("/add", functions.submitQuestion);

router.put("/edit/:qID", functions.editQuestion);

module.exports = router;
