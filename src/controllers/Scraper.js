/*
 *Scraping controller actions
 */

var cheerio = require('cheerio');
var request = require('request');
var async   = require('async');
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
            // will this become strained? will this need to be changed to find => update/save?
            // do we need to querychain this using a regular for loop, where find or create is run by chainer?
            Course.findOrCreate({
                code: subjectCode + item.number
            }).success(function(course) {
                course.updateAttributes({
                    subject: subjectCode,
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



//Make available via require().CourseScraper
module.exports.CourseScraper = CourseScraper;

//Object to scrape a course's description and credits
//@par: string          subject code
//@par: string          course number
//@par: function        callback function with result
function CourseScraper(subjectCode, courseNumber, callback) {
    var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + subjectCode + '&course=' + courseNumber;
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
        $description = $body.find('.content.expand').children('p').slice(0,1).text().trim();
        //TODO: make sure credits is a number!
        $credits = $body.find('.content.expand').children('p').slice(1,2).text().trim().slice(-1);
        //TODO: this check needs to be fixed

        if (!($description && $credits)) {
            err = {
                error: 'Course ' + subjectCode + courseNumber + ' was not found'
            };
            result.statusCode = 404;
            if (callbackOn) return callback(err, result);
        }

        var newCourse = Course.build({
            code: subjectCode + courseNumber,
            subject: subjectCode,
            number: courseNumber,
            description: $description,
            credits: $credits
        });

        Course.find({
            where: { code: newCourse.code }
        }).success(function(course) {
            if (course) {
                course.updateAttributes({
                    subject: newCourse.subject,
                    number: newCourse.number,
                    description: newCourse.description,
                    credits: newCourse.credits
                }).error(function(err) {
                    result.statusCode = 500;
                    if (callbackOn) return callback(err, result);
                });
            } else {
                newCourse.save().error(function(err) {
                    result.statusCode = 500;
                    if (callbackOn) return callback(err, result);
                });
            }
        }).error(function(err) {
            result.statusCode = 500;
            if (callbackOn) return callback(err, result);
        });

        /*
         *Course.findOrCreate({
         *    code: newCourse.code
         *}, {
         *    number: newCourse.number,
         *    description: newCourse.description,
         *    credits: newCourse.credits
         *}).success(function(course) {
         *    course.updateAttributes({
         *        number: newCourse.number,
         *        description: newCourse.description,
         *        credits: newCourse.credits
         *    }).error(function(err) {
         *        badge(null, err, 'Error: course not updated');
         *    });
         *}).error(function(err) {
         *    badge(null, err, 'Error: course not found/created');
         *});
         */

        result.statusCode = 200;
        if (callbackOn) return callback(null, result);
    });
}














//Make available via require().CourseBulkScraper
module.exports.CourseBulkScraper = CourseBulkScraper;

//Worker object for async to bulk scrape a course's description and credits
//@par: courses         collection of courses to be scraped
//@par: function        callback function with result
function CourseBulkScraper(courses, callback) {
    var queue = async.queue(function(course, callback) {
        var callbackOn = false;

        if (callback && typeof callback == 'function') {
            callbackOn = true;
        }

        if (course.credits && course.description) {
            if (callbackOn) return callback();
        }

        var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + course.subject + '&course=' + course.number;

        request(url, function(err, response, body) {
            if (err || !response || response.statusCode !== 200) {
                if (callbackOn) return callback();
            }

            var $ = cheerio.load(body);
            $body = $('body');
            $description = $body.find('.content.expand').children('p').slice(0,1).text().trim();
            //TODO: make sure credits is a number!
            $credits = $body.find('.content.expand').children('p').slice(1,2).text().trim().slice(-1);
            $na = $body.find('.content.expand').text().trim().indexOf('no longer offered');

            if ($na != -1) {
                log('Course ' + course.code + ' had no data');
                if (callbackOn) return callback();
            }

            course.description = $description;
            course.credits = $credits;
            course.save().success(function() {
                return callback();
            }).error(function(err) {
                return callback(err);
            });
        });
    }, 10);

    function start(courses) {
        courses.forEach(function(course, i) {
            queue.push(course);
        });
    }

    start(courses);

    queue.drain = function() {
        if (queue.length() === 0) {
            callback();
        }
    };
}
