!function ($) {
  $(function(){

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
    $('#object-list-refresh').on('click', function (e) { refreshObjList(); });

    $.ajax({
      url: '/rbac/status',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (xhr.status == 204 || typeof data === 'undefined')
          return;
        subjectActive = true;
        $('#user-status-name').text(data.name);
        $('#user-status-desc').text(data.desc);
        if (data.roles && data.roles.length > 0) {
          setRoles(data.roles);
        }
        if (data.session) {
          $('#session-btn').removeClass('btn-default').addClass('btn-success');
          $('#session-current-role').text(data.session);
          refreshObjList();
        }
        $('.user-info').addClass('active');
        $('.object-list-refresh').trigger('click');
      }
    });

    $('#user-login').on('click', function (e) {
      var formData = {
        name: $('#user_name').val(),
        password: $('#user_password').val()
      }
      if (formData.name.length < 1 || formData.password.length < 1) {
        $('.float-msg').msg({msg: 'Invalid user name or password.'});
        return;
      }
      $.ajax({
        url: '/rbac/login',
        method: 'POST',
        data: formData,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          window.location.reload();
        }
      });
    });

    $('#user-logout').on('click', function (e) {
      $.ajax({
        url: '/rbac/logout',
        method: 'GET',
        dataType: 'json',
        complete: function (xhr) {
          if (xhr.status == 204) {
            $('.user-info').removeClass('active');
          }
        }
      });
    });

    $('#sessions-dropdown').on('click', '.session-active', function (e) {
      var self = $(this);
      var role = self.attr('data-role');
      
      $.ajax({
        url: '/rbac/session/new',
        method: 'GET',
        data: {r: role},
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully created session as role "' + role + '".', style: 'success'});
          $('#session-btn').removeClass('btn-default').addClass('btn-success');
          $('#session-current-role').text(role);
          refreshObjList();
        }
      });
    });

    $('#session-end').on('click', function (e) {
      $.ajax({
        url: '/rbac/session/end',
        method: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully ended session.', style: 'success'});
          $('#session-btn').removeClass('btn-success').addClass('btn-default');
          $('#session-current-role').text('None');
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

    $('.object-list').on('click', '.obj-read', function (e) {
      var self = $(this);
      $.ajax({
        url: '/rbac/object',
        method: 'GET',
        data: {n: self.parents('tr').attr('data-name')},
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          self.before(data.desc);
          self.remove();
        }
      });
    });

    $('.object-list').on('click', '.obj-remove', function (e) {
      var self = $(this);
      var name = self.parents('tr').attr('data-name');
      if ( !confirm('Comfirm removal of object "' + name + '"?') )
        return;
      $.ajax({
        url: '/rbac/objects/remove',
        method: 'GET',
        data: {n: name},
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.object-list-refresh').trigger('click');
        }
      });
    });

    $('.object-list').on('click', '.obj-edit', function (e) {
      var self = $(this);
      var name = self.parents('tr').attr('data-name');
      $('#obj_edit_name').text(name);
      $('#obj_edit_desc').val('');
      $('#obj-edit-modal').modal('show');
    });

    $('#obj-edit-getdesc').on('click', function (e) {
      var self = $(this);
      $.ajax({
        url: '/rbac/object',
        method: 'GET',
        data: {n: $('#obj_edit_name').text()},
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('#obj_edit_desc').val(data.desc);
        }
      });
    });

    $('#obj_edit_submit').on('click', function (e) {
      var self = $(this);
      var updatedata = {
        obj_name: $('#obj_edit_name').text(),
        obj_new_desc: $('#obj_edit_desc').val()
      }
      if (updatedata.obj_name.length < 1 || updatedata.obj_new_desc.length < 1) {
        $('.float-msg').msg({msg: 'Object name or description invalid.'});
        return;
      }
      $.ajax({
        url: '/rbac/objects/write',
        method: 'POST',
        data: updatedata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('#obj-edit-modal').modal('hide');
          refreshObjList();
        }
      });
    });

    $('#new_obj_submit').on('click', function (e) {
      var obj = {
        name: $('#new_obj_name').val(),
        desc: $('#new_obj_desc').val()
      }
      if (obj.name.length < 1 || obj.desc.length < 1) {
        $('.float-msg').msg({msg: 'Object name or description invalid.'});
        return;
      }
      $.ajax({
        url: '/rbac/objects/new',
        method: 'POST',
        data: obj,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          refreshObjList();
        }
      });
    });

  })

  var setRoles = function (roles) {
    $('#sessions-dropdown > .session-active').remove();
    var view = '<li class="session-active" data-role="$name"><a href="#">$name</a></li>';
    var res = ''
    for (var i = 0; i < roles.length; i++) {
      res += view.replace(/\$name/g, roles[i]) + '\n';
    }
    $('#sessions-dropdown').prepend(res);
  }

  var refreshObjList = function () {
    $.ajax({
      url: '/rbac/objects/list',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (data && data.err) {
          $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
          return;
        }
        if (xhr.status == 204) {
          $('.object-list > tbody').html('<tr><td colspan="4">No objects available.</td></tr>');
          return;
        }
        $('.object-list > tbody').html(data.objects.join('\n'));
      }
    });
  };
}(window.jQuery)