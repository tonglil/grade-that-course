/*
 *Scraping endpoints
 */

var request = require('request');
var cheerio = require('cheerio');
var async   = require('async');

var models  = require('../models');
var Course  = models.Course;
var Subject = models.Subject;
var Faculty = models.Faculty;
var Score = models.Score;

module.exports = function(app) {
  app.get('/scrape/list', function(req, res) {
    scrapeList(function(err, result) {
      if (err) console.log(err, result);
      return res.json('scraping directory');
    });
  });

  app.get('/scrape/subjects', function(req, res) {
    Subject.findAll({
      attributes: ['code']
    }).success(function(subjects) {
      subjects.forEach(function(subject) {
        scrapeSubjets(subject.getDataValue('code'), function(err, result) {
          if (err) console.log(err, result);
        });
      });

      return res.json('scraping all subjects');
    }).error(function(err) {
      console.log(err);
      return res.redirect('500');
    });
  });

  app.get('/scrape/courses', function(req, res) {
    Course.findAll({
      where: {
        //TODO: search for courses with no credits OR no description
        credits: null,
        //description: null,
      }
    }).success(function(courses) {
      scrapeCourses(courses, function() {
        return res.json('scraping all courses');
      });
    }).error(function(err) {
      console.log(err);
      return res.redirect('500');
    });
  });

  app.get('/populate', function(req, res) {
    Course.findAll().success(function(courses) {
      courses.forEach(function(course) {
        Score.create().success(function(score) {
          score.setCourse(course);
        }).error(function(err) {
          console.log('score not set:', err);
        });
      });

      return res.json('populating all courses');
    }).error(function(err) {
      console.log('score not created:', err);
      return res.redirect('/err');
    });
  });

  //app.get('/scrape/subject/:subject', scrapeSubject);
  //app.get('/scrape/course/:subject/:number', scrapeCourse);
};

//Scrapes a directory's subjects and faculties
function scrapeList(callback) {
  var Sequelize = models.Sequelize;
  var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=0';
  var result = {
    callee: arguments.callee.name,
    url: url
  };

  request(url, function(err, response, body) {
    if (err || !response || response.statusCode !== 200) {
      if (response) result.statusCode = response.statusCode;
      return callback(err, result);
    }

    var $ = cheerio.load(body);
    $body = $('body');
    $mainTable = $body.find('#mainTable');
    $courseTable = $mainTable.find("tr[class^='section']");

    var data = [];
    $courseTable.each(function(i, item) {
      var list = {};
      list.code = $(item).children('td:nth-of-type(1)').text().replace('*', '').trim();
      list.subject = $(item).children('td:nth-of-type(2)').text().trim();
      list.faculty = $(item).children('td:nth-of-type(3)').text().trim();
      data.push(list);
    });

    var faculties = Sequelize.Utils._.chain(data).map(function(item) {
      return item.faculty;
    }).uniq().value();

    faculties.forEach(function(item) {
      Faculty.findOrCreate({
        name: item
      }).error(function(err) {
        result.message = 'error finding/creating faculty';
        return callback(err, result);
      });
    });

    data.forEach(function(item) {
      Subject.findOrCreate({
        code: item.code
      }).success(function(subject) {
        subject.updateAttributes({
          name: item.subject
        });

        Faculty.find({
          where: { name: item.faculty }
        }).success(function(faculty) {
          if (faculty) {
            subject.setFaculty(faculty).error(function(err) {
              result.message = 'can\'t set faculty';
              return callback(err, result);
            });
          }
        }).error(function(err) {
          result.message = 'error finding faculty';
          return callback(err, result);
        });
      }).error(function(err) {
        result.message = 'error finding/creating subject';
        return callback(err, result);
      });
    });

    return callback(null);
  });
}

//Scrapes each subject in the database
function scrapeSubjets(code, callback) {
  var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=' + code;
  var result = {
    callee: arguments.callee.name,
    url: url
  };

  if (callback && typeof callback == 'function') {
    var callbackOn = true;
  }

  request(url, function(err, response, body) {
    if (err || !response || response.statusCode !== 200) {
      if (response) {
        result.statusCode = response.statusCode;
      }
      if (callbackOn) return callback(err, result);
    }

    var $ = cheerio.load(body);
    $body = $('body');
    $mainTable = $body.find('#mainTable');
    $courseTable = $mainTable.find("tr[class^='section']");

    var courses = [];
    var regex = /[0-9].*/;
    $courseTable.each(function(i, item) {
      var course = {};
      course.number = $(item).children('td:nth-of-type(1)').text().trim().match(regex)[0];
      course.name = $(item).children('td:nth-of-type(2)').text().trim();
      courses.push(course);
    });

    if (courses.length === 0) {
        err = 'Subject ' + code + ' has no courses/was not found';

        Subject.find({
            where: {
                code: code
            }
        }).success(function(subject) {
            subject.destroy().success(function() {
                console.log('Subject ' + code + ' removed from db');
                if (callbackOn) return callback(err, result);
            });
        });
    }

    Subject.find({
        where: {
            code: code
        }
    }).success(function(subject) {
        subject.getFaculty().success(function(faculty) {
            courses.forEach(function(item) {
                Course.findOrCreate({
                    number: item.number,
                    SubjectId: code
                }).success(function(course) {
                    if (course) {
                        course.updateAttributes({
                            name: item.name
                        });
                        course.setSubject(subject).error(function(err) {
                            result.message = 'error setting course\'s subject';
                            if (callbackOn) return callback(err, result);
                        });
                        course.setFaculty(faculty).error(function(err) {
                            result.message = 'error setting course\'s faculty';
                            if (callbackOn) return callback(err, result);
                        });
                    }
                }).error(function(err) {
                    result.message = 'error finding/creating course';
                    if (callbackOn) return callback(err, result);
                });
            });
        });
    });

    if (callbackOn) return callback(null);
  });
}

//Scrapes each course in the database
function scrapeCourses(courses, callback) {
    var queue = async.queue(function(course, callback) {
        var callbackOn = false;

        if (callback && typeof callback == 'function') {
            callbackOn = true;
        }

        if (course.credits && course.description) {
            //Course has details already, no need to overwrite unless forcing
            if (callbackOn) return callback();
        }

        var url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=' + course.SubjectId + '&course=' + course.number;

        request(url, function(err, response, body) {
            if (err || !response || response.statusCode !== 200) {
                if (callbackOn) return callback();
            }

            var $ = cheerio.load(body);
            $body = $('body');
            $description = $body.find('.content.expand').children('p').slice(0,1).text().trim();
            $credits = parseInt($body.find('.content.expand').children('p').slice(1,2).text().trim().slice(-1), 10);
            $na = $body.find('.content.expand').text().trim().indexOf('no longer offered');

            if ($na != -1) {
                console.log('Course ' + course.SubjectId + course.number + ' had no data');
                if (callbackOn) return callback();
            }

            course.description = $description;
            if (isNumber($credits)) course.credits = $credits;

            course.save([
                'description', 'credits'
            ]).success(function() {
                return callback();
            }).error(function(err) {
                return callback(err);
            });
        });
    }, 10);

    function start(courses) {
        courses.forEach(function(course) {
            queue.push(course);
        });
    }

    start(courses);

    queue.drain = function() {
        callback('done');
    };

    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }
}
