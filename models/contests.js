var mongoose = require('mongoose');

var contests = new mongoose.Schema({
  code: String,
  name: String,
  date: Date,
  endDate: Date,
  duration: Number,
  visible: Boolean,
  problemsID: [String],
  problems:[{type: mongoose.Schema.ObjectId, ref: "Problems"}]
});

var Contests = mongoose.model('Contests', contests);

module.exports = Contests;
