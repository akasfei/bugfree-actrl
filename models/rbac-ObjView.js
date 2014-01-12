function ObjView (obj) {
  for (var prop in obj) {
    this[prop] = obj[prop];
  }
  return this;
}

ObjView.prototype.render = function (role) {
  var res = this.view;
  res = res.replace(/\$name/g, this.name);
  res = res.replace(/\$desc/g, this.btns.read);
  res = res.replace(/\$edit/g, this.btns.edit);
  res = res.replace(/\$remove/g, this.btns.remove);

  res = res.replace(/\$right/, this.renderAccess(role));

  return res;
};

ObjView.prototype.renderAccess = function (role) {
  var res = '';
  for (var i = 0; i < this.permissions.length; i++) {
    var perm = false;
    if (typeof this.access[this.permissions[i]][role.name] === 'undefined') {
      if (typeof role.ext !== 'undefined' && role.ext.length > 0) {
        for (var j = 0; j < role.ext.length; j++) {
          if (typeof this.access[this.permissions[i]][role.ext[j]] !== 'undefined') {
            perm = true;
            break;
          }
        }
      }
    } else
      perm = true;
    res += perm ? this.permissions[i]: '-';
  }

  return res;
};

ObjView.prototype.permissions = ['c', 'r', 'w', 'x'];

ObjView.prototype.view = '<tr data-name="$name"><td>$name</td><td>$desc</td><td class="mono">$right</td><td>$edit $remove</td></tr>';

ObjView.prototype.btns = {
  read: '<a href="#" class="btn btn-sm btn-primary obj-read"><i class="glyphicon glyphicon-download-alt"></i></a>',
  edit: '<a href="#" class="btn btn-sm btn-info obj-edit"><i class="glyphicon glyphicon-pencil"></i></a>',
  remove: '<a href="#" class="btn btn-sm btn-danger obj-remove"><i class="glyphicon glyphicon-remove"></i></a>',
}

module.exports = ObjView;