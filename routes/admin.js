var express = require("express");
var router = express.Router();

const submitQuestion = async function (req, res, next) {

    console.log(req.body.ques);
    console.log(req.body.testcases);

    /**
     * Add the problem here.
     * The qID of this problem will be the 
     * largest qID from the collection plus 1
     */

    res.status(201).send('Success/ Failure');
};

const editQuestion = async function (req, res, next) {

    console.log(req.body.qID);
    console.log(req.body.ques);
    console.log(req.body.testcases);

    /**
     * Update the problem here
     */

    res.status(201).send('Success/ Failure');
};

router.get("/", (req, res, next) => {
    res.render("admin");
});

router.get("/add", (req, res, next) => {
    res.render("problem_add");
});

router.get("/edit/:qID", (req, res, next) => {
    res.render("problem_edit");
});

router.post("/add", submitQuestion);

router.put("/edit/:qID", editQuestion);

module.exports = router;
