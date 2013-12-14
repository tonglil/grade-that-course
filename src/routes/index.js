/*
 * Routing index
 */

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: 'UBC Course Voter',
            description: 'Currently a work in progress for a course voter (rate my prof/hn/reddit) for ubc.',
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
    require('./list')(app);

    app.get('*', function(req, res) {
        res.send(404, 'Page not found');
    });
};
