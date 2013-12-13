/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var log     = require('../controllers/logging').logger;
var badge   = require('../controllers/logging').logError;

// emitters
var EventEmitter = require('events').EventEmitter;
var sys = require('sys');

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;

/*
 *module.exports = function(app) {
 *    app.get('/scrape', scrapeAll);
 *    app.get('/scrape/subjects', scrapeSubjects);
 *
 *    app.get('/scrape/list', scrapeList);
 *    app.get('/scrape/subject/:subject', scrapeSubject);
 *    app.get('/scrape/course/:subject/:number', scrapeCourse);
 *};
 */


//Make available via require().subjectScraper
module.exports.subjectScraper = subjectScraper;

//Object to scrape a subject's courses
//@par: string          subject code
//@ret: SubjectScraper
function subjectScraper(code) {
    return new SubjectScraper(code);
}

//SubjectScraper constructor
//@par: string          subject code
function SubjectScraper(code) {
    this.code = code;
    EventEmitter.call(this);
}

//SubjectScraper inherits from EventEmitter
sys.inherits(SubjectScraper, EventEmitter);

//Success emitter
//@par: callback function???????
SubjectScraper.prototype.success = function(fct) {
    this.on('success', fct);
    return this;
};

//Error emitter
//@par: callback function???????
SubjectScraper.prototype.error = function(fct) {
    this.on('error', fct);
    return this;
};

//Scraper
SubjectScraper.prototype.run = function() {
    var subjectCode = this.code;
    var target = 'https://coursesa.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + subjectCode;
    //var result;

    /*
     *if (subjectCode === 'hi') {
     *    this.emit('error');
     *} else {
     *    this.emit('success');
     *}
     *return this;
     */

    request(target, function(err, response, body) {
        if (err || !response) {
            //TODO: how to emit a message & error?
            this.emit('error');
            return this;
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
            //TODO: result = { code: 404, error: 'Subject ' + subjectCode + ' has no courses/was not found' };
            this.emit('error');
            return this;
        }

        courses.forEach(function(item) {
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
                        //result = { code: 400, error: err };
                        this.emit('error');
            return this;
                    });
                });
            }).error(function(err) {
                //badge(null, err, 'Course not found/created');
                this.emit('error');
            return this;
            });
        });
        this.emit('success');
            return this;
    });

    //this.emit('error');
    //return this;
};














// looks for all subjects and calls scrapeSubject on each one.
function scrapeSubjects(req, res) {
    a = 'trigger all subject scrape actions';
    console.log(a);

    Subject.findAll().success(function(subjects) {
        subjects.forEach(function(subject) {
            process(subject);
        });

        for (var i = 0; i < subjects.length; i++) {
            process(subjects[i]);
            // check for errors in result!
            //log('overall subjects scrape error');
        }
    });

    return res.json(a);
}

function process(subject) {
    test(subject).error(function() {
        log('it failed (but still worked)!!!!!!!!!');
    }).success(function() {
        log('wow it worked!!!!!!!!!!!!!!!!!!');
    }).run();

    test.call(subject, subject.code).success(function() {
        log('wow it worked!!!!!!!!!!!!!!!!!!');
    }).error(function() {
        log('it failed (but still worked)!!!!!!!!!');
    }).run();
}
