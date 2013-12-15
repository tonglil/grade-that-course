/*
 *Application config
 */

var configFile = './' + (process.env.NODE_ENV ? process.env.NODE_ENV : 'development') + '.js';

var config = require(configFile);

module.exports = config;
