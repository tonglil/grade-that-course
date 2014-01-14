/*
 * Routing index
 */

var log     = require('../controllers/logging').log;

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            //title: '(don\'t) take that course',
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
            ]
            //menu: [
                //'scrape',
                //'scrape/list',
                //'scrape/subjects',
                //'scrape/subject/EECE',
                //'scrape/courses',
                //'scrape/course/EECE/320',
                //'list/all',
                //'list/subject/EECE',
                //'list/course/EECE/320'
            //]
        });
    });

    require('./scrape')(app);
    require('./list')(app);
    require('./voting')(app);

    app.get('/test', function(req, res) {
        var models  = require('../models');
        var Trainer = models.Trainer;
        var Series = models.Series;

        Trainer.findOrCreate({
            first: 'tony' } , {
            last: 'li'
        }).success(function(trainer) {
            Series.findOrCreate({
                title: 'hi'
            }).success(function(series) {
                series.setTrainer(trainer).success(function() {
                    console.log('saved');
                });
            });

            Series.findOrCreate({
                title: 'hello'
            }).success(function(series) {
                series.setTrainer(trainer).success(function() {
                    console.log('saved');
                });
            });

            //return res.json(200, trainer);
        });

        Series.getSeries(null, 'tony', function(err, result) {
            return res.json(result);
        });





/*
 *        var Course  = models.Course;
 *        var Subject  = models.Subject;
 *
 *        Course.find({
 *            where: {
 *                number: '320',
 *                subject: {
 *                    code: 'EECE'
 *                }
 *            }
 *        }).success(function(result) {
 *            console.log(result.values());
 *            return res.json(200, result);
 *        });
 *
 *        Course.getCourse('EECE320', Subject, function(result) {
 *            console.log(result.getCourseCode());
 *            return res.json(200, result);
 *        });
 */
    });







    app.post('/index-search', function(req, res) {
        var course = req.body.course.toUpperCase();
        var searchCourseCode = require('../controllers/List').searchCourseCode;

        searchCourseCode(course, function(err, result) {
            if (err) {
                return res.json(500, 'Database error');
            }
            log(result);
            return res.render('search-response', {
                courses: result
            });
        });
    });

    app.get('/ubc/course/:subject/:number', function(req, res) {
        var Course = require('../models').Course;
        var Subject = require('../models').Subject;
        var subjectCode = req.params.subject;
        var courseNumber = req.params.number;

        Course.getCourse(Subject, subjectCode, courseNumber, function(err, result) {
            if (err) {
                //no course found, redirect to default 404 page
                return res.json(404, 'no course found!');
            }
            return res.json(200, result.getFacultyName());
        });
    });

    app.get('*', function(req, res) {
        res.send(404, 'Page not found');
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
