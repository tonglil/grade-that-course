/*
 *Defines the model for a single class
 *ex: 210
 */

module.exports = function(DB, Type) {
  var Course = DB.define("Course", {
    number: {
      type: Type.STRING,
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
    },
    instanceMethods: {
      getCourseCode: function() {
        return [this.SubjectId, this.number].join(' ');
      }
    }
  });

  return Course;
};
