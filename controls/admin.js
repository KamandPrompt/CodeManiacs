var helper = {};
var passport = require("passport");
var bcrypt = require("bcryptjs");
const Question = require("../models/problems");
const TC = require("../models/testcases");
const total = require("../models/total_questions");
const contests = require("../models/contests");
var moment = require("moment");

helper.displayAllProblems = async (req, res, next) => {
    Question.find({}).sort({ qID: -1 })
        .then((data) => {
            res.render("admin", {data: data});
        })
        .catch((err) => {
            console.log(err);
        })
}

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
        // console.log(tc);

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
    // console.log(req.body.testcases);

    try {
        await Question.findOneAndUpdate({ "qID": req.body.qID }, req.body.ques);
        await TC.findOneAndUpdate({ "qID": req.body.qID }, req.body.testcases);
        res.send("Question was updated");
    } catch (error) {
        res.send("Couldn't update the question");
        console.log(error);
    }
};

helper.getQuestion = async (req, res, next) => {
    const ques = await Question.findOne({ "qID": req.params.qID });
    const t_case = await TC.findOne({ "qID": req.params.qID });
    res.render("problem_edit", { ques, t_case });
}

helper.createContest = async (req, res, next) => {
    var newContest = {
        code: req.body.contestCode,
        name: req.body.contestName,
        date: req.body.date + " " + req.body.startTime,
        duration: req.body.duration,
        visible: req.body.visibility,
        problemsID: req.body.problemsID.split(",").map(qID => qID.trim())
    };

    await contests.create(newContest)
        .then((val) => {
            console.log(val);
        })
        .catch((err) => {
            console.log(err);
        })

    res.redirect("/admin/my-contests");
}

helper.myContests = async (req, res, next) => {
    contests.find({}).sort({ date: 1 })
        .then((data) => {
            for (var i = 0; i < data.length; i++) {
                data[i].D = moment(data[i].date).format('MMMM Do YYYY, h:mm:ss A');
            }
            console.log(data);
            res.render("admin_contests", { data: data });
        })
        .catch((err) => {
            console.log(err);
        });
}

helper.displayEditContest = async (req, res, next) => {
    contests.findOne({ code: req.params.contCode })
        .then((data) => {
            data.DD = moment(data.date).format("L").split("/")[1];
            data.MM = moment(data.date).format("L").split("/")[0];
            data.YY = moment(data.date).format("L").split("/")[2];
            data.TT = moment(data.date).format('HH:mm');
            res.render("edit_contest", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}

helper.editContest = async (req, res, next) => {
    var editContest = {
        code: req.params.contCode,
        name: req.body.contestName,
        date: req.body.date + " " + req.body.startTime,
        duration: req.body.duration,
        visible: req.body.visibility,
        problemsID: req.body.problemsID.split(",").map(qID => qID.trim())
    };
    await contests.update({ code: req.params.contCode }, editContest)
        .then((val) => {
            console.log("EDITED: " + val);
            res.redirect("/admin/my-contests?" + req.params.contCode + "_success");
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = helper;
