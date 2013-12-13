/*
 *Helper methods
 */

var config = require('../config').logging;

//old, but provides custom header
//exports.log = console.log.bind(console, 'Logging:');

exports.log = function() {
    if (config.verbose) {
        if (arguments[0] !== null) {
            console.log.apply(console, arguments);
        }
    }
};

exports.logVerbose = function() {
    if (config.vverbose) {
        if (arguments[0] !== null) {
            console.log.apply(console, arguments);
        }
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
