var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var AppointmentSchema = mongoose.Schema({
    date: Date,
    prospectiveEmployer: String,
    position: String,
    interviewer: String
})

module.exports = mongoose.model('Appointment', AppointmentSchema);