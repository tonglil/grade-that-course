/*
 *Scraping endpoints
 */

var cheerio = require('cheerio');
var request = require('request');
var url     = require('url');

module.exports = function(app) {
    app.get('/list', list);
    app.get('/list/subject', subject);
};

function list(req, res) {
    a = 'get list from db';
    console.log(a);
    return res.json(a);
}

function subject(req, res) {
    a = 'get courses from db';
    console.log(a);
    return res.json(a);
}
