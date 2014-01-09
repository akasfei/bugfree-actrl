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
  res = res.replace(/\$ban/g, this.btns.ban);
  res = res.replace(/\$unban/g, this.btns.unban);

  return res;
};

AccView.prototype.view = '<tr data-name="$name"><td>$name</td> <td class="mono">$access</td> <td>$grant $recind $ban $unban</td></tr>';

AccView.prototype.btns = {
  ban: '<div class="btn-group"><button type="button" class="btn btn-xs btn-danger dropdown-toggle" data-toggle="dropdown">Ban <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-ban">C</a></li><li><a href="#" class="access-ban">R</a></li><li><a href="#" class="access-ban">W</a></li><li><a href="#" class="access-ban">X</a></li></ul></div>',
  unban: '<div class="btn-group"><button type="button" class="btn btn-xs btn-info dropdown-toggle" data-toggle="dropdown">Unban <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-unban">C</a></li><li><a href="#" class="access-unban">R</a></li><li><a href="#" class="access-unban">W</a></li><li><a href="#" class="access-unban">X</a></li></ul></div>',
  grant: '<div class="btn-group"><button type="button" class="btn btn-xs btn-success dropdown-toggle" data-toggle="dropdown">Grant <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-grant">C</a></li><li><a href="#" class="access-grant">R</a></li><li><a href="#" class="access-grant">W</a></li><li><a href="#" class="access-grant">X</a></li><li><a href="#" class="access-grant">C+</a></li><li><a href="#" class="access-grant">R+</a></li><li><a href="#" class="access-grant">W+</a></li><li><a href="#" class="access-grant">X+</a></li></ul></div>',
  recind: '<div class="btn-group"><button type="button" class="btn btn-xs btn-warning dropdown-toggle" data-toggle="dropdown">Recind <span class="caret"></span></button><ul class="dropdown-menu" role="menu"><li><a href="#" class="access-recind">C</a></li><li><a href="#" class="access-recind">R</a></li><li><a href="#" class="access-recind">W</a></li><li><a href="#" class="access-recind">X</a></li></ul></div>'
}

module.exports = AccView;