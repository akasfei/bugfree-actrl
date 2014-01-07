var Subject = require('../models/Subject.js');

module.exports = function (app) {
  app.post('/subjects/new', function (req, res) {
    var subject = new Subject(req.body.sbj_name, req.body.sbj_password, req.body.sbj_desc);
    subject.create(function (err) {
      if (err) {
        res.send(err);
      } else {
        req.session.subject = subject;
        res.send({ok: true});
      }
    });
  });

  app.get('/subjects/grant', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      if ( typeof req.query.t !== 'undefined' 
        && typeof req.query.o !== 'undefined'
        && typeof req.query.r !== 'undefined' ) {
        var subject = new Subject(req.session.subject.name);
        subject.grant(req.query.t, req.query.o, req.query.r, req.query.c == 'true', function (err) {
          if (err)
            res.send(err);
          return res.status(204).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });

  app.get('/subjects/recind', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      if ( typeof req.query.t !== 'undefined' 
        && typeof req.query.o !== 'undefined'
        && typeof req.query.r !== 'undefined' ) {
        var subject = new Subject(req.session.subject.name);
        subject.recind(req.query.t, req.query.o, req.query.r, function (err) {
          if (err)
            res.send(err);
          return res.status(204).send();
        });
      } else
        return res.status(400).send();
    } else {
      return res.send({err: 'Error: you are not logged in.'});
    }
  });
}