var helper = {};
var request = require("request-promise");
var testcases = require("../models/testcases");
var submission = require("../models/submission");
var problems = require("../models/problems");
var users = require('../models/users');
var lang = require("../config/lang");

helper.displayProblem = async (req, res, next) => {
    /**Finding the question by it's qID from the URL */
    problems.findOne({ qID: req.params.qID })
        .then((data) => {
            console.log(data);
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
            res.render("contest_problem", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}


module.exports = helper;
