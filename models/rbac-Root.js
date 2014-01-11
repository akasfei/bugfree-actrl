var Db = require('../lib/Db.js');
var db = new Db();

function Root() {
  return this;
}

Root.prototype.newRole = function(name, desc, extends, callback) {
  var self = this;
  var role = new Role(name, desc, extends);
  role.create(function (err) {
    return callback(err);
  });
};

Root.prototype.removeRole = function(name, callback) {
  var self = this;
  db.remove({name: name}, 'Roles', {}, function (err) {
    return callback(err);
  });
};

Root.prototype.grant = function(subject, object, right, callback) {
  var self = this;

  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access[right][subject] !== 'undefined')
      return callback({err: 'SUBJECT_HAS_PERM', msg: 'Error: You have already granted subject \'' + right + '\' permission.'});
    // Record time for future reference.
    obj.access[right][subject] = new Date().getTime();
    
    db.update({name: obj.name}, obj, 'Objects', function (err) {
      return callback(err);
    });
  });
};

Root.prototype.recind = function(subject, object, right, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access[right][subject] === 'undefined')
      return callback({err: 'TARGET_NO_PERM', msg: 'Error: Target subject does not have \'' + right + '\' permission.'});
    delete obj.access[right][subject];
    
    db.update({name: obj.name}, obj, 'Objects', function (err) {
      return callback(err);
    });
  });
};

module.exports = Root;