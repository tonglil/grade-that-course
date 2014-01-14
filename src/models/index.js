/*
 *Model and database initiation
 */

var Sequelize   = require('sequelize');
var config      = require('../config').database;

var db = new Sequelize(config.name, config.username, config.password, config.options);

var data = {
};

var models = [
    'Faculty',
    'Subject',
    'Course',
    //'Score',
    //'Trainer',
    //'Series',
    //'Video',
    'User'
];

models.forEach(function(model) {
    data[model] = db.import(__dirname + '/' + model);
});

Object.keys(data).forEach(function(modelName) {
    if (data[modelName].options.hasOwnProperty('associate')) {
        data[modelName].options.associate(data);
    }
});

data.Sequelize = Sequelize;
data.db = db;

//data.Trainer.hasMany(data.Series);
//data.Series.belongsTo(data.Trainer);

//data.Series.hasMany(data.Video);
//data.Video.belongsTo(data.Series);

//Define relationships
/*
 *data.Course.hasOne(data.Score, {
 *    as: 'Score'
 *});
 *data.Score.belongsTo(data.Course, {
 *    as: 'Course'
 *});
 */

module.exports = data;
