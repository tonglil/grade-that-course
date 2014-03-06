/*
 *Login endpoints
 */

module.exports = function(app) {
  var passport = require('passport');

  app.get('/register', function(req, res) {
    res.render('register');
  });

  /*
   *@param email
   *@param password
   */
  app.post('/register', function(req, res, next) {
    var models = require('../models');
    var User = models.User;

    User.register(req.body.email, req.body.password, function(err, user) {
      //TODO: return to register, display reason for deny (user already exists, no password)
      if (err) return next(err);

      passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.redirect('/login');
        req.logIn(user, function(err) {
          if (err) return next(err);
          return res.redirect('/');
        });
      })(req, res, next);
    });
  });

  app.get('/login', function(req, res) {
    if (req.user) {
      return res.redirect('/');
    } else {
      return res.render('login');
    }
  });

  /*
   *@param email
   *@param password
   */
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/register'
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};
