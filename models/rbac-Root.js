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

module.exports = Root;