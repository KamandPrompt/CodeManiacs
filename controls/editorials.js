var helper = {};
var request = require("request-promise");
var problems = require("../models/problems");

helper.showAll = async (req, res, next) => {
    problems.find({ isVisible: true })
        .then((data) => {
            // console.log(data);
            res.render("editorials" , { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
};

module.exports = helper;