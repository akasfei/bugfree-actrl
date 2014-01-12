!function ($) {
  $(function(){
    refreshObjList();
    refreshUserList();
    refreshRoleList();

    $('#root-auth').on('click', function (e) {
      $.ajax({
        url: '/rbac/root/auth',
        method: 'POST',
        data: {code: $('#root-code').val()},
        dataType: 'json',
        complete: function (xhr, status) {
          if (xhr.status == 403) {
            $('.float-msg').msg({msg: 'Access denied. Authenticate first.'});
            return;
          }
          refreshObjList();
          refreshUserList();
          refreshRoleList();
        }
      });
    });

    $('.object-list-refresh').on('click', function (e) { refreshObjList(); });
    $('.user-list-refresh').on('click', function (e) { refreshUserList(); });
    $('.role-list-refresh').on('click', function (e) { refreshRoleList(); });

/*
        ****************
        ****************
        ****        ****
        ****************
        ****************
        ****  ******
        ****    ******
        ****      ******
 */

    $('#new_rol_submit').on('click', function (e) {
      var role = {
        role_name: $('#new_rol_name').val(),
        role_desc: $('#new_rol_desc').val()
      };
      if (role.role_name.length < 1 || role.role_desc.length < 1) {
        $('.float-msg').msg({msg: 'Error: Invalid role form.'});
        return;
      }
      $.ajax({
        url: '/rbac/root/roles/new',
        method: 'POST',
        data: role,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully created role "' + role.role_name + '".', style: 'success'});
          refreshRoleList();
        }
      });
    });

    $('.role-list').on('click', '.roles-extend', function (e) {
      var self = $(this);
      var ext = prompt('Enter the name of the role to extend.');
      if (ext.length < 1) {
        $('.float-msg').msg({msg: 'Error: Invalid role name.'});
        return;
      }
      var rdata = {
        r: self.parents('tr').attr('data-name'), 
        sr: ext
      };
      $.ajax({
        url: '/rbac/root/roles/extend',
        method: 'GET',
        data: rdata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully extended role "' + rdata.sr + '" to "' + rdata.r + '".', style: 'success'});
          refreshRoleList();
        }
      });
    });

    $('.role-list').on('click', '.roles-reduce', function (e) {
      var self = $(this);
      var ext = confirm('Reduce this role?');
      if (!ext) {
        return;
      }
      var rdata = {
        r: self.parents('tr').attr('data-name')
        // sr: ext
      };
      $.ajax({
        url: '/rbac/root/roles/reduce',
        method: 'GET',
        data: rdata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully reduced role "' + rdata.r + '".', style: 'success'});
          refreshRoleList();
        }
      });
    });

    $('.role-list').on('click', '.roles-remove', function (e) {
      var self = $(this);
      var role = self.parents('tr').attr('data-name');
      if ( !confirm('Comfirm removal of role "' + role + '"?') )
        return;
      $.ajax({
        url: '/rbac/root/roles/remove',
        method: 'GET',
        data: {n: role},
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully removed role "' + role + '".', style: 'success'});
          refreshRoleList();
        }
      });
    });

/*
        ****        ****
        ****        ****
        ****        ****
        ****        ****
        ****        ****
        ****        ****
        ****************
        ****************
 */

    $('.user-list').on('click', '.user-bind', function (e) {
      var self = $(this);
      var role = prompt('Enter the name of the role to bind.');
      if (role.length < 1) {
        $('.float-msg').msg({msg: 'Error: Invalid role name.'});
        return;
      }
      var bdata = {
        u: self.parents('tr').attr('data-name'), 
        r: role
      };
      $.ajax({
        url: '/rbac/root/roles/bind',
        method: 'GET',
        data: bdata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully binded role "' + bdata.r + '" to user "' + bdata.u + '".', style: 'success'});
          refreshUserList();
        }
      });
    });

    $('.user-list').on('click', '.user-unbind', function (e) {
      var self = $(this);
      var role = prompt('Enter the name of the role to unbind.');
      if (role.length < 1) {
        $('.float-msg').msg({msg: 'Error: Invalid role name.'});
        return;
      }
      var bdata = {
        u: self.parents('tr').attr('data-name'), 
        r: role
      };
      $.ajax({
        url: '/rbac/root/roles/unbind',
        method: 'GET',
        data: bdata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully unbinded role "' + bdata.r + '" from user "' + bdata.u + '".', style: 'success'});
          refreshUserList();
        }
      });
    });

/*
      ****************
      ****************
      ****        ****
      ****        ****
      ****        ****
      ****        ****
      ****************
      ****************
*/
    $('.object-list').on('click', '.obj-access', function (e) {
      var self = $(this);
      refreshAccess(self.parents('tr').attr('data-name'), function (err) {
        $('#obj-access-modal').modal('show');
      });
    });

    $('.access-list').on('click', '.access-grant', function (e) {
      var self = $(this);
      var rights = self.text().toLowerCase();
      var query = {
        t: self.parents('tr').attr('data-name'),
        o: $('.access-list').attr('data-obj'),
        r: rights
      }
      $.ajax({
        url: '/rbac/root/roles/grant',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully granted right "' + rights + '" to role "' + query.t + '".', style: 'success'});
          refreshAccess(query.o);
        }
      });
    });

    $('.access-list').on('click', '.access-recind', function (e) {
      var self = $(this);
      var rights = self.text().toLowerCase();
      var query = {
        t: self.parents('tr').attr('data-name'),
        o: $('.access-list').attr('data-obj'),
        r: rights
      }
      $.ajax({
        url: '/rbac/root/roles/recind',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully recinded right "' + rights + '" from role "' + query.t + '".', style: 'success'});
          refreshAccess(query.o);
        }
      });
    });

    $('#obj-access-refresh').on('click', function (e) {
      refreshAccess($('.access-list').attr('data-obj'));
    });

  }); // END $(function())

/*
        ****** *************
        ******* ************
        ****      ***   ****
        ****        **  ****
        ****  **        ****
        ****   ***      ****
        ************ *******
        ************* ******
 */

  var refreshObjList = function () {
    $.ajax({
      url: '/rbac/root/objects/list',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.err) {
          $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
          return;
        }
        if (xhr.status == 204) {
          $('.object-list > tbody').html('<tr><td colspan="3">No objects available.</td></tr>');
          return;
        }
        $('.object-list > tbody').html(data.objects.join('\n'));
      },
      complete: function (xhr, status) {
        if (xhr.status == 403) {
          $('.float-msg').msg({msg: 'Access denied. Authenticate first.'});
        }
      }
    });
  };

  var refreshAccess = function (object, callback) {
    $('.access-list').attr('data-obj', '');
    $('#modal-obj-name').text(object)
    $.ajax({
      url: '/rbac/root/objects/access',
      method: 'GET',
      data: {n: object},
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.err) {
          $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
          return callback(data);
        }
        $('.access-list > tbody').html(data.list.join('\n'));
        $('.access-list').attr('data-obj', object);
        if (typeof callback !== 'undefined')
          return callback();
      }
    });
  }

  var refreshUserList = function () {
    $.ajax({
      url: '/rbac/root/users/list',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.err) {
          $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
          return;
        }
        if (xhr.status == 204) {
          $('.user-list > tbody').html('<tr><td colspan="4">No users available.</td></tr>');
          return;
        }
        $('.user-list > tbody').html(data.users.join('\n'));
      },
      complete: function (xhr, status) {
        if (xhr.status == 403) {
          $('.float-msg').msg({msg: 'Access denied. Authenticate first.'});
        }
      }
    });
  };

  var refreshRoleList = function () {
    $.ajax({
      url: '/rbac/root/roles/list',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.err) {
          $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
          return;
        }
        if (xhr.status == 204) {
          $('.role-list > tbody').html('<tr><td colspan="4">No roles available.</td></tr>');
          return;
        }
        $('.role-list > tbody').html(data.roles.join('\n'));
      },
      complete: function (xhr, status) {
        if (xhr.status == 403) {
          $('.float-msg').msg({msg: 'Access denied. Authenticate first.'});
        }
      }
    });
  };
  
}(window.jQuery)
