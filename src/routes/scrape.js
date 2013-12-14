/*
 *Scraping endpoints
 */

var log     = require('../controllers/logging').log;
var logv    = require('../controllers/logging').logVerbose;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

module.exports = function(app) {
    //app.get('/scrape', scrapeAll);
    app.get('/scrape/list', scrapeList);
    app.get('/scrape/subjects', scrapeSubjects);
    app.get('/scrape/subject/:subject', scrapeSubject);
    app.get('/scrape/courses', scrapeCourses);
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
        });
    });

    //return res.json('scrape done!');

    //var a = ScrapeController.getAll();
    //return res.json(a);
    return res.json(a);
}



























var Scraper = require('../controllers/Scraper');

//Scrapes a specific course's information
//@par: subject     subject code
//@par: number      course number
function scrapeCourse(req, res) {
    var code = req.params.subject;
    var number = req.params.number;
    var response = {};
    response.message = 'Scrapping ' + code + number + '\'s details';
    logv(response);

    var CourseScraper = Scraper.CourseScraper;

    CourseScraper(code, number, function(err, result) {
        log(err);
        logv(result);

        return res.json(response);
    });
}




//Scrapes all courses in a subject's information
function scrapeCoursesback(req, res) {
    var response = {};
    response.message = 'Scraping all courses\' information';
    logv(response);

    var CourseScraper = Scraper.CourseScraper;
    var CourseBulkScraper = Scraper.CourseBulkScraper;
    var async = require('async');

    /*
     *Subject.findAll({
     *    include: [Course]
     *}).success(function(subjects) {
     *    var queue = async.queue(CourseBulkScraper, 5);
     *    for (var i = 0; i < subjects.length; i++) {
     *        for (var j = 0; j < subjects[i].courses.length; j++) {
     *            queue.push(subjects[i].courses[j]);
     *        }
     *    }
     *    log('yes, done pushing');
     *    queue.drain = function() {
     *        log("DONE!!!!!");
     *    };
     *});
     */

    /*
     *Subject.findAll().success(function(subjects) {
     *    for (var i = 0; i < subjects.length; i++) {
     *        subject = subjects[i];
     *        Course.findAll({
     *            //where: { subject: subject }
     *        //}).success(function(courses) {
     *            //var queue = async.queue(CourseBulkScraper, 5);
     *            //for (var j = 0; j < courses.length; j++) {
     *                //var course = courses[j];
     *                //if (!course.credits || !course.description) {
     *                    //queue.push(course);
     *                //}
     *            //}
     *            //queue.drain = function() {
     *                //log('DONE!!!!!!!!!!!');
     *            //};
     *            //log('done for a course');
     *        });
     *    }
     *    log('done for all subjects');
     *});
     */

/*
 *    Subject.findAll({
 *        include: [Course]
 *    }).success(function(subjects) {
 *        var i = 0;
 *        var j = 0;
 *        while (i < subjects.length) {
 *        //subjects.forEach(function(subject, i) {
 *            var course = subjects[i].courses;
 *            while (j < subjects[i].courses.length) {
 *            //subject[i].courses.forEach(function(course, i) {
 *                CourseScraper(subjects[i].code, course[j].values.number, function(err, result) {
 *                    log(err);
 *                    log(result);
 *
 *                    //return res.json(response);
 *                });
 *                j++;
 *            //});
 *            }
 *            i++;
 *        //});
 *        }
 *    }).error(function(err) {
 *        log(err);
 *        return res.json(400, response);
 *    });
 */
}


//Scrapes all courses in a subject's information
function scrapeCourses(req, res) {
    var response = {};
    response.message = 'Scraping all courses\' information';
    logv(response);

    var CourseBulkScraper = Scraper.CourseBulkScraper;

    Course.findAll({
        where: {
            //TODO: want to search for courses will no credits OR no description
            //perhaps would want to do a force reset, when can't empty out db?
            credits: null,
            //description: null,
        }
    }).success(function(courses) {
        //TODO: add emitter to bulk?
        CourseBulkScraper(courses, function() {
            return res.json(response);
        });
    }).error(function(err) {
        log(err);
        return res.json(400, response);
    });
}








//Looks for all subjects and scrapes each one
function scrapeSubjects(req, res) {
    var response = {};
    response.message = 'Scraping all subjects';
    logv(response);

    var SubjectScraper = Scraper.SubjectScraper;

    //TODO: use for & chainer?
    Subject.findAll().success(function(subjects) {
        subjects.forEach(function(subject, i) {
            SubjectScraper(subject.values.code, function(err, result) {
                log(err);
                logv(result);
            });
        });

        return res.json(response);
    }).error(function(err) {
        log(err);
        return res.json(400, response);
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
