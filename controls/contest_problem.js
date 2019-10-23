var helper = {};
var request = require("request-promise");
var testcases = require("../models/testcases");
var submission = require("../models/submission");
var problems = require("../models/problems");
var users = require('../models/users');
var lang = require("../config/lang");
var contests = require("../models/contests");
var moment = require("moment")

helper.displayProblem = async (req, res, next) => {
    var contestCode= req.params.contestCode;
    contests.findOne({code: contestCode}).then((contestData) => {
        var contest_start = moment(contestData.date).format("YYYY-MM-DD H:mm:ss") > moment(Date.now()).format("YYYY-MM-DD H:mm:ss")
		if(contest_start){
			res.redirect("/contests/");
			return;
		}
        /**Finding the question by it's qID from the URL */
        problems.findOne({ qID: contestData.problemsID[req.params.qID] })
            .then((data) => {
                /**qID not found */
                if (data === null) {
                    next();
                }
                /**false visible questions should not be accessible by a non-admin user */
                if (res.locals.user && res.locals.user.isAdmin === false && data.isVisible === false) {
                    next();
                }
                /**false visible questions should not be accessible by a non logged in user */
                if (res.locals.user === null && data.isVisible === false) {
                    next();
                }
                data.qID = req.params.qID;
                res.render("contest_problem", { data: data });
            })
            .catch((err) => {
                console.log(err);
            })
    });
}


module.exports = helper;
