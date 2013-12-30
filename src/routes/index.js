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

    app.get('*', function(req, res) {
        res.send(404, 'Page not found');
    });
};
