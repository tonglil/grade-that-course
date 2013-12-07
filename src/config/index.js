/*
 *App configurations
 */

module.exports = function(app) {
    require('./environment')(app);
    require('./view')(app);
};
