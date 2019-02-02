var mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

var test = new mongoose.Schema({
    qID: Number,
    timeLimit: Double,
    memoryLimit: Number,
    cases: [{ stdin: String, stdout: String }]
});

var Testcases = mongoose.model('Testcases', test);
module.exports = Testcases;
