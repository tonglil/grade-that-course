/*
 *App
 */

var express = require('express');
var http = require('http');
var passport = require('passport');

var app = express();

//Set up application
require('./config/environment')(app);
require('./config/passport')(passport);
require('./routes')(app, passport);

//Synchronize database
var db = require('./models').db;
db.query('SET FOREIGN_KEY_CHECKS = 0')
.then(function() {
  return db.sync({
    //force: true
  });
})
.then(function() {
  return db.query('SET FOREIGN_KEY_CHECKS = 1');
})
.then(function() {
  console.log('Database synchronized');
  //Start the server synchronously
  http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });
}, function(err) {
  console.log(err);
});

//Start the server asynchronously
