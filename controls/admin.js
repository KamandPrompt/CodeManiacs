var helper = {};
const Question = require("../models/problems");
const TC = require("../models/testcases");
const total = require("../models/total_questions");
const contests = require("../models/contests");
const users = require("../models/users");
var moment = require("moment");

/**Admin homepage displaying all the problems created till now.
 * route: /admin
 */
helper.displayAllProblems = async (req, res, next) => {
    /**Finding all the problems sorted in descending order of the qID */
    Question.find({}).sort({ qID: -1 })
        .then((data) => {
            res.render("admin", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}

/**POST: creating a new problem 
 * route: /admin/add
*/
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

        // question successfully created
        res.send(`Problem submitted as qID = ${qID.totalProblems}`);
    } catch (error) {
        console.log("couldn't submit the question/testcase");
        console.log(error);
        res.send("Problem could not be submitted");
    }
};

/**POST: deleting the problem qID 
 * route: /admin/dlt_prob/:qID
*/
helper.deleteProblem = async (req, res, next) => {
    /**Finding question by qID */
    Question.deleteOne({ qID: req.params.qID })
        .then((data) => {
            /**Deleted successfully */
            res.redirect("/admin");
        })
        .catch((err) => {
            console.log(err);
        })
}

/**PUT: editing the problem qID 
 * route: /admin/edit/:qID
*/
helper.editQuestion = async function (req, res, next) {

    console.log(req.body.qID);
    console.log(req.body.ques);
    // console.log(req.body.testcases);

    try {
        /**Finding question and testcase by it's qID and updating */
        await Question.findOneAndUpdate({ "qID": req.body.qID }, req.body.ques);
        await TC.findOneAndUpdate({ "qID": req.body.qID }, req.body.testcases);
        res.send("Question was updated");
    } catch (error) {
        res.send("Couldn't update the question");
        console.log(error);
    }
};

/**Display page for editing the existing problem having qID = params:qID 
 * route: /admin/edit/:qID
*/
helper.getQuestion = async (req, res, next) => {
    /**Finding question and tescase using the qID */
    const ques = await Question.findOne({ "qID": req.params.qID });
    const t_case = await TC.findOne({ "qID": req.params.qID });
    res.render("problem_edit", { ques, t_case });
}

/**POST: creating a new contest 
 * route: /admin/new-contest
*/
helper.createContest = async (req, res, next) => {

    /**Implement checking of the uniqueness of the contest code.
     * In case a contest is already present with the same code
     * then asks the user to enter another code.
    */

    /**Creating a object for new contest */
    var newContest = {
        code: req.body.contestCode, // contest code needs to be unique
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

/**Display page consisting of all the created contests 
 * route: /admin/my-contests
*/
helper.myContests = async (req, res, next) => {
    /**Finding all the contest in ascending order of the date */
    contests.find({}).sort({ date: 1 })
        .then((data) => {
            /**Modifying the date format */
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

/**POST: deleting the constest params:contCode 
 * route: /admin/dlt_contest/:contCode
*/
helper.deleteContest = async (req, res, next) => {
    /**Finding the contest by it's contCode */
    contests.deleteOne({ code: req.params.contCode })
        .then((data) => {
            res.redirect("/admin/my-contests");
        })
        .catch((err) => {
            console.log(err);
        })
}

/**Display page to edit the contest params:contCode 
 * route: /admin/edit-contest/:contCode
*/
helper.displayEditContest = async (req, res, next) => {
    /**Finding the contest by it's contCode */
    contests.findOne({ code: req.params.contCode })
        .then((data) => {
            /**Formatting the date in order to display in the HTML */
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

/**POST: edit the contest params:contCode 
 * route: /admin/edit-contest/:contCode
*/
helper.editContest = async (req, res, next) => {
    /**Getting data from each fields in the edit contest form */
    var editContest = {
        code: req.params.contCode,
        name: req.body.contestName,
        date: req.body.date + " " + req.body.startTime,
        duration: req.body.duration,
        visible: req.body.visibility,
        /**comma separated qID of the problems to be included in the contest */
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

/**Display the page for managing the admins 
 * route: /admin/manage-admins
*/
helper.getManageAdmins = async (req, res, next) => {
    /**Finding all the users who are admins also */
    users.find({ isAdmin: true })
        .then((data) => {
            console.log(data);
            res.render("manage_admins", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}

/**POST: adding a new admin 
 * route: /admin/add-admin
*/
helper.addAdmin = async (req, res, next) => {
    /**Taking input from the html form */
    const addUser = req.body.username;
    /**Finding the entry of that username in the users collection */
    users.findOne({ username: addUser })
        .then((data) => {
            console.log(data);
            /**No user found with username = addUser */
            if(!data){
                return res.redirect("/admin/manage-admins?msg=Username-" + addUser + "-does-not-exists");
            }
            /**If the username is already the admin */
            if(data.isAdmin){
                return res.redirect("/admin/manage-admins?msg=Username-" + addUser + "-is-already-an-admin");
            }
            /**Else add that username as an admin */
            users.findOneAndUpdate({username: addUser}, {$set:{isAdmin: 1}})
            .then((result)=>{
                console.log("ADMIN ADDED: " + result);
                return res.redirect("/admin/manage-admins?msg=Username-" + addUser + "-added-successfully");
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = helper;
