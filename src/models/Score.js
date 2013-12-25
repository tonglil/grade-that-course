/*
 *Defines the model for a single course's scores and ratings
 *ex: 210
 */

module.exports = function(DB, Type) {
    var Score = DB.define("Score", {
        //counters to track votes
        take: { type: Type.INTEGER },
        pass: { type: Type.INTEGER },
        easy: { type: Type.INTEGER },
        hard: { type: Type.INTEGER },
        fun: { type: Type.INTEGER },
        useful: { type: Type.INTEGER },
        prof: { type: Type.INTEGER },
        ta: { type: Type.INTEGER }
    });

    return Score;
};
