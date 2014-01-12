function UsrView(usr) {
  for (var prop in usr) {
    this[prop] = usr[prop];
  }
  return this;
}

UsrView.prototype.render = function() {
  var res = this.view;
  var roles = '';
  if (typeof this.roles !== 'undefined')
    roles = this.roles.join(', ');
  res = res.replace(/\$name/g, this.name)
           .replace(/\$desc/g, this.desc)
           .replace(/\$roles/g, roles)
           .replace(/\$access/g, this.btns.bind + ' ' + this.btns.unbind)
           .replace(/\$remove/g, this.btns.remove);
  return res;
};

UsrView.prototype.view = '<tr data-name="$name"><td>$name</td><td>$desc</td><td>$roles</td><td>$access $remove</td></tr>';

UsrView.prototype.btns = {
  bind: '<a href="#" class="btn btn-sm btn-success user-bind"><i class="glyphicon glyphicon-plus-sign"></i></a>',
  unbind: '<a href="#" class="btn btn-sm btn-warning user-unbind"><i class="glyphicon glyphicon-minus-sign"></i></a>',
  remove: '<a href="#" class="btn btn-sm btn-danger usr-remove"><i class="glyphicon glyphicon-remove"></i></a>'
};

module.exports = UsrView;