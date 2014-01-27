//https://github.com/visionmedia/node-pwd

var crypto = require('crypto');

//Bytesize
var len = 128;

//Iterations ~300ms
var iterations = 12000;

/**
 * Hashes a password with optional `salt`, otherwise
 * generate a salt for `pass` and invoke `next(err, salt, hash)`.
 *
 * @param {String} password to hash
 * @param {String} optional salt
 * @param {Function} callback
 */

module.exports = function(pwd, salt, next) {
  if (3 == arguments.length) {
    crypto.pbkdf2(pwd, salt, iterations, len, next);
  } else {
    next = salt;
    crypto.randomBytes(len, function(err, salt) {
      if (err) return next(err);
      salt = salt.toString('base64');
      crypto.pbkdf2(pwd, salt, iterations, len, function(err, hash) {
        if (err) return next(err);
        next(null, salt, hash.toString('base64'));
      });
    });
  }
};
