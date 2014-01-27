/*
 * Routing index
 */

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: 'grade that course',
      subtitle: 'transparent course reviews - ubc edition',
      faculties: [
        'arts',
        'engineering',
        'forestry',
        'kinesiology',
        'lfs',
        'sauder',
        'science',
        'other'
      ],
      categories: [
        'best',
        'worst',
        'easy',
        'hard',
        'fun',
        'useful or interesting',
        'poor Profs',
        'poor TAs'
      ],
      categoriesSlug: [
        'best',
        'worst',
        'easy',
        'hard',
        'fun',
        'useful',
        'profs',
        'tas'
      ],
      /*
       *menu: [
       *  'scrape',
       *  'scrape/list',
       *  'scrape/subjects',
       *  'scrape/subject/EECE',
       *  'scrape/courses',
       *  'scrape/course/EECE/320',
       *  'list/all',
       *  'list/subject/EECE',
       *  'list/course/EECE/320'
       *]
       */
    });
  });

  require('./scrape')(app);
  require('./search-index')(app);
  //require('./list')(app);
  //require('./voting')(app);

  app.get('/faculty/:faculty', function(req, res) {
    var async = require('async');
    var Faculty = require('../models').Faculty;
    var shortName = req.params.faculty;
    if (shortName == 'other') shortName = null;

    Faculty.findAll({
      where: {
        shortName: shortName
      }
    }).success(function(faculties) {
      var result = [];

      async.each(faculties, function(faculty, callback) {
        faculty.getCourses().success(function(courses) {
          result.push(courses);
          callback();
        }).error(function(err) {
          callback(err);
        });
      }, function(err) {
        if (err) console.log(err);
        console.log(result.length);
        return res.json(result);
      });
    });
  });

  app.get('/ubc/course/:subject/:number', function(req, res) {
    var Course = require('../models').Course;
    var Subject = require('../models').Subject;
    var subject = req.params.subject;
    var number = req.params.number;

    Course.getCourse(subject, number, function(err, course) {
      if (err) return res.redirect('*');
      return res.json(200, course.clean());
    });
  });

  require('./base')(app);
};
