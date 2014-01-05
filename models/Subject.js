function Subject(name, password, desc) {
  var hash = require('crypto').createHash('sha1');
  this.name = name;
  this.desc = desc;
  this.password = hash.update(password, 'utf8').digest('base64');
  return this;
}

Subject.prototype.auth = function(callback) {
  // TODO: Connect the database, verify subject name and password, and retrieve subject desc
  return callback(err);
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

  // TODO: Save object to database

  return callback(err);
};

Subject.prototype.grant = function(subject, object, right, giveC, callback) {
  var self = this;
  var obj = object; // TODO: Retrieve object info from database

  if ( obj.access[right][self.name] 
    && obj.access[right][self.name][cgrantors] 
    && obj.access[right][self.name][cgrantors].length > 0) {
    if (typeof obj.access[right][subject] === 'undefined')
      // When the target subject doesn't have this right before
      obj.access[right][subject] = {};

    if ( typeof obj.access[right][subject][giveC ? "cgrantors": "grantors"] === 'undefined' 
      || obj.access[right][subject][giveC ? "cgrantors": "grantors"].length < 1) {
      // If no array is present then create a new one
      obj.access[right][subject]["grantors"] = [subject];
      if (giveC)
        obj.access[right][subject]["cgrantors"] = [subject];
    } else {
      obj.access[right][subject]["grantors"].push(subject);
      if (giveC)
        obj.access[right][subject]["cgrantors"].push(subject);
    }
  } else {
    return callback({{err: 'SUBJECT_NOT_CTRLER', msg: 'Error: Current subject cannot control right \'' + right + '\''});
  }
  // TODO: Save the modified object to database
  return callback();
};

Subject.prototype.recind = function(subject, object, right, callback) {
  var self = this;
  var obj = object; // TODO: Retrieve object info from database
  
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
              // TODO: Remove other subjects granted by this subject
        }
        if (obj.access[right][subject].grantors.length < 1)
          delete obj.access[right][subject];
      } else
        return callback({err: 'SUBJECT_NOT_GRANTED', msg: 'Error: Target subject does not have right \'' + right + '\''}); 
    }
  } else {
    return callback({err: 'SUBJECT_NOT_CTRLER', msg: 'Error: Current subject cannot control right \'' + right + '\''});
  }
  // TODO: Save the modified object to database
  return callback();
};

Subject.prototype.remove = function(object, callback) {
  var self = this;
  var obj = object; // TODO: Retrieve object info from database

  if (typeof object.access['c'][self.name] !== 'undefined') {
    // TODO: Remove the object
    return callback();
  } else
    return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject is not controler of object \'' + object + '\''});
};

Subject.prototype.read = function(object, callback) {
  var self = this;
  var obj = object; // TODO: Retrieve object info from database

  if (typeof object.access['r'][self.name] !== 'undefined') {
    // TODO: Retrieve the object
    return callback(null, data);
  } else
    return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject cannot read object \'' + object + '\''});
};

Subject.prototype.write = function(object, newDesc, callback) {
  var self = this;
  var obj = object; // TODO: Retrieve object info from database

  if (typeof object.access['r'][self.name] !== 'undefined') {
    // TODO: Update the object
    return callback();
  } else
    return callback({err: 'SUBJECT_NOT_AUTHORIZED', msg: 'Error: Current subject cannot read object \'' + object + '\''});
};

module.exports = Subject;