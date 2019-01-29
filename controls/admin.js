var helper = {};
var passport = require("passport");
var bcrypt = require("bcryptjs");
const Question = require("../models/problems");
const TC = require("../models/testcases");
const total = require("../models/total_questions");

helper.addQuestion = async function (req, res, next) {

    const ques = req.body.ques; // problem statement
    const tc = req.body.testcases; // testcases

    try {
        // attach qID to tc and ques
        const qID = await total.findOne({});
        qID.totalProblems += 1;
        await qID.save();
        ques.qID = qID.totalProblems;
        tc.qID = qID.totalProblems;

        // log them to the console
        console.log(ques);
        console.log(tc);

        // push to database
        await Question.create(ques);
        await TC.create(tc);

        res.send(`Problem submitted as qID = ${qID.totalProblems}`);
    } catch (error) {
        console.log("couldn't submit the question/testcase");
        console.log(error);
        res.send("Problem could not be submitted");
    }
};

helper.editQuestion = async function (req, res, next) {

    console.log(req.body.qID);
    console.log(req.body.ques);
    console.log(req.body.testcases);

    try{
        await Question.findOneAndUpdate({"qID":req.body.qID}, req.body.ques) ;
        await TC.findOneAndUpdate({"qID":req.body.qID}, req.body.testcases) ;
        res.send("Question was updated");
    } catch (error) {
        res.send("Couldn't update the question");
        console.log(error);
    }
};

module.exports = helper;
