/*
 *Helper methods
 */

var config = require('../config').logging;

exports.log = console.log.bind(console, 'Logging:');

exports.logger = function() {
    if (config.verbose) {
        console.log.apply(console, arguments);
    }
};

exports.logError = function(res, error, message, status) {
    res = res || null;
    error = error || '';
    message = message || 'Error';
    status = status || 500;

    console.log({
        type: 'error',
        http: status,
        message: message,
        error: error
    });

    if (res) {
        return res.send(status, message);
    }
};
