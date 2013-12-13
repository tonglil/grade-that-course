/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').log;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

//Make available via require().SubjectScraper
module.exports.SubjectScraper = SubjectScraper;

//Object to scrape a subject's courses
//@par: string          subject code
//@par: function        callback function with result
function SubjectScraper(subjectCode, callback) {
    var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + subjectCode;
    var result = {
        callee: arguments.callee.name,
        url: url
    };

    if (callback && typeof callback == 'function') {
        var callbackOn = true;
    }

    request(url, function(err, response, body) {
        if (err || !response || response.statusCode !== 200) {
            if (response) {
                result.statusCode = response.statusCode;
            }
            if (callbackOn) return callback(err, result);
        }

        var $ = cheerio.load(body);
        $body = $('body');
        $mainTable = $body.find('#mainTable');
        $courseTable = $mainTable.find("tr[class^='section']");

        var courses = [];
        $courseTable.each(function(i, item) {
            var course = {};
            var regex = /[0-9].*/;
            course.number = $(item).children('td:nth-of-type(1)').text().trim().match(regex)[0];
            course.name = $(item).children('td:nth-of-type(2)').text().trim();
            courses.push(course);
        });

        if (courses.length === 0) {
            err = {
                error: 'Subject ' + subjectCode + ' has no courses/was not found'
            };
            result.statusCode = 404;
            if (callbackOn) return callback(err, result);
        }

        courses.forEach(function(item) {
            // TODO: can we move creating/updating course to a function in the model?
            Course.findOrCreate({
                code: subjectCode + item.number
            }).success(function(course) {
                course.updateAttributes({
                    number: item.number,
                    name: item.name
                });

                Subject.find({
                    where: { code: subjectCode }
                }).success(function(subject) {
                    course.setSubject(subject).error(function(err) {
                        result.statusCode = 500;
                        if (callbackOn) return callback(err, result);
                    });
                }).error(function(err) {
                    result.statusCode = 500;
                    if (callbackOn) return callback(err, result);
                });
            }).error(function(err) {
                result.statusCode = 500;
                if (callbackOn) return callback(err, result);
            });
        });

        result.statusCode = 200;
        if (callbackOn) return callback(null, result);
    });
}


//Make available via require().ListScraper
module.exports.ListScraper = ListScraper;

//Object to scrape a list's subjects and faculties
//@par: function        callback function with result
function ListScraper(callback) {
    var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea';
    var result = {
        callee: arguments.callee.name,
        url: url
    };

    if (callback && typeof callback == 'function') {
        var callbackOn = true;
    }

    request(url, function(err, response, body) {
        if (err || !response || response.statusCode !== 200) {
            if (response) {
                result.statusCode = response.statusCode;
            }
            if (callbackOn) return callback(err, result);
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
                result.statusCode = 500;
                if (callbackOn) return callback(err, result);
            });
        });

        data.forEach(function(item) {
            // TODO: can we move creating/updating course to a function in the model?
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
                        result.statusCode = 500;
                        if (callbackOn) return callback(err, result);
                    });
                }).error(function(err) {
                    result.statusCode = 500;
                    if (callbackOn) return callback(err, result);
                });
            }).error(function(err) {
                result.statusCode = 500;
                if (callbackOn) return callback(err, result);
            });
        });

        result.statusCode = 200;
        if (callbackOn) return callback(null, result);
    });
}
