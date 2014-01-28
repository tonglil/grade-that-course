/*
 * Routing index
 */

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: null,
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

  app.post('/faculty', function(req, res) {
    var async = require('async');
    var Faculty = require('../models').Faculty;
    var Subject = require('../models').Subject;
    var Score = require('../models').Score;
    var shortName = req.body.faculty.toLowerCase();

    Faculty.findAll({
      where: {
        shortName: shortName
      }
    }).success(function(faculties) {
      var results = [];

      async.each(faculties, function(faculty, callback) {
        faculty.getSubjects({
        }).success(function(subjects) {
          results.push(subjects);
          callback();
        }).error(function(err) {
          callback(err);
        });
      }, function(err) {
        if (err) console.log(err);
        console.log(JSON.stringify(results));
        return res.render('faculty', {
          title: shortName.capitalize(),
          faculty: shortName,
          results: results
        });
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
