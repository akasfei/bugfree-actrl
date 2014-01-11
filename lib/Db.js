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
  this.index();
  return this;
}

Db.prototype.index = function () {
  var _this = this;
  this.client.connect(this.mongourl, function (err, db) {
    assert.equal(null, err);
    assert.ok(db != null);
    db.collection('Subjects').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
      assert.equal(null, err);
      db.collection('Objects').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
        assert.equal(null, err);
        db.collection('Users').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
          assert.equal(null, err);
          db.collection('Roles').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
            assert.equal(null, err);
            db.collection('Objects_rbac').ensureIndex({name: 1}, {unique: true}, function (err, indexName) {
              assert.equal(null, err);
              return;
            });
          });
        });
      });
    });
  });
};

module.exports = Db;
