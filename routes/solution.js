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
    let data = await Promise.all([input,output,time,memory]);

    //extract the value from resolved promises
    data = data.map(item => item.val());

    return data;
}

const submitSolution = async (req,res,next) => {
    
    const qID = req.body.qID;
    const data = await getParams(qID);
    const langID = Number(req.body.language);
    data.push(req.body.code);
    data.push(langID);
    
    const result = await checkAnswer(data);
    /*
    add code to attach this submissions data to user's account
    */
    res.send(result.status.description);
}

// takes array as input [stdin,stdout,time,memory,srcCode,langID]
const checkAnswer = async(data) => {
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

    options.body['stdin'] = data[0];
    options.body['expected_output'] = data[1];
    options.body['cpu_time_limit'] = Number(data[2]);
    options.body['wall_time_limit'] = options.body['cpu_time_limit'] * 1.5;
    options.body['memory_limit'] = data[3];
    options.body['source_code'] = data[4];
    options.body['language_id'] = data[5];

    const SNTCresponse = await request(options);

    return SNTCresponse;
}


router.post('/',submitSolution);

module.exports = router;
