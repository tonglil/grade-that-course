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

  passport.use(new FacebookStrategy({
    clientID        : auth.facebookAuth.clientID,
    clientSecret    : auth.facebookAuth.clientSecret,
    callbackURL     : auth.facebookAuth.callbackURL
  }, function(accessToken, refreshToken, profile, done) {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);

    AuthFacebook.find({
      where: {
        id: profile.id
      }
    }).success(function(facebook) {
      if (!facebook) {
        return done(null, false);
        //TODO: create a fb-user?
        //return done('no facebook user', false);
      } else {
        console.log(facebook.values);
        facebook.getUser(function(user) {
          if (!user) {
            //TODO: create local-user!
            console.log('we should create a user or link a user');
            return done('no user', false);
          } else {
            return done(null, user);
          }
        });
      }
    }).error(function(err) {
      done(err);
    });




/*
 *    // find the user in the database based on their facebook id
 *    User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
 *      // if the user is found, then log them in
 *      // if there is no user found with that facebook id, create them
 *      var newUser            = new User();
 *
 *      // set all of the facebook information in our user model
 *      newUser.facebook.id    = profile.id; // set the users facebook id
 *      newUser.facebook.accessToken = accessToken; // we will save the accessToken that facebook provides to the user
 *      newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
 *      newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
 *
 *      // save our user to the database
 *      newUser.save(function(err) {
 *        if (err) throw err;
 *        // if successful, return the new user
 *        return done(null, newUser);
 *      });
 *    });
 */
  }));

};
