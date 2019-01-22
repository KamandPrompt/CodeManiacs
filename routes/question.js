const express = require('express');
const router = express.Router();
const dbRef = require('../private/fire').dbRef;

const submitQuestion = async function (req, res, next) {

    //get reference of questions
    const qRef = dbRef.ref('questions');
    const tRef = dbRef.ref('testcases');
    // claculate current prob_no
    let ProbNum = await qRef.child('Total').once('value');
    ProbNum = parseInt(ProbNum.val()) + 1;

    // submit the question
    await qRef.child('Total').set(ProbNum);
    await qRef.child(ProbNum).set(req.body.ques);
    //submit the testcases
    await tRef.child(ProbNum).set(req.body.testcases);

    res.status(201).send('Submitted');
};


router.get('/all', (req, res, next) => {
    res.render('problemset');
})
router.get('/display', (req, res) => {
    res.render('question');
})
router.get('/submit', (req, res) => {
    res.render('Submit');
})
router.post("/submit", submitQuestion);

module.exports = router;
