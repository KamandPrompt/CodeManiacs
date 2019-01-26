var mongoose = require('mongoose');
var test = new mongoose.Schema({
    qID: Number,
    timeLimit: Number,
    memoryLimit: Number,
    cases: [{ stdin: String, stdout: String }]
});
var Testcases = mongoose.model('Testcases', test);
module.exports = Testcases;
