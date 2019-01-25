var express = require("express");
var router = express.Router();
var passport = require("passport");
var bcrypt = require("bcryptjs");

router.submitSolution = async (req, res, next) => {

    const qID = req.body.qID;
    const langID = Number(req.body.language);

    const code = req.body.code;

    const data = {
        qID: qID,
        langID: langID,
        code: code
    };

    /**
     * Add testcases field to data.
     * Then uncomment the follwoing code
     */

    /**----------------------------------------
    const result = await checkAnswer(data); //result is an array with results of all testcases
    
    //add code to attach this submissions data to user's account
    
    //deleting fields that user shouldn't have access to
    result.forEach(item => {
        item["token"] = null;
        item["stdout"] = null;
    });
    *-------------------------------------------
    */

    console.log(data);

    result = "AC/ WA/ TLE";

    res.send(result);
}


// takes obj as input {files:*all test files*, Time:*time limit per file*, Memory:*memory per file*, code:*user's code*, langID:*language ID*}
const checkAnswer = async (data) => {
    const options = {
        "method": "POST",
        "url": "http://sntc.iitmandi.ac.in:3000/submissions/",
        "qs": {
            "base64_encoded": "false",
            "wait": "true"
        },
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
            "wall_time_limit": "cpu_time*1.5",
            "cpu_time_limit": "_fill"
        },
        "json": true
    };
    const testAll = [];

    options.body['cpu_time_limit'] = Number(data["Time"]);
    options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 1.5;
    options.body['memory_limit'] = data["Memory"];
    options.body['source_code'] = data["code"];
    options.body['language_id'] = data["langID"];

    data["files"].forEach((testcase) => {
        options.body['stdin'] = testcase["stdin"];
        options.body['expected_output'] = testcase["stdout"];
        testAll.push(request(options));
    });

    const judge0Response = await Promise.all(testAll);

    return judge0Response;
}

module.exports = router;
