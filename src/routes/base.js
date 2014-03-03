/*
 *Base endpoints
 */

module.exports = function(app) {
  app.get('/none', function(req, res) {
    res.json(200, null);
  });

  app.get('/err', function(req, res) {
    res.json(500, 'error');
  });

  //TODO: DEPRECIATED
  app.get('/500', function(req, res) {
    res.json(500, 'error');
  });

  app.get('*', function(req, res) {
    res.json(404, 'not found');
  });

};
