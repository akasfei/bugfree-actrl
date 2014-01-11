var Db = require('../lib/Db.js');
var db = new Db();

function Role(name, desc, extends) {
  if (name == 'root' || name == 'blacklist')
    return null;
  this.name = name;
  this.desc = desc;
  this.extends = extends;
  return this;
}

Role.prototype.create = function(callback) {
  var self = this;
  db.insert(self, 'Roles', {}, function (err) {
    callback(err);
    return self;
  });
};



Role.prototype.new = function(objname, desc, callback) {
  if (typeof this.extends === 'undefined' || this.extends.indexOf('root') < 0)
    return callback({err: 'ROLE_UNAUTHORIZED', msg: 'Error: Role is not authorized to create objects.'});

  var object = {
    name: objname, 
    desc: desc, 
    access: {
      c: {},
      r: {},
      w: {},
      x: {}
    }
  };

  db.insert(object, 'Objects', {}, function (err) {
    if (err)
      return callback(err);
    else
      return callback(null, object);
  });
};

Role.prototype.remove = function(object, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access['c'][self.name] !== 'undefined') {
      db.remove({name: obj.name}, 'Objects', {}, function (err) {
        return callback(err);
      });
    } else
      return callback({err: 'ROLE_NOT_AUTHORIZED', msg: 'Error: Current role is not authorized to control object \'' + obj.name + '\''});
  });
};

Role.prototype.read = function(object, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access['r'][self.name] !== 'undefined') {
      return callback(null, obj);
    } else
      return callback({err: 'ROLE_NOT_AUTHORIZED', msg: 'Error: Current role is not authorized to read object \'' + object + '\''});
  });
};

Role.prototype.write = function(object, newDesc, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access['w'][self.name] !== 'undefined') {
      db.update({name: obj.name}, {$set: {desc: newDesc}}, 'Objects', {}, function (err) {
        return callback(err);
      });
    } else
      return callback({err: 'ROLE_NOT_AUTHORIZED', msg: 'Error: Current role is not authorized to write object \'' + obj.name + '\''});
  });
};

module.exports = Role;