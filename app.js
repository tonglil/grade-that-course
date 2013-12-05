/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var swig = require('swig');

var routes = require('./routes');
var scraper = require('./routes/scraper');

var app = express();

// all environments
app.set('port', process.env.PORT || 4000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// jade specific
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views/jade'));

// swig specific
//app.engine('html', swig.renderFile);
//app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views/swig'));
//app.set('view cache', false);
//swig.setDefaults({ cache: false });

// routing
app.get('/', routes.index);

app.get('/listing', scraper.listing);
app.get('/subject', scraper.subject);

// create server
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
