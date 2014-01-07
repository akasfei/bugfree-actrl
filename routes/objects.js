var Subject = require('../models/Subject.js');
var Db = require('../lib/Db.js');
var ObjView = require('../models/ObjView.js');

module.exports = function (app) {
  app.post('/objects/new', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      var subject = new Subject(req.session.subject.name);
      subject.newObj(req.body.name, req.body.desc, function (err, newObj) {
        if (err)
          return res.send(err);
        var view = new ObjView(newObj);
        res.status(201).send({newobj: view.render(req.session.subject.name)});
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.get('/objects/list', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      var db = new Db();
      db.find({}, 'Objects', {}, function (err, objList) {
        if (err) {
          return res.send(err);
        }
        if (objList.length < 1)
          return res.status(204).send();
        var resdata = {objects: []};
        for (var i = 0; i < objList.length; i++) {
          var view = new ObjView(objList[i]);
          resdata.objects.push(view.render(req.session.subject.name));
        }
        res.send(resdata);
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.get('/object', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      var subject = new Subject(req.session.subject.name);
      subject.read(req.query.n, function (err, data) {
        if (err)
          return res.send(err);
        else
          return res.send(data);
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.post('/objects/write', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      var subject = new Subject(req.session.subject.name);
      subject.write(req.body.obj_name, req.body.obj_new_desc, function (err) {
        if (err)
          res.send(err);
        return res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.get('/objects/remove', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      var subject = new Subject(req.session.subject.name);
      subject.remove(req.body.obj_name, function (err) {
        if (err)
          res.send(err);
        return res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });
}