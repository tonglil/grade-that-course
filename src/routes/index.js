/*
 * Routing index
 */

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: 'grade that course',
            subtitle: 'transparent course reviews - ubc edition',
            faculties: [
                'arts',
                'engineering',
                'forestry',
                'kinesiology',
                'lfs',
                'sauder',
                'sciences',
                'other...'
            ],
            scoring: [
                'best',
                'worst',
                'easy',
                'hard',
                'fun',
                'useful or interesting',
                'poor Profs',
                'poor TAs'
            ],
            menu: [
                'scrape',
                'scrape/list',
                'scrape/subjects',
                'scrape/subject/EECE',
                'scrape/courses',
                'scrape/course/EECE/320',
                'list/all',
                'list/subject/EECE',
                'list/course/EECE/320'
            ]
        });
    });

    require('./scrape')(app);
    //require('./list')(app);
    //require('./voting')(app);

    app.get('/test', function(req, res) {
        var async = require('async');
        var models  = require('../models');
        var Subject = models.Subject;
        var Course = models.Course;

        async.waterfall([
            function(callback) {
                Subject.findOrCreate({
                    code: 'EECE'
                }).success(function(subject) {
                    callback(null, subject);
                });
            },
            function(subject, callback) {
                Course.findOrCreate({
                    number: '320',
                    SubjectId: 'EECE'
                }).success(function(course) {
                    course.setSubject(subject).success(function() {
                        console.log('saved');
                    });
                });

                Course.findOrCreate({
                    number: '310',
                    SubjectId: 'EECE'
                }).success(function(course) {
                    course.setSubject(subject).success(function() {
                        console.log('saved');
                        callback(null, 'done');
                    });
                });
            },
            function(nouse, callback) {
                Subject.findOrCreate({
                    code: 'APSC'
                }).success(function(subject) {
                    callback(null, subject);
                });
            },
            function(subject, callback) {
                Course.findOrCreate({
                    number: '160',
                    SubjectId: 'APSC'
                }).success(function(course) {
                    course.setSubject(subject).success(function() {
                        console.log('saved');
                    });
                });

                Course.findOrCreate({
                    number: '320',
                    SubjectId: 'APSC'
                }).success(function(course) {
                    course.setSubject(subject).success(function() {
                        console.log('saved');
                        callback(null, 'done');
                    });
                });
            }
        ], function(err, final) {
            console.log(final);
            /*
             *Course.getCourses(null, null, function(err, results) {
             *    if (err) return res.json(500, err);
             *    var ready = [];
             *    async.each(results, function(item, callback) {
             *        item.getSubject().success(function(subject) {
             *            var result = subject.code;
             *            if (ready.indexOf(result) < 0) ready.push(subject.code);
             *            callback();
             *        });
             *    }, function(err) {
             *        return res.json(ready);
             *    });
             *});
             */
            Course.getCourses('EECE', '320', function(err, result) {
                result[0].getSubject().success(function(go) {
                    console.log(go);
                    return res.json(go);
                });
                //result[0].getSubject(function(go) {
                    //console.log(go);
                    //return res.json(go);
                //});
                //return res.json(result.getSubjectInfo);
            });
        });
    });




    app.post('/index-search', function(req, res) {
        var searchTerm = req.body.course.toUpperCase();
        var resultSub = searchTerm.toUpperCase().match(/^[A-Z]+/);
        var resultNum = searchTerm.match(/[0-9]+$/);
        var subject = (resultSub) ? resultSub[0] : '';
        var number = (resultNum) ? resultNum[0] : '';

        var async = require('async');
        var Course = require('../models').Course;

        console.log(subject, number);
        if (subject === '' && number === '') return;

        Course.findCourses(subject, number, function(err, dbCourses) {
            if (err) return res.redirect('500');

            var courses = [];
            async.forEach(dbCourses, function(dbCourse, callback){
                dbCourse.getSubject().success(function(subject) {
                    var course = dbCourse.clean();
                    course.subject = subject.clean();
                    courses.push(course);
                    //have a job that just aggregates scores for each course?
                    //also get the aggregate scores and THEN callback.
                    callback();
                });
            }, function(err) {
                //console.log(courses);
                return res.render('search-response', {
                    courses: courses
                });
            });
        });
    });

    app.get('/ubc/course/:subject/:number', function(req, res) {
        var Course = require('../models').Course;
        var Subject = require('../models').Subject;
        var subject = req.params.subject;
        var number = req.params.number;

        Course.getCourse(subject, number, function(err, course) {
            if (err) return res.redirect('*');
            return res.json(200, course.clean());
        });
    });

    app.get('/500', function(req, res) {
        res.json(500, 'error');
    });

    app.get('*', function(req, res) {
        res.json(404, 'not found');
    });
};

var models  = require('../models');
var Course  = models.Course;

function getCourse(courseCode, callback) {
    var callbackOn = false;

    if (callback && typeof callback == 'function') {
        callbackOn = true;
    }

    //if in cache, return cached result
    Course.find({
        where: { code: courseCode }
    }).success(function(course) {
        if (course) {
            //TODO: return:
            //course info
            //associated subject
            //associated faculty
            //scores
            //user comments
            if (callbackOn) return callback(null, course);
        } else {
            if (callbackOn) return callback('no course found');
        }
    });

}
