/*
*Defines the model for a faculty
*ex: Applied Science
*/

module.exports = function(DB, Type) {
    var Faculty = DB.define("Faculty", {
        //canonical name
        name: {
            type: Type.STRING,
            unique: true
        },
        shortName: {
            type: Type.STRING,
            unique: true
        }
    });

    return Faculty;
};
