var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var user = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    isAdmin: Boolean
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', user);
