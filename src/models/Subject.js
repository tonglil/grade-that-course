/*
*Defines the model for a subject
*ex: EECE
*/

module.exports = function(DB, Type) {
    var Subject = DB.define("Subject", {
        code: {
            //subject
            type: Type.STRING,
            unique: true,
            primaryKey: true,
        },
        name: {
            //canonical name
            type: Type.STRING
        }
    }, {
        associate: function(models) {
            Subject.hasMany(models.Course, { as: 'Courses' });
            Subject.belongsTo(models.Faculty, { as: 'Faculty' });
        },
        classMethods: {
            getCourses: function(subject, callback) {
                var search = {};
                if (subject) search.code = subject;

                this.find({
                    where: search
                }).success(function(subject) {
                    if (subject) {
                        subject.getCourses().success(function(courses) {
                            return callback(null, courses);
                        }).error(function(err) {
                            return callback(err);
                        });
                    } else {
                        return callback('subject not found');
                    }
                }).error(function(err) {
                    return callback(err);
                });
            }
        },
        instanceMethods: {
            clean: function() {
                var subject = this.values;
                delete subject.createdAt;
                delete subject.updatedAt;
                return subject;
            }
        }
    });

    return Subject;
};
