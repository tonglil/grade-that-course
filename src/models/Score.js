/*
 *Defines the model for a single course's scores and ratings
 *ex: 210
 */

module.exports = function(DB, Type) {
    var Score = DB.define("Score", {
        //counters to track votes
        take: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        pass: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        easy: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        hard: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        fun: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        useful: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        prof: {
            type: Type.INTEGER,
            defaultValue: 0
        },
        ta: {
            type: Type.INTEGER,
            defaultValue: 0
        }
    }, {
      associate: function(models) {
        Score.belongsTo(models.Course, {
          as: 'Course'
        });
        Score.hasMany(models.User, {
          as: 'Users',
          through: models.UserScores
        });
      }
    });

    return Score;
};
