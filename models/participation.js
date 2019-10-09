var mongoose = require('mongoose');

var participation = new mongoose.Schema({
    username: String,
    startTime: Date,
    endTime: Date,
    isVirtual: Boolean,
    isICPC: Boolean,
    contestCode: String,
    submissions: [Number],
    score: Number,
    penalty: Number
});

var Participation = mongoose.model('Participation',participation);
module.export = Participation;

