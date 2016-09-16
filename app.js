var express = require('express');
var app = express();
var port = process.env.PORT || 5014;
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
var Visit = require('./models/visit');


// configuration ===============================================================

mongoose.connect(configDB.url); // connect to our database

app.use(express.static(__dirname + '/public'));

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'html');

// required for passport
app.use(session({
    secret: 'ana-insurance-bot',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var bcrypt = require('bcrypt-nodejs');

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.get('/login', function (req, res) {
    res.sendfile('./public/login.html');
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/loginSuccess', // redirect to the secure profile section
    failureRedirect: '/loginFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));


app.get('/visits', function (req, res) {

    var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];



    Account.find({}, function (err, users) {
        var userMap = {};

        var visitlog = [];

        users.forEach(function (user) {

            user.visits.forEach(function (visit) {

                var mins = visit.date.getMinutes();

                if (mins < 10) {
                    mins = '0' + mins;
                }

                var v = {
                    firstname: user.local.first_name,
                    lastname: user.local.last_name,
                    month: monthNames[visit.date.getMonth()],
                    year: visit.date.getFullYear(),
                    day: days[visit.date.getDay()],
                    time: visit.date.getHours() + ':' + mins
                }

                visitlog.push(v);

                console.log(visitlog);
            })
        });

        var outcome = {
            visits: visitlog
        };

        var responseString = JSON.stringify(outcome, null, 3);
        res.send(responseString);

    })
})

app.post('/visit', function (req, res) {

    Account.findOne({
        'local.email': req.body.email
    }, function (err, user) {

        if (err) {
            console.error(err);
        } else {

            console.log('success');

            console.log(user);

            var v = new Visit();
            v.date = Date();

            user.visits.push(v);

            user.save(function (err) {
                if (err) {
                    throw err;
                }
            });
        }
    })

    //  console.log(req.body);
});

app.get('/loginSuccess', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
        username: req.user.local.email,
        firstName: req.user.local.first_name,
        lastName: req.user.local.last_name,
        visits: req.user.visits,
        appointments: req.user.appointments,
        status: req.user.statusHistory,
        evidence: req.user.evidenceHistory,
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

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form

app.get('/signup', function (req, res) {
    res.sendfile('./public/signup.html');
});

// process the signup form
app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/signupSuccess', // redirect to the secure profile section
    failureRedirect: '/signupFailure', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
}));



app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

app.get('/', function (req, res) {
    res.render('index.html');
});

app.listen(port);
console.log('running on port ' + port);