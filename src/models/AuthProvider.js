/*
 *Defines the model for an authorization provider (Facebook, Twitter, Google, etc)
 */

module.exports = function(DB, Type) {
  var AuthProvider = DB.define('AuthProvider', {
    provider: {
      type: Type.STRING,
      primaryKey: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    id: {
      type: Type.STRING,
      primaryKey: true,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    token: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    email: {
      type: Type.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        notEmpty: true,
        isEmail: true
      }
    },
    firstName: {
      type: Type.STRING
    },
    lastName: {
      type: Type.STRING
    },
    UserId: {
      type: Type.STRING,
      references: 'Users',
      referencesKey: 'uuid'
    }
  }, {
    associate: function(models) {
      AuthProvider.belongsTo(models.User, {
        as: 'User',
      });
    },
    classMethods: {
    },
    instanceMethods: {
    }
  });

  return AuthProvider;
};
