/*
 *Defines the model to track a user's votes for a course
 */

module.exports = function(DB, Type) {
  var UserScores = DB.define('UserScores', {
    take: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    pass: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    easy: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    hard: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    fun: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    useful: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    prof: {
      type: Type.BOOLEAN,
      defaultValue: false
    },
    ta: {
      type: Type.BOOLEAN,
      defaultValue: false
    }
  });

  return UserScores;
};
