/*
 *Defines the model for a user
 */

module.exports = function(DB, Type) {
    var User = DB.define('User', {
        UUID: {
            type: Type.STRING,
            allowNull: false,
            unique: true,
            primaryKey: true,
            validate: {
                isUUID: 4,
            }
        },
        username: {
            type: Type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        password: {
            type: Type.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        email: {
            type: Type.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                notEmpty: true
            }
        },
        firstName: { type: Type.STRING },
        lastName: { type: Type.STRING }
    });

    return User;
};
