var helper = {};
var request = require("request-promise");
var testcases = require("../models/testcases");
var submission = require("../models/submission");
var problems = require("../models/problems");
var users = require('../models/users');
var lang = require("../config/lang");
var contests = require("../models/contests");
var participation = require("../models/participation.js")

/**To display all the problems to the users that should
 * be visible to the users.
 * route: /problems/all
 */
helper.problemSet = async (req, res, next) => {
    /**Quering problems that should be visible to the users */
    problems.find({ isVisible: true })
        .then((data) => {
            console.log(data);
            /**Accepted questions grouping by username and qID */
            submission.aggregate([
                { $match: { verdict: "Accepted" } },
                { $group: { _id: { username: "$username", qID: "$qID" } } }
            ]).then((probSolved) => {
                var probSolvedObj = {};
                /**Counting the frequency of each solved questions */
                for (var i = 0; i < probSolved.length; i++) {
                    probSolvedObj[probSolved[i]._id.qID] = 1 + (probSolvedObj[probSolved[i]._id.qID] || 0);
                }
                /**Comparator function to sort the problems in descending
                 * order of the count of solved
                 */
                function cmp(a, b) {
                    if (probSolvedObj[a.qID] === null && probSolvedObj[b.qID] === null) return -1;
                    if (probSolvedObj[a.qID] && !probSolvedObj[b.qID]) return -1;
                    if (!probSolvedObj[a.qID] && probSolved[b.qID]) return 1;
                    return Number(probSolvedObj[a.qID]) > Number(probSolvedObj[b.qID]) ? -1 : 1;
                }
                data.sort(cmp);
                res.render("problem_set", { problems: data, solved: probSolvedObj });
            })
        })
        .catch((err) => {
            console.log(err);
        })
}
/**Display the problem with qID 
 * route: /problem/:qID
*/
helper.displayProblem = async (req, res, next) => {
    /**Finding the question by it's qID from the URL */
    problems.findOne({ qID: req.params.qID })
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
            res.render("problem_display", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}
/**To display recently added new problems and 
 * top ranking on home page
 * route: /
 */
helper.recentProbNrank = async (req, res, next) => {
    /**Quering problems that should be visible to the users */
    var recent_probs = [];
    problems.find({ isVisible: true })
        .then((recent_prob) => {
            recent_probs = recent_prob;
            // console.log(recent_probs);
            // res.render("index", { recent_problems:  });
        })
        .catch((err) => {
            console.log(err);
        })
    users.find()
        .then((data) => {
            /**Accepted questions grouping by username and qID */
            submission.aggregate([
                { $match: { verdict: "Accepted" } },
                { $group: { _id: { username: "$username", qID: "$qID" } } }
            ]).then((user_questions) => {
                var user_solved = {};
                /**Counting the frequency of problems solved by each user */
                for (var i = 0; i < user_questions.length; i++) {
                    user_solved[user_questions[i]._id.username] = 1 + (user_solved[user_questions[i]._id.username] || 0);
                }
                /**Comparator function to sort the user in descending
                 * order of the count of solved
                 */
                function cmp(a, b) {
                    if (user_solved[a.username] === null && user_solved[b.username] === null) return -1;
                    if (user_solved[a.username] && !user_solved[b.username]) return -1;
                    if (!user_solved[a.username] && user_questions[b.username]) return 1;
                    return Number(user_solved[a.username]) > Number(user_solved[b.username]) ? -1 : 1;
                }
                data.sort(cmp);
                console.log(recent_probs);
                console.log(data);
                console.log(user_solved);
                /**Calulating the rank based on the total number of solved
                 * problems by each user. User having same number of problems solved
                 * has the same rank.
                 * Initializing the current rank to 0 and current solved to INF (~100000000)
                 */
                var currRank = 0, currSolved = 100000000;
                for (var i = 0; i < data.length; i++) {
                    /**This user hasn't solved even a single question */
                    if (!user_solved[data[i].username]) {
                        data[i].rank = currRank + 1;
                        data[i].solved = 0;
                        continue;
                    }
                    /**This user has lesser problems solved than the previous user */
                    else if (user_solved[data[i].username] < currSolved) {
                        currSolved = user_solved[data[i].username];
                        currRank += 1;
                    }
                    /**Else this user has same number of problems solved as the previous user */
                    data[i].rank = currRank;
                    data[i].solved = currSolved;
                }
                res.render("index", { ranks: data, recentProblems: recent_probs });
            })
        })
        .catch((err) => {
            console.log(err);
        })
}
/**FILE: app.js
 * POST: submitting the problem qID 
 * route: /submit/:qID */
helper.submitSolution = async (req, res, next) => {

    // takes obj as input {files:*all test files*, Time:*time limit per file*, Memory:*memory per file*, code:*user's code*, langID:*language ID*}
    const checkAnswer = async (data) => {
        const options = {
            "method": "POST",
            "url": "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true",
            "headers": {
                "cache-control": "no-cache",
                "Content-Type": "application/json"
            },
            "body": {
                "source_code": "_fill",
                "language_id": "_fill",
                "stdin": "_fill",
                "expected_output": "_fill",
                "memory_limit": "_fill",
                "cpu_time_limit": "_fill",
            },
            "json": true
        };
        const tests = [];

        /**Getting the required field values for making a user submission for a problem */
        options.body['cpu_time_limit'] = Number(data["timeLimit"]);
        options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 3;
        options.body['memory_limit'] = Number(data["memoryLimit"]);
        options.body['source_code'] = data["code"];
        options.body['language_id'] = data["langID"];

        /**Attaching each testcase */
        data["files"].forEach((testcase) => {
            options.body['stdin'] = testcase["stdin"];
            options.body['expected_output'] = testcase["stdout"];
            tests.push(request(options));
        });
        const judge0Response = await Promise.all(tests);
        return judge0Response;
    }

    const qID = req.body.qID;
    console.log("ID:::",qID)
    testcases.findOne({ qID: qID }, async (err, tc) => {
        if (err) {
            console.log(err);
        }
        var data = {
            qID: req.body.qID,
            code: req.body.code,
            langID: req.body.language,
            timeLimit: tc.timeLimit,
            memoryLimit: tc.memoryLimit,
            files: tc.cases
        }
        var results = await checkAnswer(data);
        //code to attach this submissions data to user's account
        var tcs = [], verdict = 'Accepted', time = 0, mem = 0, flag = false;
        for (i = 0; i < results.length; i++) {
            time = Math.max(time, results[i].time);
            mem = Math.max(mem, results[i].memory);
            if (flag === false && results[i].status.description !== 'Accepted') {
                verdict = results[i].status.description;
                flag = true;
            }
            tcs.push({
                status: results[i].status.description,
                time: results[i].time,
                memory: results[i].memory
            });
        }
        var langName;
        const subCount = await submission.countDocuments({});
        for (var i = 0; i < lang.length; i++) {
            if (lang[i].id === parseInt(req.body.language)) {
                langName = lang[i].name;
                break;
            }
        }
        var newSubmission = new submission({
            username: req.user ? req.user.username : 'Guest',
            qID: req.body.qID,
            subID: 1 + subCount,
            code: req.body.code,
            language: langName,
            verdict: verdict,
            time: time,
            memory: mem,
            isVisible: true,
            timeStamp: new Date(),
            tc: tcs
        });

        newSubmission.save(function (err) {
            if (err) {
                console.log(err);
            }
            console.log(newSubmission);
        });

        //deleting fields that user shouldn't have access to
        results.forEach(item => {
            item["token"] = null;
            item["stdout"] = null;
        });
        console.log(results);
        res.send(results);
    });
}

/**FILE: app.js
 * POST: submitting the problem qID from contest with id -> ContestCode
 * route: /submit/:contestCode/:qID */
helper.submitContestSolution = async (req, res, next) => {

    // takes obj as input {files:*all test files*, Time:*time limit per file*, Memory:*memory per file*, code:*user's code*, langID:*language ID*}
    const checkAnswer = async (data) => {
        const options = {
            "method": "POST",
            "url": "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true",
            "headers": {
                "cache-control": "no-cache",
                "Content-Type": "application/json"
            },
            "body": {
                "source_code": "_fill",
                "language_id": "_fill",
                "stdin": "_fill",
                "expected_output": "_fill",
                "memory_limit": "_fill",
                "cpu_time_limit": "_fill",
            },
            "json": true
        };
        const tests = [];

        /**Getting the required field values for making a user submission for a problem */
        options.body['cpu_time_limit'] = Number(data["timeLimit"]);
        options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 3;
        options.body['memory_limit'] = Number(data["memoryLimit"]);
        options.body['source_code'] = data["code"];
        options.body['language_id'] = data["langID"];

        /**Attaching each testcase */
        data["files"].forEach((testcase) => {
            options.body['stdin'] = testcase["stdin"];
            options.body['expected_output'] = testcase["stdout"];
            tests.push(request(options));
        });
        const judge0Response = await Promise.all(tests);
        return judge0Response;
    }
    // console.log(req.params.contestCode);
    contests.find({code:req.params.contestCode}).then(async(contestData)=>{
        if(contestData.length == 0) {
            ;
        }

        if(contestData[0].problemsID.length >= req.params.qID) {
            ;
        }
        const qID = contestData[0].problemsID[req.params.qID];
        testcases.findOne( { qID: qID }, async (err, tc) => {
            if (err) {
                console.log(err);
            }
            var data = {
                qID: req.body.qID,
                code: req.body.code,
                langID: req.body.language,
                timeLimit: tc.timeLimit,
                memoryLimit: tc.memoryLimit,
                files: tc.cases
            }
            var results = await checkAnswer(data);

            //code to attach this submissions data to user's account
            var tcs = [], verdict = 'Accepted', time = 0, mem = 0, flag = false;

            for (i = 0; i < results.length; i++) {
                time = Math.max(time, results[i].time);
                mem = Math.max(mem, results[i].memory);
                if (flag === false && results[i].status.description !== 'Accepted') {
                    verdict = results[i].status.description;
                    flag = true;
                }
                tcs.push( {
                    status: results[i].status.description,
                    time: results[i].time,
                    memory: results[i].memory
                });
            }

            var langName;
            const subCount = await submission.countDocuments({});
            for (var i = 0; i < lang.length; i++) {
                if (lang[i].id === parseInt(req.body.language)) {
                    langName = lang[i].name;
                    break;
                }
            }

            var newSubmission = new submission({
                username: req.user ? req.user.username : 'Guest',
                qID: req.body.qID,
                subID: 1 + subCount,
                code: req.body.code,
                language: langName,
                verdict: verdict,
                time: time,
                memory: mem,
                isVisible: true,
                timeStamp: new Date(),
                tc: tcs
            });

            newSubmission.save(function (err) {
                if (err) {
                console.log(err);
                }
                console.log(newSubmission);
            });

            var temp;
            participation.findOne({"username": newSubmission.username, "contestCode": contestData[0].code }, 
                                function(err, result)
            {
                if(err) {
                    throw(err);
                }
                console.log("------Updating the database--------------");
                temp = result;
                temp.submissions.push(newSubmission.subID);
                var check = true;
                
                // Check if the submission is within the contest time.
                // if(Date.now() >= temp.startTime && Date.now() <= temp.endTime){
                //     check = true;
                // }

                if(check){
                    // Check if the current Question is already solved or not.
                    var current_problem_exists = false;
                    for (var i = 0; i < (temp.solved_qID).length; i++) {
                        if (newSubmission.qID === temp.solved_qID[i]) {
                            current_problem_exists = true;
                            break;
                        }
                    }

                    /* 
                       If Verdict is Accepted and Question was not previously solved then,
                       update score, penalty and add it to solved questions.
                    */
                    if(newSubmission.verdict === 'Accepted' && current_problem_exists === false) {
                        temp.score += 1;
                        temp.penalty += (Date.now() - temp.startTime);
                        temp.solved_qID.push(newSubmission.qID);
                    }
                    if(current_problem_exists === false && newSubmission.verdict != 'Accepted') {
                        temp.penalty += 20*60;
                    }
                }
                
                // Update the Database with the values calculated above
                var query = {"username": newSubmission.username, "contestCode": contestData[0].code };
                var newValues = { $set: { "score": temp.score, 
                                          "penalty": temp.penalty,
                                          "solved_qID": temp.solved_qID, 
                                          "submissions": temp.submissions } };

                participation.updateOne(query, newValues)
                .then(async (data1)=>{
                    console.log(data1);
                    console.log("------Completed Updating Database--------------");
                })
                .catch(async (err) => {
                    console.log("------Some Error While Updating Database--------------");
                    console.log(err);
                });

            });

            //deleting fields that user shouldn't have access to
            results.forEach(item => {
                item["token"] = null;
                item["stdout"] = null;
            });
            res.send(results);
        });
    })
    .catch(async (err) => {
        console.log(err);
    });

}

/**Display the IDE page 
 * route: /ide
*/
helper.getIde = function (req, res) {
    res.render('ide', { langlist: lang });
};

/**POST: submitting the IDE code, input 
 * route: /ide
*/
helper.postIde = function (req, res) {
    var options = {
        method: 'POST',
        /**&wait=true for getting the submission result after submitting the code automatically */
        url: "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true",
        headers: {
            "cache-control": "no-cache",
            "Content-Type": "application/json"
        },
        body: {
            "source_code": req.body.src,
            "language_id": parseInt(req.body.lang),
            "stdin": req.body.stdin,
            "cpu_time_limit": 5     // time limit to 5 sec for the IDE
        },
        json: true
    }
    console.log(options);
    request(options, function (err, result, body) {
        res.send(body);
    });
}

/**
 * To display the user ranklist
 * route: /rankings
 */
helper.userRankings = function (req, res) {
    /**Getting all the users */
    users.find()
        .then((data) => {
            /**Accepted questions grouping by username and qID */
            submission.aggregate([
                { $match: { verdict: "Accepted" } },
                { $group: { _id: { username: "$username", qID: "$qID" } } }
            ]).then((user_questions) => {
                var user_solved = {};
                /**Counting the frequency of problems solved by each user */
                for (var i = 0; i < user_questions.length; i++) {
                    user_solved[user_questions[i]._id.username] = 1 + (user_solved[user_questions[i]._id.username] || 0);
                }
                /**Comparator function to sort the user in descending
                 * order of the count of solved
                 */
                function cmp(a, b) {
                    if (user_solved[a.username] === null && user_solved[b.username] === null) return -1;
                    if (user_solved[a.username] && !user_solved[b.username]) return -1;
                    if (!user_solved[a.username] && user_questions[b.username]) return 1;
                    return Number(user_solved[a.username]) > Number(user_solved[b.username]) ? -1 : 1;
                }
                data.sort(cmp);
                /**Calulating the rank based on the total number of solved
                 * problems by each user. User having same number of problems solved
                 * has the same rank.
                 * Initializing the current rank to 0 and current solved to INF (~100000000)
                 */
                var currRank = 0, currSolved = 100000000;
                for (var i = 0; i < data.length; i++) {
                    /**This user hasn't solved even a single question */
                    if (!user_solved[data[i].username]) {
                        data[i].rank = currRank + 1;
                        data[i].solved = 0;
                        continue;
                    }
                    /**This user has lesser problems solved than the previous user */
                    else if (user_solved[data[i].username] < currSolved) {
                        currSolved = user_solved[data[i].username];
                        currRank += 1;
                    }
                    /**Else this user has same number of problems solved as the previous user */
                    data[i].rank = currRank;
                    data[i].solved = currSolved;
                }
                res.render("rankings", { data: data });
            })
        })
        .catch((err) => {
            console.log(err);
        })
}

module.exports = helper;
