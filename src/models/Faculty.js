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
    }, {
        associate: function(models) {
            Faculty.hasMany(models.Subject, { as: 'Subjects' });
            Faculty.hasMany(models.Course, { as: 'Courses' });
        }
    });

    return Faculty;
};
