const express = require('express');
const router = express.Router();
const dbRef = require('../private/fire').dbRef ;
const request = require('request-promise');

// returns Array containing [stdin,stdout,time,memory] of the question with qID
const getParams = async (qID) => {

    // create a reference to the database
    const limitRef = dbRef.ref('questions/'+qID);
    const testcaseRef = dbRef.ref('testcases/'+qID);

    // create promises to fetch the testcase and memory and time limits
    const input = testcaseRef.child('stdin').once('value');
    const output = testcaseRef.child('stdout').once('value');
    const time = limitRef.child('Time').once('value');
    const memory = limitRef.child('Memory').once('value');

    //wait for the promises to resolve
    let arr = await Promise.all([input,output,time,memory]);

    //extract the value from resolved promises
    arr = arr.map(item => item.val());

    return arr;
}

const submitSolution = async (req,res,next) => {
    
    const qID = req.body.qID;
    const arr = await getParams(qID);
    const langID = Number(req.body.language);
    arr.push(req.body.code);
    arr.push(langID);
    
    const result = await checkAnswer(arr);
    /*
    add code to attach this submissions data to user's account
    */
    res.send(result.status.description);
}

// takes arr as input [stdin,stdout,time,memory,srcCode,langID]
const checkAnswer = async(arr) => {
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
    }

    options.body['stdin'] = arr[0];
    options.body['expected_output'] = arr[1];
    options.body['cpu_time_limit'] = Number(arr[2]);
    options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 1.5;
    options.body['memory_limit'] = arr[3];
    options.body['source_code'] = arr[4];
    options.body['language_id'] = arr[5];

    const SNTCresponse = await request(options);

    return SNTCresponse;
}


router.post('/',submitSolution);

module.exports = router;