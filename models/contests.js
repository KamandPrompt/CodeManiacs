var mongoose = require('mongoose');

var contests = new mongoose.Schema({
    code: String,
    name: String,
    date: Date,
    endDate: Date,
    duration: Number,
    visible: Boolean,
    problemsID: [String]
});

var Contests = mongoose.model('Contests', contests);

module.exports = Contests;
