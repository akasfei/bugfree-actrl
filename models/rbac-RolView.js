function RolView(rol) {
  for (var prop in rol) {
    this[prop] = rol[prop];
  }
  return this;
}

RolView.prototype.render = function() {
  var res = this.view;
  var ext = '';
  if (typeof this.ext !== 'undefined')
    ext = this.ext.join(', ');
  res = res.replace(/\$name/g, this.name)
           .replace(/\$desc/g, this.desc)
           .replace(/\$ext/g, ext)
           .replace(/\$access/g, this.btns.access)
           .replace(/\$remove/g, this.btns.remove);
  return res;
};

RolView.prototype.view = '<tr data-name="$name"><td>$name</td><td>$desc</td><td>$ext</td><td>$access $remove</td></tr>';

RolView.prototype.btns = {
  access: '<a href="#" class="btn btn-sm btn-warning roles-edit"><i class="glyphicon glyphicon-certificate"></i></a>',
  remove: '<a href="#" class="btn btn-sm btn-danger roles-remove"><i class="glyphicon glyphicon-remove"></i></a>'
};

module.exports = RolView;