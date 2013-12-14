/*
 *Listing endpoints
 */

var log     = require('../controllers/logging').log;

//combine these things into one 'lookupCourses' and then pick out their methods
var getAllCourses  = require('../controllers/List').getAllCourses;
var getSubjectCourses  = require('../controllers/List').getSubjectCourses;
var getCourse  = require('../controllers/List').getCourse;

module.exports = function(app) {
    app.get('/list/all', listAll);
    app.get('/list/subject/:subject', listSubject);
    app.get('/list/course/:subject/:number', listCourse);
};

function listAll(req, res) {
    getAllCourses(function(err, result) {
        if (err) {
            return res.json(500, 'error');
        }
        return res.json(result);
    });
}

function listSubject(req, res) {
    var subjectCode = req.params.subject;

    getSubjectCourses(subjectCode, function(err, result) {
        if (err) {
            return res.json(500, 'error');
        }
        return res.json(result);
    });
}

function listCourse(req, res) {
    var subjectCode = req.params.subject;
    var courseNumber = req.params.number;

    getCourse(subjectCode, courseNumber, function(err, result) {
        if (err) {
            return res.json(500, 'error');
        }
        return res.json(result);
    });
}
