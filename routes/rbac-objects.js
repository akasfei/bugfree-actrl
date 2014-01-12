var Db = require('../lib/Db.js');
var User = require('../models/rbac-User.js');
var Role = require('../models/rbac-Role.js');
var Root = require('../models/rbac-Root.js');
var ObjView = require('../models/rbac-ObjView.js');
var AccView = require('../models/rbac-AccView.js');

module.exports = function (app) {
  app.post('/rbac/objects/new', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      var role = new Role(req.session.role);
      role.new(req.body.name, req.body.desc, function (err, newObj) {
        if (err)
          return res.send(err);
        res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: No active sessions.'});
    }
  });

  app.get('/rbac/objects/list', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      var db = new Db();
      db.find({}, 'Objects_rbac', {sort: {'_id': '1'}}, function (err, objList) {
        if (err) {
          return res.send(err);
        }
        if (objList.length < 1)
          return res.status(204).send();
        var resdata = {objects: []};
        for (var i = 0; i < objList.length; i++) {
          var view = new ObjView(objList[i]);
          resdata.objects.push(view.render(req.session.role));
        }
        res.send(resdata);
      });
    } else {
      return res.send({err: 'Error: No active sessions.'});
    }
  });

  app.get('/rbac/object', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      var role = new Role(req.session.role);
      role.read(req.query.n, function (err, data) {
        if (err)
          return res.send(err);
        else
          return res.send(data);
      });
    } else {
      return res.send({err: 'Error: No active sessions.'});
    }
  });

  app.post('/rbac/objects/write', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      var role = new Role(req.session.role);
      role.write(req.body.obj_name, req.body.obj_new_desc, function (err) {
        if (err)
          return res.send(err);
        return res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: No active sessions.'});
    }
  });

  app.get('/rbac/objects/remove', function (req, res) {
    if (typeof req.session.role !== 'undefined') {
      var role = new Role(req.session.role);
      role.remove(req.query.n, function (err) {
        if (err)
          return res.send(err);
        return res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: No active sessions.'});
    }
  });
}