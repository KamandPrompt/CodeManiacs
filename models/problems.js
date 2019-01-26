var mongoose = require('mongoose');
var prob = new mongoose.Schema ({
    qID: Integer,
    name: String,
    description: String,
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    sampleInput: String,
    sampleOutput: String,
    explanation: String,
    difficulty: Integer,
    problemSetter: String,
    timeLimit: Integer,
    memoryLimit: Integer,
    tags: String,
    editorial: String,
});
var Problems = mongoose.model('Problems',prob);
module.exports = Problems;