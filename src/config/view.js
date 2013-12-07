/*
 *View config
 */

var path = require('path');

module.exports = function(app) {
    viewEngine(app, 'jade');
};

function viewEngine(app, engine) {
    if (engine === 'jade') {
        app.set('view engine', 'jade');
        app.set('views', path.join(__dirname, '../views/jade'));
    }

    if (engine === 'swig') {
        var swig = require('swig');
        app.set('view engine', 'html');
        app.set('views', path.join(__dirname, '../views/swig'));
        app.set('view cache', false);
        app.engine('html', swig.renderFile);
        swig.setDefaults({ cache: false });
    }
}
