/*
 *App
 */

var express = require('express');
var http = require('http');

var app = express();

//Load application
require('./config/environment')(app);
require('./routes')(app);

var models = require('./models');

models.db.sync({
    //force: true
}).complete(function(err) {
    if (err) {
        console.log(err);
    } else {
        http.createServer(app).listen(app.get('port'), function(){
            console.log('Express server listening on port ' + app.get('port'));
        });
    }
});
