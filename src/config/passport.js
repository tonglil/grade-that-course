/*
 *Passport config
 */

var auth = require('./auth');

var User = require('../models').User;
var AuthFacebook = require('../models').AuthFacebook;

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.UUID);
  });

  passport.deserializeUser(function(UUID, done) {
    User.find(UUID).success(function(user) {
      if (!user) done('Incorrect user');
      done(null, user);
    });
  });

  passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, function(email, password, done) {
    User.find({
      where: {
        email: email
      }
    }).success(function(user) {
      if (!user) {
        return done('no user', false);
      } else {
        user.verifyPassword(password, function(err, user) {
          if (err) return done(err);
          else return done(null, user);
        });
      }
    }).error(function(err) {
      done(err);
    });
  }));

  passport.use('facebook', new FacebookStrategy({
    clientID        : auth.facebookAuth.clientID,
    clientSecret    : auth.facebookAuth.clientSecret,
    callbackURL     : auth.facebookAuth.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    var query = profile.id;

    AuthFacebook.find({
      where: {
        id: query
      }
    }).success(function(facebook) {
      if (!facebook) {
        AuthFacebook.create({
          id: profile.id,
          token: accessToken,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }).success(function(facebook) {
          doFacebook(facebook);
        }).error(function(err) {
          return done(err);
        });
      } else {
        doFacebook(facebook);
      }
    }).error(function(err) {
      done(err);
    });

    function doFacebook(facebook) {
      console.log('facebook object found');
      console.log(facebook.values);

      if (!facebook.UserId) {
      //fill: function(email, fname, lname, done) {
        User.fill(facebook.email, facebook.firstName, facebook.lastName, function(err, user) {

        });

        //TODO: create local-user!
        console.log('no local user, allow user to create or link a user');
        return done('no user', false);
      } else {
        facebook.getUser(function(user) {
          return done(null, user);
        });
      }
    }



  }));

};
