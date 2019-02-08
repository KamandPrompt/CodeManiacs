var helper = {};
var request = require("request-promise");
var testcases = require("../models/testcases");
var submission = require("../models/submission");
var problems = require("../models/problems");
var user = require('../models/users');
var lang = require("../config/lang");

helper.problemSet = async (req, res, next) => {
    problems.find({ isVisible: true }).sort({ qID: -1 })
        .then((data) => {
            console.log(data);
            res.render("problem_set", { problems: data });
        })
        .catch((err) => {
            console.log(err);
        })
}

helper.displayProblem = async (req, res, next) => {
    problems.findOne({ qID: req.params.qID })
        .then((data) => {
            if (data === null) {
                next();
            }
            if (res.locals.user && res.locals.user.isAdmin === false && data.isVisible === false) {
                next();
            }
            if (res.locals.user === null && data.isVisible === false) {
                next();
            }
            res.render("problem_display", { data: data });
        })
        .catch((err) => {
            console.log(err);
        })
}

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

        options.body['cpu_time_limit'] = Number(data["timeLimit"]);
        options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 3;
        options.body['memory_limit'] = Number(data["memoryLimit"]);
        options.body['source_code'] = data["code"];
        options.body['language_id'] = data["langID"];

        data["files"].forEach((testcase) => {
            options.body['stdin'] = testcase["stdin"];
            options.body['expected_output'] = testcase["stdout"];
            tests.push(request(options));
        });
        const judge0Response = await Promise.all(tests);
        return judge0Response;
    }

    const qID = req.body.qID;
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

helper.getIde = function (req, res) {
    res.render('ide', { langlist: lang });
};

helper.postIde = function (req, res) {
    var options = {
        method: 'POST',
        url: "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true",
        headers: {
            "cache-control": "no-cache",
            "Content-Type": "application/json"
        },
        body: {
            "source_code": req.body.src,
            "language_id": parseInt(req.body.lang),
            "stdin": req.body.stdin,
            "cpu_time_limit": 5
        },
        json: true
    }
    console.log(options);
    request(options, function (err, result, body) {
        res.send(body);
    });
}

helper.renderUsers = function (req, res) {
    // Add code to display rankings here
    var data = [];
    res.render('rankings', {data: data});
}

module.exports = helper;
