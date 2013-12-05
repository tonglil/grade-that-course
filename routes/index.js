/*
 * GET home page.
 */

cheerio = require('cheerio');
request = require('request');
url = require('url');

exports.index = function(req, res){
    res.render('index', { title: 'Express' });
};
