var Db = require('../lib/Db.js');
var db = new Db();

function User(name, password, desc) {
  var hash = require('crypto').createHash('sha1');
  if (name == 'root' || name == 'blacklist')
    return null;
  this.name = name;
  this.desc = desc;
  if (typeof password !== 'undefined')
    this.password = hash.update(password, 'utf8').digest('base64');
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
      return callback();
    }
  });
};

User.prototype.createSession = function(role) {
  return (typeof this.roles !== 'undefined' 
       && this.roles.indexOf(rolename) >= 0);
};

module.exports = User;