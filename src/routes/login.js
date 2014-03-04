/*
 *Login endpoints
 */

module.exports = function(app) {
  var passport = require('passport');
  var Auth = require('../controllers/middlewares').Auth;

  app.get('/signup', function(req, res) {
    if (req.user) {
      console.log('signup page, logged in:', req.user.values);
    }

    res.render('signup');
  });

  //POST:
  //email
  //password
  app.post('/signup', Auth.userExist, function(req, res) {
    var models = require('../models');
    var User = models.User;

    var email = req.body.email;
    var password = req.body.password;

    User.signup(email, password, function(err, user) {
      if (err) return res.redirect('*');
      req.login(user, function(err) {
        console.log('req.login error:', err);
        if (err) return res.redirect('*');
        //logged in
        return res.redirect('/login');
      });
    });
  });

  app.get('/login', function(req, res) {
    if (req.user) {
      console.log('login page, logged in:', req.user.values);
    }

    res.render('login');
  });

  //POST:
  //email
  //password
  app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }));

  app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });
};
