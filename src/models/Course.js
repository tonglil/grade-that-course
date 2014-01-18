/*
 *Defines the model for a single class
 *ex: 210
 */

module.exports = function(DB, Type) {
    var Course = DB.define("Course", {
        number: {
            //can include characters
            type: Type.STRING
        },
        name: {
            //canonical name
            type: Type.STRING
        },
        description: {
            type: Type.TEXT
        },
        credits: {
            type: Type.INTEGER
        },
        SubjectId: {
            type: Type.STRING,
            references: 'Subject',
            referencesKey: 'code'
        },
        //FacultyId: {
            //type: Type.STRING,
            //references: 'Faculty',
            //referencesKey: 'shortName'
        //}
    }, {
        associate: function(models) {
            Course.belongsTo(models.Subject, {
                as: 'Subject'
                //foreignKeyConstraint: true,
                //foreignKey: 'code'
            });
            Course.belongsTo(models.Faculty, {
                as: 'Faculty'
            });
        },
        classMethods: {
            getCourse: function(subject, number, callback) {
                var search = {};
                if (subject) search.SubjectId = subject;
                if (number) search.number = number;

                this.find({
                    where: search
                }).success(function(course) {
                    if (course) return callback(null, course);
                    return callback('no course found');
                }).error(function(err) {
                    return callback(err);
                });
            },
            getCourses: function(subject, number, callback) {
                var search = {};
                if (subject) search.SubjectId = subject;
                if (number) search.number = number;

                this.findAll({
                    where: search
                }).success(function(courses) {
                    return callback(null, courses);
                }).error(function(err) {
                    return callback(err);
                });
            },
            findCourses: function(subject, number, callback) {
                this.findAll({
                    where: ['number LIKE \'' + number + '%\' and SubjectId LIKE \'%' + subject + '%\''],
                    limit: 10,
                    order: 'SubjectId ASC, number ASC'
                }).success(function(courses) {
                    return callback(null, courses);
                }).error(function(err) {
                    return callback(err);
                });
            }
        },
        instanceMethods: {
            getCourseCode: function() {
                return [this.SubjectId, this.number].join(' ');
            },
            clean: function() {
                var course = this.values;
                delete course.createdAt;
                delete course.updatedAt;
                return course;
            }
            //getSubjectName: function(callback) {
                //this.getSubject().success(function(subject) {
                    //return callback(subject.name);
                //});
            //},
        }

    });

    return Course;
};
