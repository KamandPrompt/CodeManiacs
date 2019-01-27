var mongoose = require('mongoose');
var prob = new mongoose.Schema({
    totalProblems: Number
});
var total_Problems = mongoose.model('totalProblems', prob);
module.exports = total_Problems;
