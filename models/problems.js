var mongoose = require('mongoose');
var prob = new mongoose.Schema({
    qID: Number,
    name: String,
    description: String,
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    sampleInput: String,
    sampleOutput: String,
    explanation: String,
    difficulty: Number,
    problemSetter: String,
    timeLimit: Number,
    memoryLimit: Number,
    tags: String,
    editorial: String,
});
var Problems = mongoose.model('Problems', prob);
module.exports = Problems;
