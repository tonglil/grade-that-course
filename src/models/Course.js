/*
 *Defines the model for a single class
 *ex: 210
 */

module.exports = function(DB, Type) {
  var Course = DB.define("Course", {
    number: {
      type: Type.STRING,
      primaryKey: true
    },
    name: {
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
        primaryKey: true,
        references: 'Subjects',
        referencesKey: 'code'
    },
  }, {
    associate: function(models) {
      Course.belongsTo(models.Subject, {
        as: 'Subject'
      });
      Course.belongsTo(models.Faculty, {
        as: 'Faculty'
      });
      Course.hasOne(models.Score, {
        as: 'Score'
      });
    },
    classMethods: {
      findCourses: function(Subject, subject, number, callback) {
        this.findAll({
          where: {
            number: {
              like: number + '%'
            }
          },
          order: 'number ASC',
          include: [{
            model: Subject,
            where: {
              code: {
                like: '%' + subject + '%'
              }
            },
            order: 'code ASC'
          }],
          limit: 10,
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
      }
    }
  });

  return Course;
};
