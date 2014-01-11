var User = require('../models/rbac-User.js');
var Role = require('../models/rbac-Role.js');
var Root = require('../models/rbac-Root.js');

module.exports = function (app) {
  app.post('/rbac/login', function (req, res) {
    req.session.user = new User({name: req.body.name, password: req.body.password});
    req.session.user.auth(function (err) {
      if (err) {
        delete req.session.user;
        res.send(err);
      } else {
        res.send({ok: true, name: req.session.user.name, desc: req.session.user.desc});
      }
    });
  });

  app.post('/rbac/register', function (req, res) {
    if (req.body.user_name == 'root' || req.body.user_name == 'blacklist')
      return res.send({err: 'Error: Invalid user name.'})
    var user = new User({name: req.body.user_name, password: req.body.user_password, desc: req.body.user_desc});
    user.create(function (err) {
      if (err) {
        res.send(err);
      } else {
        req.session.user = user;
        res.send({ok: true});
      }
    });
  });

  app.get('/rbac/status', function (req, res) {
    if (typeof req.session.user !== 'undefined')
      res.send({name: req.session.user.name, desc: req.session.user.desc});
    else
      res.status(204).send();
  });

  app.get('/rbac/logout', function (req, res) {
    if (typeof req.session.user !== 'undefined') {
      delete req.session.user;
      delete req.session.role;
      res.status(204).send();
    } else
      res.status(403).send();
  });

  app.get('/rbac/session/new', function (req, res) {
    if (typeof req.query.r === 'undefined')
      return res.status(400).send();
    if (typeof req.session.user !== 'undefined') {
      var user = new User(req.session.user);
      user.createSession(req.query.r, function (err, role) {
        if (err)
          return res.send(err);
        req.session.role = role;
        return res.status(204).send();
      });
    } else
      return res.send({err: 'Error: you are not logged in.'});
  });

  app.get('/rbac/session/end', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      delete req.session.role;
      return res.status(204).send();
    } else
      return res.send({err: 'Error: You do not have an active session.'});
  });
}