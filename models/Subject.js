var Db = require('../lib/Db.js');
var db = new Db();

function Subject(name, password, desc) {
  var hash = require('crypto').createHash('sha1');
  this.name = name;
  this.desc = desc;
  this.password = hash.update(password, 'utf8').digest('base64');
  return this;
}

Subject.prototype.create = function(callback) {
  var self = this;
  db.insert(self, 'Subjects', {}, function (err) {
    callback(err);
    return self;
  });
};

Subject.prototype.auth = function(callback) {
  db.find({name: this.name, password: this.password}, 'Subjects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    else if (docs.length < 1) {
      return callback({err: 'AUTH_FAILED', msg: 'Error: Invalid username or password'});
    } else {
      this.desc = docs[0].desc;
      return callback();
    }
  });
};

Subject.prototype.newObj = function(objname, desc, callback) {
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
  object.c[this.name] = {
    grantors: ['root'],
    cgrantors: ['root']
  };
  object.r[this.name] = {
    grantors: ['root'],
    cgrantors: ['root']
  };
  object.w[this.name] = {
    grantors: ['root'],
    cgrantors: ['root']
  };
  object.x[this.name] = {
    grantors: ['root'],
    cgrantors: ['root']
  };

  db.insert(object, 'Objects', {}, function (err) {
    return callback(err);
  });
};

Subject.prototype.grant = function(subject, object, right, giveC, callback) {
  var self = this;

  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];
    if ( obj.access[right][self.name] 
      && obj.access[right][self.name].cgrantors 
      && obj.access[right][self.name].cgrantors.length > 0) {
      if (typeof obj.access[right][subject] === 'undefined')
        // When the target subject doesn't have this right before
        obj.access[right][subject] = {};
      else if (detectCircuit(obj, right, subject, self.name))
        return callback({err: 'GRANT_CIRCUIT', msg: 'Error: You cannot grant right to your right\'s (in)direct grantor.'});
      if ( typeof obj.access[right][subject].grantors === 'undefined' 
        || obj.access[right][subject].grantors.length < 1) {
        // If no array is present then create a new one
        obj.access[right][subject].grantors = [subject];
        if (giveC)
          obj.access[right][subject].cgrantors = [subject];
      } else {
        if (obj.access[right][subject].grantors.indexOf(self.name))
          return callback({err: 'SUBJECT_HAS_RIGHT', msg: 'Error: You have already granted subject right \'' + right + '\''});
        obj.access[right][subject].grantors.push(subject);
        if (giveC) {
          if (typeof obj.access[right][subject].cgrantors !== 'undefined')
            obj.access[right][subject].cgrantors.push(subject);
          else
            obj.access[right][subject].cgrantors = [subject];
        }
      }
    } else {
      return callback({err: 'SUBJECT_NOT_CTRLER', msg: 'Error: Current subject cannot control right \'' + right + '\''});
    }
    
    db.update({name: obj.name}, obj, 'Objects', function (err) {
      return callback(err);
    });
  });
};

var detectCircuit = function (obj, right, subject, grantor) {
  for (var i = 0; i < obj.access[right][grantor].cgrantors.length; i++) {
    var thisGrantor = obj.access[right][grantor].cgrantors[i];
    if (thisGrantor == 'root')
      return false;
    if (obj.access[right][grantor].cgrantors.indexOf(subject) >= 0)
      return true;
    return detectCircuit(obj, right, subject, thisGrantor);
  }
}

Subject.prototype.recind = function(subject, object, right, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];
  
    if (obj.access[right][self.name] && 
        obj.access[right][self.name][cgrantors] && 
        obj.access[right][self.name][cgrantors].length > 0) {
      if ( typeof obj.access[right][subject] === 'undefined' 
        || typeof obj.access[right][subject].grantors === 'undefined' 
        || obj.access[right][subject].grantors.length < 1)
          return callback({err: 'TARGET_NO_ACCESS', msg: 'Error: Target subject does not have right \'' + right + '\''});
      else {
        var index = obj.access[right][subject].grantors.indexOf(subject);
        if (index >= 0) {
          obj.access[right][subject].grantors.splice(index, 1);
          if ( typeof obj.access[right][subject].cgrantors !== 'undefined' 
            && (index = obj.access[right][subject].cgrantors.indexOf(subject)) >= 0) {
              obj.access[right][subject].cgrantors.splice(index, 1);
              if (obj.access[right][subject].cgrantors.length < 1)
                recindAll(obj, right, subject);
          }
          if (obj.access[right][subject].grantors.length < 1)
            delete obj.access[right][subject];
        } else
          return callback({err: 'SUBJECT_NOT_GRANTED', msg: 'Error: Target subject does not have right \'' + right + '\''}); 
      }
    } else {
      return callback({err: 'SUBJECT_NOT_CTRLER', msg: 'Error: Current subject cannot control right \'' + right + '\''});
    }
    
    db.update({name: obj.name}, obj, 'Objects', function (err) {
      return callback(err);
    });
  });
};

var recindAll = function (obj, right, grantor) {
  for (var subject in obj.access[right]) {
    var index;
    if (typeof obj.access[right][subject].grantors !== 'undefined') {
      index = obc.access[right][subject].grantors.indexOf(grantor);
      if (index >= 0) {
        obj.access[right][subject].grantors.splice(index, 1);
        if ( typeof obj.access[right][subject].cgrantors !== 'undefined' 
        && ( index = obj.access[right][subject].cgrantors.indexOf(grantor)) >= 0) {
            obj.access[right][subject].cgrantors.splice(index, 1);
            if (obj.access[right][subject].cgrantors.length < 1)
              recindAll(obj, right, subject);
        }
        if (obj.access[right][subject].grantors.length < 1)
          delete obj.access[right][subject];
      }
    } else {
      delete obj.access[right][subject];
    }
  }
}

Subject.prototype.remove = function(object, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof obj.access['c'][self.name] !== 'undefined') {
      db.remove({name: object}, {}, function (err) {
        return callback(err);
      });
    } else
      return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject is not controler of object \'' + object + '\''});
  });
};

Subject.prototype.read = function(object, callback) {
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
      return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject cannot read object \'' + object + '\''});
  });
};

Subject.prototype.write = function(object, newDesc, callback) {
  var self = this;
  db.find({name: object}, 'Objects', {limit: 1}, function (err, docs) {
    if (err)
      return callback(err);
    if (docs.length < 1)
      return callback({err: 'OBJECT_NOT_FOUND', msg: 'Error: Object \'' + object + '\''});
    var obj = docs[0];

    if (typeof object.access['r'][self.name] !== 'undefined') {
      db.update({name: object}, {$set: {desc: newDesc}}, 'Objects', function (err) { // TODO: look up mongodb docs and verify
        return callback(err);
      });
    } else
      return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject cannot read object \'' + object + '\''});
  });
};

module.exports = Subject;