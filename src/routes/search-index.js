/*
 *Index instant search endpoint
 */

var Course = require('../models').Course;
var Subject = require('../models').Subject;
var Score = require('../models').Score;

module.exports = function(app) {
  app.post('/index-search', function(req, res) {
    var searchTerm = req.body.course.toUpperCase();
    var resultSub = searchTerm.toUpperCase().match(/^[A-Z]+/);
    var resultNum = searchTerm.match(/[0-9]+$/);
    var subject = (resultSub) ? resultSub[0] : '';
    var number = (resultNum) ? resultNum[0] : '';

    //console.log(subject, number);
    if (subject === '' && number === '') return res.json(200, []);

    Course.findAll({
      where: {
        number: {
          like: number + '%'
        }
      },
      order: 'number ASC',
      include: [{
        model: Subject,
        where: {
          code: {
            like: '%' + subject + '%'
          }
        },
        order: 'code ASC'
      }, {
        model: Score,
      }],
      limit: 10,
    }).success(function(courses) {
      //TODO: return json data and have client render template?
      return res.render('search-response', {
        courses: courses
      });
    }).error(function(err) {
      console.log(err);
      return res.json(500, []);
    });
  });
};
