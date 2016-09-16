var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var VisitSchema = mongoose.Schema({
    date: Date,
    dwelltime: Number
})

module.exports = mongoose.model('Visit', VisitSchema);