/*
 * GET home page.
 */

exports.index = function(req, res) {
    res.render('index', {
        title: 'UBC Course Voter',
        description: 'Curretly a work in progress for a course voter (rate my prof/hn/reddit) for ubc.',
        menu: ["listing", "subject"]
    });
};
