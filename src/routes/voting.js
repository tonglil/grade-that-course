/*
 *Voting endpoints
 */

var log     = require('../controllers/logging').log;

module.exports = function(app) {
    app.post('/vote/course', voteType);
};

function voteType(req, res) {
    var courseCode = req.body.courseCode;
    var type = req.body.type;

    voteCourseType(courseCode, type, function(err, result) {
        if (err) {
            return res.json(500, 'error');
        }
        return res.send(200);
    });
}

function voteCourseType(courseCode, type, callback) {
    var callbackOn = false;

    if (callback && typeof callback == 'function') {
        callbackOn = true;
    }

    log(courseCode, type);
    //find course
    //increment score type for course

    //if (err && callbackOn) return callback(err, null);
    //cache.put(courseCode + 'List', courseList, cacheTime.min3);
    if (callbackOn) return callback(null, 'success');

}
