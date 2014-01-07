function ObjView (obj) {
  for (var prop in obj) {
    this[prop] = obj[prop];
  }
  return this;
}

ObjView.prototype.render = function (subject) {
  var res = this.view;
  res = res.replace(/\$name/g, this.name);
  res = res.replace(/\$desc/g, this.btns.read);
  res = res.replace(/\$edit/g, this.btns.edit);
  res = res.replace(/\$remove/g, this.btns.remove);

  var rights = '';
  if (typeof this.access.c[subject] !== 'undefined') {
    rights += 'c';
    if ( this.access.c[subject].cgrantors !== 'undefined' 
      && this.access.c[subject].cgrantors.length > 0)
      rights += '+';
    else
      rights += '-';
  } else
    rights += '--';

  if (typeof this.access.r[subject] !== 'undefined') {
    rights += 'r';
    if ( this.access.r[subject].cgrantors !== 'undefined' 
      && this.access.r[subject].cgrantors.length > 0)
      rights += '+';
    else
      rights += '-';
  } else
    rights += '--';

  if (typeof this.access.w[subject] !== 'undefined') {
    rights += 'w';
    if ( this.access.w[subject].cgrantors !== 'undefined' 
      && this.access.w[subject].cgrantors.length > 0)
      rights += '+';
    else
      rights += '-';
  } else
    rights += '--';

  if (typeof this.access.x[subject] !== 'undefined') {
    rights += 'x';
    if ( this.access.x[subject].cgrantors !== 'undefined' 
      && this.access.x[subject].cgrantors.length > 0)
      rights += '+';
    else
      rights += '-';
  } else
    rights += '--';

  res = res.replace(/\$right/, rights);

  return res;
};

ObjView.prototype.view = '<tr data-name="$name"><td>$name</td><td>$desc</td><td>$right</td><td>$edit $remove</td></tr>';

ObjView.prototype.btns = {
  read: '<a href="#" class="btn btn-sm btn-primary obj-read"><i class="glyphicon glyphicon-open"></i></a>',
  edit: '<a href="#" class="btn btn-sm btn-info obj-edit"><i class="glyphicon glyphicon-pencil"></i></a>',
  remove: '<a href="#" class="btn btn-sm btn-danger obj-remove"><i class="glyphicon glyphicon-remove"></i></a>'
}

module.exports = ObjView;