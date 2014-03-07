/*
 *Defines the model for a subject
 *ex: EECE
 */

module.exports = function(DB, Type) {
  var Subject = DB.define("Subject", {
    code: {
      type: Type.STRING,
      primaryKey: true,
      unique: true
    },
    name: {
      type: Type.STRING
    }
  }, {
    associate: function(models) {
      Subject.hasMany(models.Course, {
        as: 'Courses',
      });
      Subject.belongsTo(models.Faculty, {
        as: 'Faculty'
      });
    },
    classMethods: {
    },
    instanceMethods: {
    }
  });

  return Subject;
};
