var mongoose = require('mongoose');
var Submission = new mongoose.Schema({
    username: String,
    qID: Number,
    subID: Number,
    code: String,
    language: String,
    verdict: String,
    time: Number,
    memory: Number,
    isVisible: Boolean,
    timeStamp: Date,
    tc: [{ status: String, time: Number, memory: Number }]
});
var submission = mongoose.model('submission', Submission);
module.exports = submission;