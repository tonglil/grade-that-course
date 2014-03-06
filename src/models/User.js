/*
 *Defines the model for a user
 */

var guid = require('node-uuid');

module.exports = function(DB, Type) {
  var User = DB.define('User', {
    UUID: {
      type: Type.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    email: {
      type: Type.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    salt: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    hash: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    firstName: {
      type: Type.STRING
    },
    lastName: {
      type: Type.STRING
    }
  }, {
    associate: function(models) {
      User.hasMany(models.Score, {
        as: 'Scores',
        through: models.UserScores
      });
      User.belongsTo(models.AuthFacebook, {
        as: 'AuthFacebook'
      });
    },
    classMethods: {
      register: function(email, password, done) {
        var hash = require('../controllers/hash');
        var User = this;

        hash(password, function(err, salt, hash) {
          if (err) return done(err);
          User.find({
            where: {
              email: email
            }
          }).success(function(user) {
            if (user) return done('user exists');
            User.create({
              UUID: guid.v4(),
              email: email,
              salt: salt,
              hash: hash
            }).success(function(user) {
              if (!user) return done('no user');
              return done(null, user);
            }).error(function(err) {
              return done(err);
            });
          });
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
