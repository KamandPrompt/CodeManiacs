var mongoose = require('mongoose');
var user = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    isAdmin: Boolean
});
var Users = mongoose.model('Users', user);
module.exports = Users;