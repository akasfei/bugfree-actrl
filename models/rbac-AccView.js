function AccView (name, access) {
  this.name = name;
  this.access = access;
  return this;
}

AccView.prototype.render = function () {
  var res = this.view;
  res = res.replace(/\$name/g, this.name);
  res = res.replace(/\$access/g, this.access);
  res = res.replace(/\$grant/g, this.btns.grant);
  res = res.replace(/\$recind/g, this.btns.recind);

  return res;
};

AccView.prototype.view = '<tr data-name="$name"><td>$name</td> <td class="mono">$access</td> <td>$grant $recind</td></tr>';

AccView.prototype.btns = {
  grant: '<div class="btn-group"><button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown">Grant <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-grant">C</a></li><li><a href="#" class="access-grant">R</a></li><li><a href="#" class="access-grant">W</a></li><li><a href="#" class="access-grant">X</a></li></ul></div>',
  recind: '<div class="btn-group"><button type="button" class="btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown">Recind <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-recind">C</a></li><li><a href="#" class="access-recind">R</a></li><li><a href="#" class="access-recind">W</a></li><li><a href="#" class="access-recind">X</a></li></ul></div>'
}

module.exports = AccView;