/*
 *User authorization endpoints
 */

module.exports = function(app, passport) {
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

    if (!req.body.password) {
      return res.render('register', {
        info: 'Enter a password'
      });
    }

    User.register(req.body.email, req.body.password, function(err, user) {
      if (err === 'user exists') {
        return res.render('register', {
          info: 'User already exists'
        });
      }
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
  app.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err === 'no user') {
        return res.render('login', {
          info: 'User does not exist'
        });
      }
      if (err === 'incorrect password') {
        return res.render('login', {
          info: 'Incorrect password'
        });
      }
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        return res.redirect('/');
      });
    })(req, res, next);
  });

  app.get('/auth/facebook', passport.authenticate('facebook'));
  //app.get('/auth/facebook', passport.authenticate('facebook', {
  //scope: 'email'
  //}))

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};
