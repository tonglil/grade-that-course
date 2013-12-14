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
        subject: { type: Type.STRING },
        //can include characters
        number: { type: Type.STRING },
        //canonical name
        name: { type: Type.STRING },
        description: { type: Type.TEXT },
        credits: { type: Type.INTEGER }
    });

    return Course;
};
