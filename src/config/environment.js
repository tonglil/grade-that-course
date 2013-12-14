/*
 *Environment config
 */

var express = require('express');
var path = require('path');

module.exports = function(app) {
    all(app);
    dev(app);
    prod(app);
};

function all(app) {
    app.set('port', process.env.PORT || 4000);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    //app.use(express.bodyParser());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
}

function dev(app) {
    if ('development' == app.get('env')) {
        console.log('Running on development environment');
        app.use(express.errorHandler());
    }
}

function prod(app) {
    //production specific config
}
