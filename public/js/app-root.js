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
  });

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
