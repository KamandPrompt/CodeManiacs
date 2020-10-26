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

helper.showOne = async (req, res, next) => {
    problems.findOne({ qID: req.params.qID })
        .then((data) => {
            if (data === null || data['editorial'] === null) {
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
            res.render("editorial", { editorial: data['editorial'] , questionNo : req.params.qID });
        })
};

module.exports = helper;