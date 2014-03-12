/*
 *Environment config
 */

var express = require('express');
var path = require('path');
var passport = require('passport');
var config = require('../config').app;
var middlewares = require('../controllers/middlewares');

module.exports = function (app) {
  app.configure(function() {
    app.set('port', config.port);
    app.use(express.logger('dev')); //Logs http requests in console
    app.use(express.compress());
    app.use(express.favicon());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.json());
    app.use(express.urlencoded());
    //TODO: use real secret
    app.use(express.session({ secret: 'secrets are good' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(path.join(__dirname, '../public')));
    //app.use(express.csrf());
    app.use(middlewares.Auth.user);
    app.use(app.router);
    app.use(middlewares.Errors.log);
    app.use(middlewares.Errors.clientHandler);
    app.use(middlewares.Errors.errorHandler);
    app.use(middlewares.Prototypes);
    app.set('view engine', 'jade');
    app.set('views', path.join(__dirname, '../views'));
  });

  app.configure('development', function() {
    console.log('Running on development environment');
    app.use(express.errorHandler());
  });

  app.configure('production', function() {
    console.log('Running on prodution environment');
  });
};
