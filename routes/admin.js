var express = require("express");
var router = express.Router();
var admin = require("../controls/admin");

router.get("/", admin.displayAllProblems);

router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

router.get("/edit/:qID", admin.getQuestion);

router.post("/add", admin.addQuestion);

router.put("/edit/:qID", admin.editQuestion);

router.post("/dlt_prob/:qID", admin.deleteProblem);

router.post("/dlt_contest/:contCode", admin.deleteContest);

router.get("/new-contest", (req, res, next) => {
    res.render("new_contest");
});

router.post("/new-contest", admin.createContest);

router.get("/my-contests", admin.myContests);

router.get("/edit-contest/:contCode", admin.displayEditContest);

router.post("/edit-contest/:contCode", admin.editContest);

module.exports = router;
