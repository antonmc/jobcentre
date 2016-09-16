var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var StatusSchema = mongoose.Schema({
    date: Date,
    state: String // EMPLOYED, UNEMPLOYED, DISMISSED, SICK
})

module.exports = mongoose.model('Status', StatusSchema);