/*
 * Routing index
 */

module.exports = function(app) {
    app.get('/', function(req, res) {
        res.render('index', {
            title: 'UBC Course Voter',
            description: 'Curretly a work in progress for a course voter (rate my prof/hn/reddit) for ubc.',
            menu: ["scrape", "scrape/list", "scrape/subject", "list", "list/subject"]
        });
    });

    require('./scrape')(app);
    require('./list')(app);
};
