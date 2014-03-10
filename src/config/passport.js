/*
 *Passport config
 */

var auth = require('./auth');

var User = require('../models').User;
var AuthProvider = require('../models').AuthProvider;

var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.uuid);
  });

  passport.deserializeUser(function(uuid, done) {
    User.find(uuid).success(function(user) {
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
        if (!user.passwordSet) return done('no password', false);
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
    AuthProvider.find({
      where: {
        provider: 'facebook',
        id: profile.id
      }
    }).success(function(facebook) {
      if (!facebook) {
        AuthProvider.create({
          provider: 'facebook',
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
      if (!facebook.UserId) {
        User.fill(facebook, function(err, user) {
          if (err) return done(err);

          facebook.setUser(user).success(function() {
            return done(null, user);
          });
        });
      } else {
        facebook.getUser().success(function(user) {
          return done(null, user);
        });
      }
    }
  }));

  passport.use('google', new GoogleStrategy({
    clientID        : auth.googleAuth.clientID,
    clientSecret    : auth.googleAuth.clientSecret,
    callbackURL     : auth.googleAuth.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    AuthProvider.find({
      where: {
        provider: 'google',
        id: profile.id
      }
    }).success(function(google) {
      if (!google) {
        AuthProvider.create({
          provider: 'google',
          id: profile.id,
          token: accessToken,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        }).success(function(google) {
          doGoogle(google);
        }).error(function(err) {
          return done(err);
        });
      } else {
        doGoogle(google);
      }
    }).error(function(err) {
      done(err);
    });

    function doGoogle(google) {
      if (!google.UserId) {
        User.fill(google, function(err, user) {
          if (err) return done(err);

          google.setUser(user).success(function() {
            return done(null, user);
          });
        });
      } else {
        google.getUser().success(function(user) {
          return done(null, user);
        });
      }
    }
  }));
};
