/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var url     = require('url');

module.exports = function(app) {
    app.get('/scrape', all);
    app.get('/scrape/list', list);
    app.get('/scrape/subject', subject);
};

function all(req, res) {
    a = 'trigger all scrape actions';
    console.log(a);
    return res.json(a);
}

function list(req, res) {
    a = 'scrape the list\'s subjects and Faculties here';
    console.log(a);

    //var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=EECE';
    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=0';

    //Fetch the target site, send the results to a callback function
    request(target, function(err, response, body) {
        //Error check
        if (err || response.statusCode !== 200) {
            console.log('Request error.');
            return;
        }

        //jQuery traversing
        var $ = cheerio.load(body);
        $body = $('body');
        $mainTable = $body.find('#mainTable');
        $courseTable = $mainTable.find("tr[class^='section']");

        var courses = new Array();
        $courseTable.each(function(i, item) {
            var course = {};
            course['code'] = $(item).children('td:nth-of-type(1)').text().trim();
            course['name'] = $(item).children('td:nth-of-type(2)').text().trim();
            course['faculty'] = $(item).children('td:nth-of-type(3)').text().trim();
            courses.push(course);
        })

        console.log(courses);

        //TODO: store this data in database under right category;

        res.render('listing', {
            title: $('title').text(),
            items: courses
        });
    });
}

function subject(req, res) {
    a = 'scrape a subject\'s courses here';
    console.log(a);

    var target = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=1&dept=EECE';

    //Fetch the target site, send the results to a callback function
    request(target, function(err, response, body) {
        //Error check
        if (err || response.statusCode !== 200) {
            console.log('Request error.');
            return;
        }

        //jQuery traversing
        var $ = cheerio.load(body);
        $body = $('body');
        $mainTable = $body.find('#mainTable');
        $courseTable = $mainTable.find("tr[class^='section']");

        var courses = new Array();
        $courseTable.each(function(i, item) {
            var course = {};
            course['number'] = $(item).children('td:nth-of-type(1)').text().trim();
            course['name'] = $(item).children('td:nth-of-type(2)').text().trim();
            courses.push(course);
        })

        console.log(courses);

        //TODO: store this data in database under right category;

        res.render('listing', {
            title: $('title').text(),
            items: courses
        });
    });
}
