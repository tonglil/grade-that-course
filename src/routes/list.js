/*
 *Listing endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').logger;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Subject = models.Subject;

module.exports = function(app) {
    app.get('/list/all', listAll);
    app.get('/list/subject/:subject', listSubject);
    //app.get('/list/course/:subject/:number', listCourse);
};

function listAll(req, res) {
    a = 'get list from db';
    console.log(a);

/*
 *    function assignOwner(user, pet) {
 *        var chainer = new Sequelize.Utils.QueryChainer();
 *        chainer.add(pet.setOwner(user));
 *        chainer.add(user.updateAttributes({
 *            numberOfPets: user.numberOfPets + 1
 *        }));
 *
 *        chainer.runSerially().success(function() {
 *            console.log(user.firstName + ' is the owner of ' + pet.name);
 *        }).error(function(err) {
 *            console.log('error:', err);
 *        });
 *    }
 */

    return res.json(a);
}

function listSubject(req, res) {
    var subjectName = req.params.subject;

    Subject.find({
        where: { code: subjectName }
    }).success(function(subject) {
        subject.getCourses().success(function(courses) {
        var courseList = [];
            courses.forEach(function(item) {
                var single = {};
                single.code = item.code;
                single.number = item.number;
                single.name = item.name;
                single.subject = subject.code;
                courseList.push(single);
            });
        return res.json(courseList);
        });
    });
}
