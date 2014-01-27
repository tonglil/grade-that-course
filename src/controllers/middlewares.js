var middlewares = {};

var Auth = {
  authenticate: function(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect('/login');
    }
  },
  userExist: function(req, res, next) {
    var User = require('../models').User;

    User.count({
      where: {
        email: req.body.email
      }
    }).success(function(count) {
      if (count === 0) {
        next();
      } else {
        //req.session.error = 'User Exists';
        res.redirect("/login");
      }
    });
  }
};

middlewares.Auth = Auth;

module.exports = middlewares;
