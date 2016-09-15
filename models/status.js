var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var StatusSchema = mongoose.Schema({
    date: Date,
    state: String
})

module.exports = mongoose.model('Status', StatusSchema);