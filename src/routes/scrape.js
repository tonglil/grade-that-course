/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var url     = require('url');
var log     = require('../controllers/logging').logger;
var badge   = require('../controllers/logging').logError;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

module.exports = function(app) {
    //app.get('/scrape', all);
    //app.get('/scrape/:type', scrapeType);
    app.get('/scrape/list', getList);
    app.get('/scrape/subject/:subject', getSubject);
    app.get('/scrape/course/:subject/:number', getCourse);
};

//get meta data for a given course
function getCourse(req, res) {
    var subject = req.params.subject;
    var number = req.params.number;
    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + subject + '&course=' + number;

    request(target, function(err, response, body) {
        if (err || response.statusCode !== 200) {
            return badge(res, err, 'Scrape request error');
        }

        var $ = cheerio.load(body);
        $body = $('body');
        $description = $body.find('.content.expand').children('p').slice(0,1).text().trim();
        $credits = $body.find('.content.expand').children('p').slice(1,2).text().trim().slice(-1);

        Course.findOrCreate({
            code: subject + number
        }).success(function(course) {
            course.updateAttributes({
                description: $description,
                credits: $credits
            });
        }).error(function(err) {
            badge(null, err, 'Course not found/created');
        });

        //no need to render, perhaps send an 'ok' response?
        return res.send(200, $description + $credits);
    });
}

//get all courses for a given subject
function getSubject(req, res) {
    var subjectName = req.params.subject;

    Subject.find({
        where: { code: subjectName }
    }).success(function(subject) {
        var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + subject.code;

        request(target, function(err, response, body) {
            if (err || response.statusCode !== 200) {
                return badge(res, err, 'Scrape request error');
            }

            var $ = cheerio.load(body);
            $body = $('body');
            $mainTable = $body.find('#mainTable');
            $courseTable = $mainTable.find("tr[class^='section']");

            var subjectCourses = [];
            $courseTable.each(function(i, item) {
                var course = {};
                var regex = /[0-9].*/;
                course.number = $(item).children('td:nth-of-type(1)').text().trim().match(regex)[0];
                course.name = $(item).children('td:nth-of-type(2)').text().trim();
                subjectCourses.push(course);
            });

            subjectCourses.forEach(function(item) {
                Course.findOrCreate({
                    code: subject.code + item.number
                }).success(function(course) {
                    course.updateAttributes({
                        number: item.number,
                        name: item.name
                    });
                    course.setSubject(subject).error(function(err) {
                        badge(null, err, 'Course subject not set');
                    });
                }).error(function(err) {
                    badge(null, err, 'Course not found/created');
                });
            });

            //no need to render, perhaps send an 'ok' response?
            res.render('listing', {
                title: $('title').text(),
                items: subjectCourses
            });
        });
    });
}

//get all courses for a given directory
function getList(req, res) {
    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea';

    request(target, function(err, response, body) {
        if (err || response.statusCode !== 200) {
            return badge(res, err, 'Scrape request error');
        }

        var $ = cheerio.load(body);
        $body = $('body');
        $mainTable = $body.find('#mainTable');
        $courseTable = $mainTable.find("tr[class^='section']");

        var data = [];
        $courseTable.each(function(i, item) {
            var list = {};
            list.code = $(item).children('td:nth-of-type(1)').text().replace('*', '').trim();
            list.subject = $(item).children('td:nth-of-type(2)').text().trim();
            list.faculty = $(item).children('td:nth-of-type(3)').text().trim();
            data.push(list);
        });

        var faculties = Sequelize.Utils._.chain(data).map(function(item) {
            return item.faculty;
        }).uniq().value();

        faculties.forEach(function(item) {
            Faculty.findOrCreate({
                name: item
            }).error(function(err) {
                badge(null, err, 'Faculty not found/created');
            });
        });

        data.forEach(function(item) {
            Subject.findOrCreate({
                code: item.code
            }).success(function(subject) {
                subject.updateAttributes({
                    name: item.subject
                });
                Faculty.find({
                    where: { name: item.faculty }
                }).success(function(faculty) {
                    subject.setFaculty(faculty).error(function(err) {
                        badge(null, err, 'Subject faculty not set');
                    });
                }).error(function(err) {
                    badge(null, err, 'Subject\'s faculty not found');
                });
            }).error(function(err) {
                badge(null, err, 'Subject not found/created');
            });
        });

        res.render('listing', {
            title: $('title').text(),
            items: data
        });
    });
}


















function all(req, res) {
    a = 'trigger all scrape actions';
    console.log(a);
    return res.json(a);
}
