var Db = require('../lib/Db.js');

function RoleTree() {
  this.tree = [];
  this.hash = {};
  return this;
}

RoleTree.prototype.render = function() {
  var self = this;
  if (self.tree.length < 1)
    return '<p>Tree is empty.</p>';
  var res = '<ul>\n'
  for (var i = 0; i < self.tree.length; i++) {
    res += renderNode(self.tree[i]);
  }
  res += '\n</ul>\n';
  return res;
};

RoleTree.prototype.parse = function(callback) {
  var self = this;
  var db = new Db();
  db.find({}, 'Roles', {}, function (err, roles) {
    if (err)
      return callback(err);
    if (roles.length < 1)
      return callback({err: 'NO_ROLES_FOUND', msg: 'Error: No roles were found.'});

    while (roles.length > 0) {
      var role = roles.pop();
      if (typeof role.ext === 'undefined' || typeof role.ext.length < 1) {
        self.tree.push(parseRole(role));
        self.hash[role.name] = self.tree.length - 1;
        continue;
      }
      var i = role.ext.length - 1;
      var thisExt;
      if (typeof self.hash[role.ext[i]] === 'undefined') {
        self.tree.push(parseRole(findRole(roles, role.ext[i])));
        self.hash[role.ext[i]] = self.tree.length - 1;
        thisExt = self.tree[self.tree.length - 1];
      } else {
        thisExt = self.tree[self.hash[role.ext[i]]];
      }
      for (i = role.ext.length - 2; i >= 0; i--) {
        if (typeof thisExt.children === 'undefined' || thisExt.children.length < 1)
          thisExt.children = [];
        if (typeof self.hash[role.ext[i]] === 'undefined') {
          var l = thisExt.children.push(parseRole(findRole(roles, role.ext[i])));
          self.hash[role.ext[i]] = -1;
          thisExt = thisExt.children[l-1];
        } else {
          for (var j = 0; j < thisExt.children.length; j++) {
            if (thisExt.children[j].name == role.ext[i]) {
              thisExt = thisExt.children[j];
              break;
            }
          }
        }
      }
      self.hash[role.name] = -1;
      if (typeof thisExt.children === 'undefined' || thisExt.children.length < 1)
        thisExt.children = [parseRole(role)];
      else
        thisExt.children.push(parseRole(role));
    }
    if (callback)
      callback();
    return self;
  });
};

var findRole = function(roles, name) {
  if (name === 'root')
    return {name: 'root', desc: 'root'};
  for (var i = 0; i < roles.length; i++) {
    if (name === roles[i].name)
      return roles.splice(i, 1)[0];
  }
  return {name: 'NOT_FOUND', desc: 'NOT_FOUND'};
};

var parseRole = function(role) {
  return {
    name: role.name,
    desc: role.desc
  };
};

var nodeView = '<a href="#">$name</a>';

var renderNode = function(node) {
  var res = '<li>';
  res += nodeView.replace(/\$name/g, node.name);
  if (typeof node.children !== 'undefined' && node.children.length > 0) {
    res += '\n<ul>'
    for (var i = 0; i < node.children.length; i++) {
      res += renderNode(node.children[i]);
    }
    res += '\n</ul>\n';
  }
  return (res + '</li>'); 
}

module.exports = RoleTree;