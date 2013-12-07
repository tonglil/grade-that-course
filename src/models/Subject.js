/*
*Defines the model for a subject
*ex: EECE
*/

module.exports = function(DB, Type) {
    var Subject = DB.define("Subject", {
        //subject
        code: {
            type: Type.STRING,
            unique: true
        },
        //canonical name
        name: { type: Type.STRING }
    });

    return Subject;
};
