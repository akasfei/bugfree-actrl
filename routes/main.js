var Subject = require('../models/Subject.js');

module.exports = function (app) {
  app.post('/login', function (req, res) {
    var subject = new Subject(req.body.name, req.body.password);
    subject.auth(function (err) {
      if (err) {
        res.send(err);
      } else {
        req.session.subject = subject;
        res.send({ok: true, name: subject.name, desc: subject.desc});
      }
    });
  });

  app.get('/status', function (req, res) {
    if (typeof req.session.subject !== 'undefined')
      res.send({name: req.session.subject.name, desc: req.session.subject.desc});
    else
      res.status(204).send();
  });

  app.get('/logout', function (req, res) {
    if (typeof req.session.subject !== 'undefined') {
      delete req.session.subject;
      res.status(204).send();
    } else
      res.status(403).send();
  });
}