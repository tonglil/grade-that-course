/*
 *Voting endpoints
 */

var log     = require('../controllers/logging').log;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
//var Score  = models.Score;

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

    Course.find({
        where: { code: courseCode }
    }).success(function(dbCourse) {
        //increment score type for course
        dbCourse.increment([type], 1);
        dbCourse.save();
        if (callbackOn) return callback(null);

        /*
         *dbCourse.getScore().success(function(courseScore) {
         *    if (courseScore) {
         *        courseScore.increment([type], 1);
         *        if (callbackOn) return callback(null);
         *    } else {
         *        Score.create().success(function(courseScore) {
         *            courseScore.increment([type], 1);
         *            dbCourse.setScore(courseScore);
         *            if (callbackOn) return callback(null);
         *        });
         *    }
         *});
         */

        //cache.put(courseCode, course, cacheTime.min3);
        //if (callbackOn) return callback(null, 'success thing here.........');
    }).error(function(err) {
        if (callbackOn) return callback(err, null);
    });
}
