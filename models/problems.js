var mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

var prob = new mongoose.Schema({
    qID: Number,
    name: String,
    isVisible:Boolean,
    description: String,
    inputFormat: String,
    outputFormat: String,
    constraints: String,
    sampleInput: String,
    sampleOutput: String,
    explanation: String,
    difficulty: Number,
    problemSetter: String,
    timeLimit: Double,
    memoryLimit: Number,
    tags: [String],
    editorial: String,
});
var Problems = mongoose.model('Problems', prob);
module.exports = Problems;
