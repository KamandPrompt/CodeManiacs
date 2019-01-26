var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myappdatabase');

var test = new mongoose.Schema ( {
    
    qID: Integer,

    timeLimit: Integer,

    memoryLimit: Integer,

    cases: [{stdin: String, stdout: String}]

});

var Testcases = mongoose.model('Testcases',test);

module.exports = Testcases;
