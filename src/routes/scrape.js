/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').logger;
var badge   = require('../controllers/logging').logError;
var config  = require('../config').app;

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
        var result = [];
        subjects.forEach(function(subject, i) {
            //log(subject.values.code);
            result[i] = scrapeSubjectsProcess(subject.values.code);
        });
        //log(result);

        /*
         *for (var i = 0; i < subjects.length; i++) {
         *    process(subjects[i]);
         *    // check for errors in result!
         *    //log('overall subjects scrape error');
         *}
         */
    });

    return res.json(a);
}

var subjectScraper = require('../controllers/SubjectScraper').subjectScraper;

//Processes a single subject
function scrapeSubjectsProcess(code) {
    subjectScraper(code).success(function() {
        log('success!');
        return true;
    }).error(function() {
        log('error sadface');
        return false;
    }).run();
}

function process(subject) {
    test(subject).failure(function() {
        log('it failed (but still worked)!!!!!!!!!');
    }).success(function() {
        log('wow it worked!!!!!!!!!!!!!!!!!!');
    }).run();

    test.call(subject, subject.code).success(function() {
        log('wow it worked!!!!!!!!!!!!!!!!!!');
    }).failure(function() {
        log('it failed (but still worked)!!!!!!!!!');
    }).run();
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
