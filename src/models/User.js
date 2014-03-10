/*
 *Defines the model for a user
 */

var guid = require('node-uuid');

module.exports = function(DB, Type) {
  var User = DB.define('User', {
    uuid: {
      type: Type.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    email: {
      type: Type.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true
      }
    },
    salt: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    hash: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        notEmpty: true
      }
    },
    passwordSet: {
      type: Type.BOOLEAN,
      defaultValue: false,
      //allowNull: false,
      validate: {
        //notNull: true,
      }
    },
    firstName: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    lastName: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    }
  }, {
    associate: function(models) {
      User.hasMany(models.Score, {
        as: 'Scores',
        through: models.UserScores
      });
      User.hasMany(models.AuthProvider, {
        as: 'AuthProviders'
      });
    },
    classMethods: {
      register: function(email, password, fname, lname, done) {
        var hash = require('../controllers/hash');
        var User = this;

        hash(password, function(err, salt, hash) {
          if (err) return done(err);
          User.find({
            where: {
              email: email
            }
          }).success(function(user) {
            if (user) return done('user already exists');
            User.create({
              uuid: guid.v4(),
              email: email,
              salt: salt,
              hash: hash,
              passwordSet: true,
              firstName: fname,
              lastName: lname
            }).success(function(user) {
              if (!user) return done('no user');
              return done(null, user);
            }).error(function(err) {
              return done(err);
            });
          }).error(function(err) {
            return done(err);
          });
        });
      },
      fill: function(provider, done) {
        var User = this;

        User.find({
          where: {
            email: provider.email
          }
        }).success(function(user) {
          if (user) {
            return done(null, user);
          } else {
            User.create({
              uuid: guid.v4(),
              email: provider.email,
              passwordSet: false,
              firstName: provider.firstName,
              lastName: provider.lastName
            }).success(function(user) {
              if (!user) return done('no user');
              else {
                return done(null, user);
              }
            }).error(function(err) {
              return done(err);
            });
          }
        }).error(function(err) {
          return done(err);
        });
      }
    },
    instanceMethods: {
      verifyPassword: function(password, done) {
        var hash = require('../controllers/hash');
        var user = this;

        hash(password, user.salt, function(err, hash) {
          if (err) return done(err);
          if (hash.toString('base64') == user.hash) return done(null, user);
          return done('incorrect password', null);
        });
      }
    }
  });

  return User;
};
