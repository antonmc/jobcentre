// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Status = require('../models/status');
var Visit = require('../models/visit');
var Evidence = require('../models/evidence');
var Appointment = require('../models/appointment');

var accountSchema = mongoose.Schema({

    local: {
        email: String,
        password: String,
        first_name: String,
        last_name: String
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    statusHistory: [Status.schema],
    evidenceHistory: [Evidence.schema],
    appointments: [Appointment.schema],
    visits: [Visit.schema]
});

// methods ======================
// generating a hash
accountSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Account', accountSchema);