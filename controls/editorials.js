var helper = {};
var request = require("request-promise");
var problems = require("../models/problems");

helper.showOne = async (req, res, next) => {
    problems.findOne({ qID: req.params.qID })
        .then((data) => {
            if (data === null || data['editorial'] === null) {
                next();
            }
            /**false visible questions should not be accessible by a non-admin user or non logged in user */
            if (data.isVisible === false && ((res.locals.user && res.locals.user.isAdmin === false) || (res.locals.user === null)) ) {
                next();
            }
            res.render("editorial", { editorial: data['editorial'] , questionNo : req.params.qID });
        })
};

module.exports = helper;