/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').logger;
var badge   = require('../controllers/logging').logError;
var config  = require('../config').app;

// emitters
var events = require('events');

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

module.exports = function(app) {
    app.get('/scrape', scrapeAll);
    app.get('/scrape/subjects', scrapeSubjects);

    app.get('/scrape/list', scrapeList);
    app.get('/scrape/subject/:subject', scrapeSubject);
    app.get('/scrape/course/:subject/:number', scrapeCourse);
};

//get all course information
function scrapeAll(req, res) {
    a = 'trigger all scrape actions';
    console.log(a);

    // scrape flow: scrape subjects, then scrape courses, then scrape course details.

    Subject.findAll().success(function(subjects) {
        subjects.forEach(function(subject) {
            log(subject.code);

            //Course.


            //var test = ['101', '110'];
            //test.forEach(function(item) {
                //var endpoint = 'http://' + config.url + '/scrape/course/' + subject.code + '/' + item;
                //request(endpoint, function(err, response, body) {
                    //if (err || response.statusCode !== 200) {
                        //log('scrape error');
                        ////return badge(null, err, 'Scrape request error');
                    //}
                //});
            //});
        });
    });

    //return res.json('scrape done!');

    //var a = ScrapeController.getAll();
    //return res.json(a);
    return res.json(a);
}

//get meta data for a given course
function scrapeCourse(req, res) {
    var subject = req.params.subject;
    var number = req.params.number;
    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + subject + '&course=' + number;

    request(target, function(err, response, body) {
        if (err || response.statusCode !== 200) {
            return badge(res, err, 'Error: scrape request');
        }

        var $ = cheerio.load(body);
        $body = $('body');
        $description = $body.find('.content.expand').children('p').slice(0,1).text().trim();
        $credits = $body.find('.content.expand').children('p').slice(1,2).text().trim().slice(-1);
        // number and name?

        if ($description && $credits) {
            var newCourse = Course.build({
                code: subject + number,
                number: number,
                description: $description,
                credits: $credits
            });

            Course.find({
                where: { code: newCourse.code }
            }).success(function(course) {
                if (course) {
                    course.updateAttributes({
                        number: newCourse.number,
                        description: newCourse.description,
                        credits: newCourse.credits
                    }).error(function(err) {
                        badge(null, err, 'Error: course not updated');
                    });
                } else {
                    newCourse.save().error(function(err) {
                        badge(null, err, 'Error: course not saved');
                    });
                }
            }).error(function(err) {
                badge(null, err, 'Error: course not saved/updated');
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

            //TODO no need to render, perhaps send an 'ok' response?
            return res.send(200, $description + '</br>' + $credits);
        } else {
            return res.send(500, 'Error: course not found');
        }
    });
}

// looks for all subjects and calls scrapeSubject on each one.
function scrapeSubjects(req, res) {
    a = 'trigger all subject scrape actions';
    console.log(a);

    Subject.findAll().success(function(subjects) {
        //log(subjects);
        //log(JSON.stringify(subjects));

        for (var i = 0; i < subjects.length; i++) {
            result = doScrapeSubject.call(subjects[i], subjects[i].code);
            // check for errors in result!
            //log('overall subjects scrape error');
        }
    });

    return res.json(a);
}

function doScrapeSubject(subjectName) {
    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + subjectName;
    var result;

    request(target, function(err, response, body) {
        if (err || !response) {
            result.error = err;
            if (response) {
                result.code = response.statusCode;
            }
            return badge('doScrapeSubject request', result);
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

        if (subjectCourses.length === 0) {
            result = {
                code: 404,
                error: 'Subject ' + subjectName + ' has no courses/was not found'
            };
            return badge('doScrapeSubject', result);
        }

        subjectCourses.forEach(function(item) {
            Course.findOrCreate({
                code: subjectName + item.number
            }).success(function(course) {
                course.updateAttributes({
                    number: item.number,
                    name: item.name
                });
                Subject.find({
                    where: { code: subjectName }
                }).success(function(subject) {
                    course.setSubject(subject).error(function(err) {
                        result = {
                            code: 400,
                            error: err
                        };
                        return badge('doScrapeSubject, course subject not set', result)
                    });
                });
            }).error(function(err) {
                badge(null, err, 'Course not found/created');
            });
        });

        return subjectCourses;
    });
}

//get scrape a specific subject's courses
function scrapeSubject(req, res) {
    var a = 'trigger a subject\'s courses scrape actions';
    console.log(a);

    var subjectName = req.params.subject;
    var result = doScrapeSubject(subjectName);

    return res.json(result);
}

//scrapes all subjects and faculties for a given directory
function scrapeList(req, res) {
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

        //TODO no need to render, perhaps send an 'ok' response?
        res.render('listing', {
            title: $('title').text(),
            items: data
        });
    });
}
