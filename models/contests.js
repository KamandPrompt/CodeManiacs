var mongoose = require('mongoose');

var contests = new mongoose.Schema({
    name: String,
    date: Date,
    duration: Number
});

var Contests = mongoose.model('Contests', contests);

module.exports = Contests;
