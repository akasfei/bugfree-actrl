var Subject = require('../models/Subject.js');

module.exports = function (app) {
  app.post('/objects/new', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      req.session.subject.newObj(req.body.obj_name, req.body.obj_desc, function (err) {
        return res.send(err);
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.get('/object', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      req.session.subject.read(req.query.n, function (err, data) {
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
      req.session.subject.write(req.body.obj_name, req.body.obj_new_desc, function (err) {
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
      req.session.subject.remove(req.body.obj_name, function (err) {
        if (err)
          res.send(err);
        return res.status(204).send();
      });
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });
}