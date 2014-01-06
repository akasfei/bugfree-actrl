var assert = require('assert');

var params = {
  "hostname":"localhost",
  "port":27017,
  "username":"",
  "password":"",
  "name":"",
  "db":"actrl"
};

function Db () {
  //var Server = this.mongodb.Server;
  this.mongodb = require('mongodb');
  this.mongourl = "mongodb://" + params.hostname + ":" + params.port + "/" + params.db;
  this.client = this.mongodb.MongoClient;
  return this;
}

Db.prototype.insert = function (data, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).insert(data, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(err, data)
      return self;
    });
  });
}

Db.prototype.remove = function (query, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).remove(query, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(null, data);
      return self;
    });
  });
}

Db.prototype.update = function (query, data, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).update(query, data, options, function (err, data) {
      if (err) {
        callback(err);
        return self;
      }
      db.close();
      callback(null, data);
      return self;
    });
  });
}

Db.prototype.find = function (query, coll, options, callback) {
  var self = this;
  self.client.connect(self.mongourl, function (err, db) {
    if (err) {
      callback(err);
      return self;
    }
    if (typeof db === 'undefined') {
      console.log('Failed to establish Mongodb connection.');
      return self;
    }

    db.collection(coll).find(query, options).toArray(function (err, docs) {
      if (err) {
        return self;
        callback(err);
      }
      db.close();
      callback(null, docs);
      return self;
    });
  });
}

Db.prototype.init = function () {
  var _this = this;
  this.client.connect(this.mongourl, function (err, db) {
    assert.equal(null, err);
    assert.ok(db != null);
    _this.initUser(db, function () {
      _this.initLocation(db, function () {
        db.close();
        return this;
      });
    })
  });
}

Db.prototype.initUser = function (db, callback) {
  db.collection('users').find({'name': 'super_ops', 'admin': true}).toArray(function (err, docs) {
    var UserEntry = require('../models/UserEntry.js');
    if (err)
      this.error(err);
    if (docs.length < 1) {
      console.log('Default admin account not found.')
      new UserEntry({
        'gh_email': 'super-ops@ssiops.org',
        'gh_password': 'SSI_SUPER_OPS',
        'gh_name': 'super_ops'
      }).setAdmin().store(function (err) {
        assert.equal(null, err);
        db.collection('users').ensureIndex({'email': 1}, {unique:true, background:true, dropDups:true, w:1}, function (err, indexName) {
          assert.equal(null, err);
          return callback();
        });
      });
    } else {
      return callback();
    }
  });
}

Db.prototype.initLocation = function (db, callback) {
  db.collection('location').ensureIndex({'loc': 'geoHaystack', 'type': 1}, {background:true, bucketSize: 1}, function (err, indexName) {
    assert.equal(null, err);
    db.collection('location_history').ensureIndex({'loc': 'geoHaystack', 'type': 1}, {background:true, bucketSize: 1}, function (err, indexName) {
      assert.equal(null, err);
      return callback();
    });
  });
}

module.exports = Db;
