var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var EvidenceSchema = mongoose.Schema({
    date: Date,
    prospectiveEmployer: String,
    position: String,
    interviewDate: Date,
    outcome: String
})

module.exports = mongoose.model('Evidence', EvidenceSchema);