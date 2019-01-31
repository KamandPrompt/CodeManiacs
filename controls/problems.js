var helper = {};
var request = require("request-promise");
var fs = require('fs');

var testcases = require("../models/testcases");
var submission = require("../models/submission");
var problem = require("../models/problems");
var lang = require('../config/lang')

helper.submitSolution = async (req, res, next) => {
    var getResult = function(data, src){
        var verdict = 'AC', time = 0, mem = 0, flag = false;
        var tcs = [];
        for (var i=0; i<data.length; i++){
            time = Math.max(time, data[i].time);
            mem = Math.max(mem, data[i].memory);
            tcs[i].status = 'AC';
            if (data[i].status.id !== 3) {
                if (data[i].status.id === 4 || data[i].status.id === 13)
                    tcs[i].status = 'WA';
                else if (data[i].status.id === 5)
                    tcs[i].status = 'TLE';
                else if (data[i].status.id === 6)
                    tcs[i].status = 'CE';
                else
                    tcs[i].status = 'RE';
            }
            if (flag === false && tcs[i].status !== 'AC'){
                verdict = tcs[i].status;
                flag = true;
            } 
            tcs[i].time = data[i].time;
            tcs[i].memory = data[i].memory;
        }
        var langName, subCount=0;
        for (i=0; i<lang.length; i++){
            if (lang[i].id == parseInt(req.body.lang)){
                langName = lang[i].name;
            }
        }
        submission.count({}, function(err, c){
            if (err){
                console.log(err);
            } else {
                subCount = c;
            }
        });
        var newSubmission = new submission({
            username: req.user ? req.user.username : 'Guest',
            qID: req.params.qID,
            subID: 1 + subCount,
            code: src,
            language: langName,
            verdict: verdict,
            time: time,
            memory: mem,
            isVisible: true,
            timeStamp: new Date(),
            tc: tcs
        });
        newSubmission.save(function(err){
            if (err){
                console.log(err);
            }
        });
        problem.findOne({qID: req.params.qID}, function(err, probRes){
            res.render('problem_display', {verdict: verdict, time: time, memory:memory, language: langName});
        });
    };
    fs.readFile(req.file.path, "utf8", function(err, src){
        testcases.findOne({qID: req.params.qID}, function(err, tc){
            if (err){
                return console.log(err);
            }
            console.log(src);
            let options = [];
            for (var i=0; i<tc.cases.length; i++){
                options.push({
                    method: 'POST',
                    uri: "http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true",
                    headers: {
                        "cache-control": "no-cache",
                        "Content-Type": "application/json"
                    },
                    body: {
                        "source_code": src,
                        "language_id": parseInt(req.body.lang),
                        "stdin": tc.cases[i].stdin,
                        "expected_output": tc.cases[i].stdout,
                        "memory_limit": tc.timeLimit,
                        "cpu_time_limit": tc.memoryLimit
                    },
                    json: true
                });
            }
            const promises = options.map(opt => request(opt));
            Promise.all(promises).then((data) => {
                getResult(data, src);
                fs.unlink(req.file.path);
            });
        });
    });
}

module.exports = helper;
