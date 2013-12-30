/*
 *Defines the model for a single class
 *ex: 210
 */

module.exports = function(DB, Type) {
    var Course = DB.define("Course", {
        //subject + number
        code: {
            type: Type.STRING,
            unique: true
        },
        //TODO: this should be an association? (plus faculty association?)
        //subject: { type: Type.STRING },
        //can include characters
        number: { type: Type.STRING },
        //canonical name
        name: { type: Type.STRING },
        description: { type: Type.TEXT },
        credits: { type: Type.INTEGER },
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
    });

    return Course;
};
