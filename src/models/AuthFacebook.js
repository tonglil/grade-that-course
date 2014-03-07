/*
 *Defines the model for a Facebook connection
 */

module.exports = function(DB, Type) {
  var AuthFacebook = DB.define('AuthFacebook', {
    id: {
      type: Type.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    token: {
      type: Type.STRING,
      allowNull: false,
    },
    email: {
      type: Type.STRING,
      allowNull: true,
      validate: {
        isEmail: true
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
      AuthFacebook.belongsTo(models.User, {
        as: 'User',
      });
    },
    classMethods: {
/*
 *      register: function(email, password, done) {
 *        var hash = require('../controllers/hash');
 *        var User = this;
 *
 *        if (!password) return done('no password');
 *
 *        hash(password, function(err, salt, hash) {
 *          if (err) return done(err);
 *          User.find({
 *            email: email
 *          }).success(function(user) {
 *            if (user) return done('user exists');
 *            User.create({
 *              UUID: guid.v4(),
 *              email: email,
 *              salt: salt,
 *              hash: hash
 *            }).success(function(user) {
 *              if (!user) return done('no user');
 *              return done(null, user);
 *            }).error(function(err) {
 *              return done(err);
 *            });
 *          });
 *        });
 *      }
 */
    },
    instanceMethods: {
/*
 *      verifyPassword: function(password, done) {
 *        var hash = require('../controllers/hash');
 *        var user = this;
 *
 *        hash(password, user.salt, function(err, hash) {
 *          if (err) return done(err);
 *          if (hash.toString('base64') == user.hash) return done(null, user);
 *          return done('incorrect password', false);
 *        });
 *      }
 */
    }
  });

  return AuthFacebook;
};
