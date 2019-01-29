var express = require("express");
var router = express.Router();
var admin = require("../controls/admin");
const Question = require("../models/problems");
const TC = require("../models/testcases");

router.get("/", (req, res, next) => {
    res.render("admin");
});

router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

router.get("/edit/:qID",async (req, res, next) => {
    const ques = await Question.findOne({"qID":req.params.qID});
    const t_case = await TC.findOne({"qID":req.params.qID});
    res.render("problem_edit",{ques,t_case});
});

router.post("/add", admin.addQuestion);

router.put("/edit/:qID", admin.editQuestion);

module.exports = router;
