/*
 *App
 */

var express = require('express');
var http = require('http');
var async = require('async');

var app = express();

//Set up application
require('./config/environment')(app);
require('./routes')(app);

var models = require('./models');

//Set up users
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = models.User;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    User.find({
        where: {
            email: email
        }
    }).success(function(user) {
        if (!user) {
            //return done('incorrect email', false);
            return done(null, false);
        } else {
            user.verifyPassword(password, function(err, user) {
                if (err) return done(err);
                else return done(null, user);
            });
        }
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.UUID);
});

passport.deserializeUser(function(UUID, done) {
    User.find(UUID).success(function(user) {
        if (!user) done('Incorrect user');
        done(null, user);
    });
});

//Do db checks
var fn = [];

fn.push(
  function(callback) {
  models.db.query('SET FOREIGN_KEY_CHECKS = 0').complete(callback);
});

fn.push(
  function(callback) {
  models.db.sync({
    //force: true
  }).complete(callback);
});

fn.push(
  function(callback) {
  models.db.query('SET FOREIGN_KEY_CHECKS = 1').complete(callback);
});

//Start the server
async.series(fn, function(err) {
  if (err) {
    console.log(err);
  } else {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
});
