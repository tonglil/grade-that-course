/*
 *Environment config
 */

var express = require('express');
var path = require('path');

module.exports = function(app) {
    all(app);

    if ('development' == app.get('env')) {
        dev(app);
    }

    if ('production' == app.get('env')) {
        prod(app);
    }
};

function all(app) {
    app.set('port', process.env.PORT || 4000);
    app.use(express.logger('dev'));
    app.use(express.favicon());
    app.use(express.compress());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(app.router);
}

//Development specific config
function dev(app) {
    console.log('Running on development environment');
    app.use(express.errorHandler());
}

//Production specific config
function prod(app) {
    console.log('Running on prodution environment');
}
