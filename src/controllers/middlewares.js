var middlewares = {};

middlewares.Auth = {
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
  },

  user: function(req, res, next) {
    res.locals.user = req.user;
    next();
  }
};

middlewares.Prototypes = {
  string: String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }
};

middlewares.Errors = {
  log: function(err, req, res, next) {
    console.error(err);
    //TODO: stack?
    console.error('stack', err.stack);
    next(err);
  },

  clientHandler: function(err, req, res, next) {
    if (req.xhr) {
      res.send(500, {
        error: 'Something went wrong'
      });
    } else {
      next(err);
    }
  },

  errorHandler: function(err, req, res, next) {
    res.status(500);
    res.send(err.stack);
  }
};

module.exports = middlewares;
