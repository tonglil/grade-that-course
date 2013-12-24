/*
 * Routing index
 */

var log     = require('../controllers/logging').log;

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: '(don\'t) take that course',
            subtitle: 'ubc edition',
            faculties: [
                'arts',
                'engineering',
                'forestry',
                'kinesiology',
                'lfs',
                'sauder',
                'sciences',
                'more...'
            ],
            scoring: [
                'best',
                'worst',
                'easy',
                'hard',
                'fun',
                'useful',
                'prof. warning'
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

    app.post('/index-search', function(req, res) {
        var course = req.body.course.toUpperCase();
        var getCourseCode = require('../controllers/List').getCourseCode;
        getCourseCode(course, function(err, result) {
            if (err) {
                return res.json(500, 'Database error');
            }
            return res.render('search-response', {
                courses: result
            });
        });
    });

    app.get('*', function(req, res) {
        res.send(404, 'Page not found');
    });
};
