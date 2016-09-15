/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var request = require('request');
var watson = require('watson-developer-cloud');

var configDB = require('./config/database.js');
require('./config/passport')(passport);

var Account = require('./models/account');

mongoose.connect(configDB.url); // connect to our database

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/isLoggedIn', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    var result = {
        outcome: 'failure'
    };

    if (req.isAuthenticated()) {
        result.outcome = 'success';
        result.username = req.user.local.email;
        result.firstName = req.user.local.firstName;
        result.lastName = req.user.local.lastName;
    }

    res.send(JSON.stringify(result, null, 3));
})

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'html');

// required for passport
app.use(session({
    secret: 'job-centre',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess', // redirect to the secure profile section
    failureRedirect: '/loginFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

app.get('/loginSuccess', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        username: req.user.local.email,
        firstName: req.user.local.first_name,
        lastName: req.user.local.last_name,
        outcome: 'success'
    }, null, 3));
})

app.get('/loginFailure', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        outcome: 'failure'
    }, null, 3));
})

app.get('/signupSuccess', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        username: req.user.local.email,
        firstName: req.user.local.first_name,
        lastName: req.user.local.last_name,
        outcome: 'success'
    }, null, 3));
})

app.get('/signupFailure', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        outcome: 'failure'
    }, null, 3));
})

app.get('/signup', function (req, res) {
    res.sendfile('./public/signup.html');
});

app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signupSuccess', // redirect to the secure profile section
    failureRedirect: '/signupFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function () {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});