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

exports.logError = function(message, result) {
    message = message || 'generic error';
    result = result || null;

    console.log({
        message: message,
        result: result
    });

    return result;
};
