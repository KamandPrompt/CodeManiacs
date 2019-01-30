var express = require("express");
var router = express.Router();
var admin = require("../controls/admin");

router.get("/", (req, res, next) => {
    res.render("admin");
});

router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

router.get("/edit/:qID",admin.getQuestion);

router.post("/add", admin.addQuestion);

router.put("/edit/:qID", admin.editQuestion);

module.exports = router;
