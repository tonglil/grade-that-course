/*
 *Defines the model for a single class
 *ex: 210
 */

var Sequelize = require('sequelize');

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
        subject: {
            type: Type.STRING,
            //references: 'Subject',
            //referencesKey: 'code'
        }
    }, {
        associate: function(models) {
            Course.belongsTo(models.Subject, {
                as: 'Subject'
                //foreignKeyConstraint: true,
                //foreignKey: 'code'
            });
            Course.belongsTo(models.Faculty, { as: 'Faculty' });
        },
        classMethods: {
            getCourse: function(Subject, subjectCode, courseNumber, callback) {
                //var subjectRegex = /[A-Z]+/;
                //var numberRegex = /[0-9]+/;
                //var subjectCode = courseCode.toUpperCase().match(subjectRegex)[0];
                //var courseNumber = courseCode.match(numberRegex)[0];

                var callbackOn = false;

                if (callback && typeof callback == 'function') {
                    callbackOn = true;
                }

                this.findAll({
                    where: { number: courseNumber },
                    include: [{
                        model: Subject,
                        as: 'Subject'
                    }]
                }).success(function(courses) {
                    var course = Sequelize.Utils._.find(courses, function(chr) {
                        return chr.subject.code == subjectCode;
                    });

                    if (course) {
                        if (callbackOn) return callback(null, course);
                    } else {
                        if (callbackOn) return callback('course not found');
                    }
                });
            }
        },
        instanceMethods: {
            getCourseCode: function() {
                return [this.subject.code, this.number].join('');
            },
            getSubjectInfo: function() {
                return this.subject;
            },
            getSubjectCode: function() {
                return this.subject.code;
            },
            getFacultyName: function() {
                //return this.faculty.name;
                //this.subject.getFaculty().success(function(faculty) {
                    //console.log(faculty.values);
                    //return faculty.values;
                //});
            }
        }

    });

    return Course;
};
