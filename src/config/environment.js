/*
 *Environment config
 */

var express = require('express');
var path = require('path');
var passport = require('passport');
var middlewares = require('../controllers/middlewares');

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
  //TODO: setup proper logger
  app.use(express.logger('dev'));
  app.use(express.favicon());
  app.use(express.compress());
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  //TODO: use real secret
  app.use(express.session({ secret: 'secrets are good' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(middlewares.Auth.user);
  app.use(app.router);
  app.use(middlewares.Errors.log);
  app.use(middlewares.Errors.clientHandler);
  app.use(middlewares.Errors.errorHandler);
  app.use(middlewares.Prototypes);
  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '../views'));
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
