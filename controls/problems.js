var helper = {};
var testcases = require("../models/testcases");
var request = require("request-promise");

helper.submitSolution = async (req, res, next) => {

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

        //add code to attach this submissions data to user's account

        //deleting fields that user shouldn't have access to
        results.forEach(item => {
            item["token"] = null;
            item["stdout"] = null;
        });
        console.log(results);
        res.send(results);
    });
}


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

module.exports = helper;
