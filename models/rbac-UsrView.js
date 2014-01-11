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
           .replace(/\$access/g, this.btns.access)
           .replace(/\$remove/g, this.btns.remove);
};

UsrView.prototype.view = '<tr data-name="$name"><td>$name</td><td>$desc</td><td>$roles</td><td>$access $remove</td></tr>';

UsrView.prototype.btns = {
  access: '<a href="#" class="btn btn-sm btn-warning usr-roles-edit"><i class="glyphicon glyphicon-certificate"></i></a>',
  remove: '<a href="#" class="btn btn-sm btn-danger usr-remove"><i class="glyphicon glyphicon-remove"></i></a>'
};

module.exports = UsrView;