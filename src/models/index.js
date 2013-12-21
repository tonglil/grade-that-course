/*
 *Model and database initiation
 */

var Sequelize   = require('sequelize');
var config      = require('../config').database;

var db = new Sequelize(config.name, config.username, config.password, config.options);

var data = {
    Sequelize: Sequelize,
    db: db
};

var models = [
    'Faculty',
    'Subject',
    'Course',
    'Score',
    'User'
];

models.forEach(function(model) {
    data[model] = db.import(__dirname + '/' + model);
});

//Define relationships

data.Course.hasOne(data.Score, { as: 'Scores' });
data.Score.belongsTo(data.Course, { as: 'Course' });

data.Subject.hasMany(data.Course, { as: 'Courses' });
data.Course.belongsTo(data.Subject, { as: 'Subject' });

data.Faculty.hasMany(data.Subject, { as: 'Subjects' });
data.Subject.belongsTo(data.Faculty, { as: 'Faculty' });

//data.Faculty.sync({force: true});

module.exports = data;
