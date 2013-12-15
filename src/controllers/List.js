/*
 *Listing controller actions
 */

var cache   = require('memory-cache');
var cacheTime = require('../config').cache;
var log     = require('../controllers/logging').log;

var models  = require('../models');
var Sequelize = models.Sequelize;
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;

//Make available via require().getAllCourses
module.exports.getAllCourses = getAllCourses;

//Object to fetch all courses from the database
//TODO: (store in diff cache? no? or only if use new? does new defeat cache?)
//TODO: selective fields by passing in filds they want in an object
//@par: function        errback with errors
//@par: function        callback with courses
function getAllCourses(callback) {
    var callbackOn = false;

    if (callback && typeof callback == 'function') {
        callbackOn = true;
    }

    var cached = cache.get('courses');
    if (cached) {
        if (callbackOn) return callback(null, cached);
    } else {
        Course.findAll().success(function(courses) {
            var courseList = [];
            courses.forEach(function(dbCourse) {
                var course = dbCourse.values;
                delete course.createdAt;
                delete course.updatedAt;
                courseList.push(course);
            });
            cache.put('courses', courseList, cacheTime.day);
            if (callbackOn) return callback(null, courseList);
        }).error(function(err) {
            if (errback && typeof errback == 'function') {
                return callback(err);
            }
        });
    }
}

//Make available via require().getSubjectCourses
module.exports.getSubjectCourses = getSubjectCourses;

//Object to fetch a subject's courses from the database
//TODO: (store a diff cache? or only if use new? does new defeat cache?)
//@par: string          subject code
//@par: function        callback with error, courses
function getSubjectCourses(subjectCode, callback) {
    var callbackOn = false;

    if (callback && typeof callback == 'function') {
        callbackOn = true;
    }

    var cached = cache.get(subjectCode + 'courses');
    if (cached) {
        if (callbackOn) return callback(null, cached);
    } else {
        Course.findAll({
            where: { subject: subjectCode }
        }).success(function(courses) {
            var courseList = [];
            courses.forEach(function(dbCourse) {
                var course = dbCourse.values;
                delete course.createdAt;
                delete course.updatedAt;
                courseList.push(course);
            });
            cache.put(subjectCode + 'courses', courseList, cacheTime.hour);
            if (callbackOn) return callback(null, courseList);
        }).error(function(err) {
            if (errback && typeof errback == 'function') {
                return callback(err);
            }
        });
    }

    //TODO: would this be faster than findAll?
    /*
     *var cached = cache.get('subject' + subjectName);
     *if (cached) {
     *    return res.send(cached);
     *} else {
     *    Subject.find({
     *        where: { code: subjectName }
     *    }).success(function(subject) {
     *        subject.getCourses().success(function(courses) {
     *        var courseList = [];
     *            courses.forEach(function(item) {
     *                var single = {};
     *                single.code = item.code;
     *                single.number = item.number;
     *                single.name = item.name;
     *                single.subject = subject.code;
     *                courseList.push(single);
     *            });
     *        cache.put('subject' + subjectName, courseList);
     *        return res.send(courseList);
     *        });
     *    });
     *}
     */
}


//Make available via require().getCourse
module.exports.getCourse = getCourse;

//Object to fetch a subject's courses from the database
//TODO: (dealing with diffs since course might get updated often? or only if use new? does new defeat cache?)
//@par: string          subject code
//@par: string          course number
//@par: function        callback with error, courses
function getCourse(subjectCode, courseNumber, callback) {
    var courseCode = subjectCode + courseNumber;
    var callbackOn = false;

    if (callback && typeof callback == 'function') {
        callbackOn = true;
    }

    var cached = cache.get(courseCode + 'courses');
    if (cached) {
        if (callbackOn) return callback(null, cached);
    } else {
        Course.find({
            where: { code: courseCode }
        }).success(function(dbCourse) {
            var course = dbCourse.values;
            delete course.createdAt;
            delete course.updatedAt;
            cache.put(courseCode, course, cacheTime.min3);
            if (callbackOn) return callback(null, course);
        }).error(function(err) {
            if (errback && typeof errback == 'function') {
                return callback(err);
            }
        });
    }
}
