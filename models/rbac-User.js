var Db = require('../lib/Db.js');
var db = new Db();
var Role = require('../models/rbac-Role.js');

function User(opt) {
  var hash = require('crypto').createHash('sha1');
  for (var prop in opt) {
    this[prop] = opt[prop];
  }
  if (this.name == 'root' || this.name == 'blacklist')
    return null;
  if (typeof this.password !== 'undefined')
    this.password = hash.update(this.password, 'utf8').digest('base64');
  return this;
}

User.prototype.create = function(callback) {
  var self = this;
  db.insert(self, 'Users', {}, function (err) {
    callback(err);
    return self;
  });
};

User.prototype.auth = function(callback) {
  var self = this;
  db.find({name: this.name, password: this.password}, 'Users', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    else if (docs.length < 1) {
      return callback({err: 'AUTH_FAILED', msg: 'Error: Invalid username or password'});
    } else {
      self.desc = docs[0].desc;
      self.roles = docs[0].roles;
      return callback();
    }
  });
};

User.prototype.createSession = function(role, callback) {
  if ( typeof this.roles !== 'undefined' 
    && this.roles.indexOf(role) >= 0);
    return callback({err: 'NO_ROLE', msg: 'Error: This user has no role available.'});
  db.find({name: role}, 'Roles', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    else if (docs.length < 1)
      return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Cannot find role "' + role + '"'});

    var r = new Role(docs[0]);
    return callback(null, r);
  });
};

module.exports = User;