/*
 *App
 */

var express = require('express');
var http = require('http');

var app = express();

//Load application
require('./config/environment')(app);
require('./config/view')(app);

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
