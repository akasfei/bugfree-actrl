var Db = require('../lib/Db.js');
var Role = require('../models/rbac-Role.js');
var db = new Db();

function Root() {
  return this;
}

Root.prototype.newRole = function(name, desc, ext, callback) {
  var self = this;
  var role = new Role({name: name, desc: desc});
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
  if (right === 'n') {
    db.find({name: subject}, 'Roles', {limit: 1}, function (err, docs) {
      if (err)
        return callback(err);
      if (docs.length < 1)
        return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + subject + '\' not found.'});
      var role = docs[0];

      if (typeof role.ext !== 'undefined') {
        if (role.ext.indexOf('root') >= 0)
          return callback({err: 'SUBJECT_HAS_PERM', msg: 'Error: You have already granted subject \'' + right + '\' permission.'});
        role.ext.push('root');
      }
      else
        role.ext = ['root'];

      db.update({name: role.name}, role, 'Roles', function (err) {
        return callback(err);
      });
    });
  } else {
    db.find({name: object}, 'Objects_rbac', {limit: 1}, function (err, docs) {
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
  }
};

Root.prototype.recind = function(subject, object, right, callback) {
  var self = this;
  if (right === 'n') {
    db.find({name: subject}, 'Roles', {limit: 1}, function (err, docs) {
      if (err)
        return callback(err);
      if (docs.length < 1)
        return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + subject + '\' not found.'});
      var role = docs[0];

      if (typeof role.ext !== 'undefined') {
        var index;
        if ( ( index = role.ext.indexOf('root') ) < 0)
          return callback({err: 'TARGET_NO_PERM', msg: 'Error: Target subject does not have \'' + right + '\' permission.'});
        role.ext.splice(index, 1);
        if (role.ext.length < 1)
          delete role.ext;
      }
      else
        return callback({err: 'TARGET_NO_PERM', msg: 'Error: Target subject does not have \'' + right + '\' permission.'});

      db.update({name: role.name}, role, 'Roles', function (err) {
        return callback(err);
      });
    });
  } else {
    db.find({name: object}, 'Objects_rbac', {limit: 1}, function (err, docs) {
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
  }
};

Root.prototype.bindRole = function(user, role, callback) {
  var self = this;
  db.find({name: user}, 'Users', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'USER_NOT_FOUND', msg: 'Error: User \'' + user + '\' not found.'});
    var usr = docs[0];

    if (typeof usr.roles !== 'undefined') {
      if (usr.roles.indexOf(role) >= 0)
        return callback({err: 'USER_HAS_ROLE', msg: 'Error: You have already binded user with role \'' + role + '\'.'});
      db.find({name: role}, 'Roles', {limit: 1}, function (err, roledoc) {
        if (err)
          return callback(err);
        if (roledoc.length < 1)
          return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + role + '\' not found.'});

        var r = roledoc[0];
        if (typeof r.conflicts === 'undefined') {
          usr.roles.push(role);
        } else {
          for (var i = 0; i < usr.roles.length; i++) {
            if (r.conflicts.indexOf(usr.roles[i]) >= 0)
              return callback({err: 'ROLE_CONFLICT', msg: 'Error: New role "' + role + '" conflicts with existing role "' + usr.roles[i] + '"'})
          }
        }
        db.update({name: user}, usr, 'Users', function (err) {
          return callback(err);
        });
      });
    } else {
      db.find({name: role}, 'Roles', {limit: 1}, function (err, roledoc) {
        if (err)
          return callback(err);
        if (roledoc.length < 1)
          return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + role + '\' not found.'});

        usr.roles = [role];
        db.update({name: user}, usr, 'Users', function (err) {
          return callback(err);
        });
      });
    }
  });
};

Root.prototype.unbindRole = function(user, role, callback) {
  var self = this;
  db.find({name: user}, 'Users', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'USER_NOT_FOUND', msg: 'Error: User \'' + user + '\' not found.'});
    var usr = docs[0];

    if (typeof usr.roles !== 'undefined') {
      var index;
      if ( (index = usr.roles.indexOf(role)) >= 0 )
        usr.roles.splice(index, 1);
      else
        return callback({err: 'ROLE_NOT_BINDED', msg: 'Error: This user is not binded to role "' + role + '".'}); 
    }
    else
      return callback({err: 'USER_NOT_ROLE', msg: 'Error: Target user is not binded with role \'' + right + '\'.'});

    db.update({name: user}, usr, 'Users', function (err) {
      return callback(err);
    });
  });
};

Root.prototype.extendRole = function(role, supRole, callback) {
  var self = this;
  if (role == supRole)
    return callback({err: 'NO_EXTEND_ITSELF', msg: 'Error: Role cannot extend itself.'}); 
  db.find({name: role}, 'Roles', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + role + '\' not found.'});
    var r = docs[0];

    if ( typeof r.conflicts !== 'undefined'
      && r.conflicts.indexOf(supRole) >= 0)
      return callback({err: 'ROLE_CONFLICT', msg: 'Error: This role "' + role + '" conflicts with role to extend: "' + supRole + '"'}) 

    if (typeof r.ext !== 'undefined') {
      if (r.ext.indexOf(supRole) >= 0)
        return callback({err: 'ROLE_ALREADY_EXTENDS', msg: 'Error: This role already ext role \'' + supRole + '\'.'});
      db.find({name: supRole}, 'Roles', {limit: 1}, function (err, srdoc) {
        if (err)
          return callback(err);
        if (srdoc.length < 1)
          return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + supRole + '\' not found.'});

        var sr = srdoc[0];
        if (typeof sr.conflicts === 'undefined') {
          r.ext.push(role);
        } else {
          for (var i = 0; i < r.ext.length; i++) {
            if (sr.conflicts.indexOf(r.ext[i]) >= 0)
              return callback({err: 'ROLE_CONFLICT', msg: 'Error: Extending "' + supRole + '" conflicts with current extended role "' + r.ext[i] + '"'})
          }
        }
        db.update({name: role}, r, 'Roles', function (err) {
          return callback(err);
        });
      });
    } else {
      db.find({name: supRole}, 'Roles', {limit: 1}, function (err, srdoc) {
        if (err)
          return callback(err);
        if (srdoc.length < 1)
          return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + supRole + '\' not found.'});
        r.ext = [supRole];
        db.update({name: role}, r, 'Roles', function (err) {
          return callback(err);
        });
      });
    }
  });
};

Root.prototype.reduceRole = function(role, supRole, callback) {
  var self = this;
  db.find({name: role}, 'Roles', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'ROLE_NOT_FOUND', msg: 'Error: Role \'' + role + '\' not found.'});
    var r = docs[0];

    if (typeof r.ext !== 'undefined') {
      var index;
      if ( (index = r.ext.indexOf(supRole)) >= 0 )
        r.ext.splice(index, 1);
      else
        return callback({err: 'ROLE_NOT_EXTENDS', msg: 'Error: This role does not extend role "' + supRole + '".'}); 
    }
    else
      return callback({err: 'ROLE_NOT_EXTENDS', msg: 'Error: This role does not extend any other role.'});

    db.update({name: role}, r, 'Roles', function (err) {
      return callback(err);
    });
  });
};

module.exports = Root;