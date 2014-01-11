var Db = require('../lib/Db.js');
var User = require('../models/rbac-User.js');
var Role = require('../models/rbac-Role.js');
var Root = require('../models/rbac-Root.js');
var ObjView = require('../models/rbac-ObjView.js');
var AccView = require('../models/rbac-AccView.js');

var root = new Root();

module.exports = function (app) {
  app.post('/rbac/root/auth', function (req, res) {
    if (req.body.code === 'QWERTY') {
      req.session.root = new Date();
      return res.status(201).send();
    } else {
      return res.status(403).send();
    }
  });

  app.post('/rbac/root/roles/new', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if (req.body.role_name == 'root' || req.body.role_name == 'blacklist')
        return res.send({err: 'Error: Invalid subject name.'});
      root.newRole(req.body.role_name, req.body.role_desc, [], function (err) {
        if (err) {
          res.send(err);
        } else {
          res.status(201).send();
        }
      });
    } else {
      return res.status(403).send();
    }
  });

  app.post('/rbac/root/roles/remove', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      root.removeRole(req.body.role_name, function (err) {
        if (err) {
          res.send(err);
        } else {
          res.status(201).send();
        }
      });
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/objects/access', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      var db = new Db();
      db.find({}, 'Roles', {}, function (err, roles) {
        if (err) {
          return res.send(err);
        }
        if (roles.length < 1)
          return res.status(204).send();

        db.find({name: req.query.n}, 'Objects_rbac', {limit: 1}, function (err, docs) {
          if (err)
            return callback(err);
          if (docs.length < 1)
            return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + req.query.n + '\''});
          var obj = docs[0];

          var accList = [];
          var objview = new ObjView(obj);

          for (var i = 0; i < roles.length; i++) {
            var view = new AccView(roles[i].name, objview.renderAccess(roles[i]))
            accList.push(view.render());
          }
          res.send({list: accList});
        });
      });
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/grant', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.t !== 'undefined' 
        && typeof req.query.o !== 'undefined'
        && typeof req.query.r !== 'undefined' ) {
        root.grant(req.query.t, req.query.o, req.query.r, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/recind', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.t !== 'undefined' 
        && typeof req.query.o !== 'undefined'
        && typeof req.query.r !== 'undefined' ) {
        root.recind(req.query.t, req.query.o, req.query.r, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/bind', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.r !== 'undefined' 
        && typeof req.query.u !== 'undefined' ) {
        root.bindRole(req.query.u, req.query.r, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/unbind', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.r !== 'undefined' 
        && typeof req.query.u !== 'undefined' ) {
        root.unbindRole(req.query.u, req.query.r, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/extend', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.r !== 'undefined' 
        && typeof req.query.sr !== 'undefined' ) {
        root.bindRole(req.query.r, req.query.sr, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });

  app.get('/rbac/root/roles/reduce', function (req, res) {
    if (typeof req.session.root !== 'undefined') {
      if ( typeof req.query.r !== 'undefined' 
        && typeof req.query.sr !== 'undefined' ) {
        root.bindRole(req.query.r, req.query.sr, function (err) {
          if (err)
            return res.send(err);
          return res.status(201).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.status(403).send();
    }
  });
}