/*
 *App
 */

var express = require('express');
var http = require('http');
var async = require('async');

var app = express();

//Set up application
require('./config/environment')(app);
require('./routes')(app);

var models = require('./models');

var fn = [];

fn.push(
  function(callback) {
  models.db.query('SET FOREIGN_KEY_CHECKS = 0').complete(callback);
});

fn.push(
  function(callback) {
  models.db.sync({
    //force: true
  }).complete(callback);
});

fn.push(
  function(callback) {
  models.db.query('SET FOREIGN_KEY_CHECKS = 1').complete(callback);
});

async.series(fn, function(err) {
  if (err) {
    console.log(err);
  } else {
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
  }
});
