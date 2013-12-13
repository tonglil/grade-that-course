/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').log;
var logv    = require('../controllers/logging').logVerbose;

var badge   = require('../controllers/logging').logError;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

module.exports = function(app) {
    app.get('/scrape', scrapeAll);
    app.get('/scrape/list', scrapeList);
    app.get('/scrape/subjects', scrapeSubjects);
    app.get('/scrape/subject/:subject', scrapeSubject);

    app.get('/scrape/course/:subject/:number', scrapeCourse);
};

//get all course information
function scrapeAll(req, res) {
    a = 'trigger all scrape actions';
    console.log(a);

    // scrape flow: scrape subjects, then scrape courses, then scrape course details.
    // might have to use async

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

















var Scraper = require('../controllers/Scraper');

//Looks for all subjects and scrapes each one
function scrapeSubjects(req, res) {
    var response = {};
    response.message = 'Scraping all subjects';
    logv(response);

    var SubjectScraper = Scraper.SubjectScraper;

    Subject.findAll().success(function(subjects) {
        subjects.forEach(function(subject, i) {
            SubjectScraper(subject.values.code, function(err, result) {
                log(err);
                logv(result);
            });
        });

        return res.json(message);
    }).error(function(err) {
        log(err);
        return res.json(400, message);
    });
}


//Scrapes a specific subject's courses
//@par: subject     subject code
function scrapeSubject(req, res) {
    var code = req.params.subject;
    var response = {};
    response.message = 'Scrapping ' + code + '\'s courses';
    logv(response);

    var SubjectScraper = Scraper.SubjectScraper;

    SubjectScraper(code, function(err, result) {
        log(err);
        logv(result);

        return res.json(response);
    });
}

//Scrapes a specific directory's subjects and faculties
function scrapeList(req, res) {
    var response = {};
    response.message = 'Scrapping the directory';
    logv(response);

    var ListScraper = Scraper.ListScraper;

    ListScraper(function(err, result) {
        log(err);
        logv(result);

        return res.json(response);
    });
}
