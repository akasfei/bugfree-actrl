!function ($) {
  var subjectActive = false;

  $(function(){
    // Check subject status
    $.ajax({
      url: '/status',
      method: 'GET',
      dataType: 'json',
      success: function (data, status, xhr) {
        if (xhr.status == 204 || typeof data === 'undefined')
          return;
        subjectActive = true;
        $('#subject-status-name').text(data.name);
        $('#subject-status-desc').text(data.desc);
        $('.subject-info').addClass('active');
        $('.object-list-refresh').trigger('click');
      }
    });

    $('#subject-login').on('click', function (e) {
      var formData = {
        name: $('#name').val(),
        password: $('#password').val()
      }
      if (formData.name.length < 1 || formData.password.length < 1) {
        $('.float-msg').msg({msg: 'Invalid subject name or password.'});
        return;
      }
      $.ajax({
        url: '/login',
        method: 'POST',
        data: formData,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          window.location.reload();
          subjectActive = true;
          $('#subject-status-name').text(data.name);
          $('#subject-status-desc').text(data.desc);
          $('.subject-info').addClass('active');
        }
      });
    });

    $('#subject-logout').on('click', function (e) {
      $.ajax({
        url: '/logout',
        method: 'GET',
        dataType: 'json',
        complete: function (xhr) {
          if (xhr.status == 204) {
            subjectActive = false;
            $('.subject-info').removeClass('active');
          }
        }
      });
    });

    $('.object-list-refresh').on('click', function (e) {
      $.ajax({
        url: '/objects/list',
        method: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          if (status == 204) {
            $('.object-list > tbody').html('<tr><td colspan="4">No objects available.</td></tr>');
            return;
          }
          $('.object-list > tbody').html(data.objects.join('\n'));
        }
      });
    });

    $('.object-list').on('click', '.obj-read', function (e) {
      var self = $(this);
      $.ajax({
        url: '/object',
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

    var refreshAccess = function (object, callback) {
      $('.access-list').attr('data-obj', '');
      $.ajax({
        url: '/objects/access',
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

    $('.object-list').on('click', '.obj-access', function (e) {
      var self = $(this);
      refreshAccess(self.parents('tr').attr('data-name'), function (err) {
        $('#obj-access-modal').modal('show');
      });
    });

    $('.object-list').on('click', '.obj-remove', function (e) {
      var self = $(this);
      var name = self.parents('tr').attr('data-name');
      if ( !confirm('Comfirm removal of object "' + name + '"?') )
        return;
      $.ajax({
        url: '/objects/remove',
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
        url: '/object',
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
        url: '/objects/write',
        method: 'POST',
        data: updatedata,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('#obj-edit-modal').modal('hide');
          $('.object-list-refresh').trigger('click');
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
        url: '/objects/new',
        method: 'POST',
        data: obj,
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

    $('.access-list').on('click', '.access-grant', function (e) {
      var self = $(this);
      var rights = self.text().toLowerCase();
      var query = {
        t: self.parents('tr').attr('data-name'),
        o: $('.access-list').attr('data-obj'),
        r: rights.substr(0, 1),
        c: rights.substr(1, 1) == '+'? 'true': null
      }
      $.ajax({
        url: '/subjects/grant',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully granted right "' + rights + '" to subject "' + query.t + '".', style: 'success'});
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
        url: '/subjects/recind',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully recinded right "' + rights + '" from subject "' + query.t + '".', style: 'success'});
          refreshAccess(query.o);
        }
      });
    });

    $('.access-list').on('click', '.access-ban', function (e) {
      var self = $(this);
      var rights = self.text().toLowerCase();
      var query = {
        t: self.parents('tr').attr('data-name'),
        o: $('.access-list').attr('data-obj'),
        r: rights
      }
      $.ajax({
        url: '/subjects/ban',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully added subject"' + query.t + '" to "' + rights + '" blacklist.', style: 'success'});
          refreshAccess(query.o);
        }
      });
    });

    $('.access-list').on('click', '.access-unban', function (e) {
      var self = $(this);
      var rights = self.text().toLowerCase();
      var query = {
        t: self.parents('tr').attr('data-name'),
        o: $('.access-list').attr('data-obj'),
        r: rights
      }
      $.ajax({
        url: '/subjects/unban',
        method: 'GET',
        data: query,
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data && data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          $('.float-msg').msg({msg: 'Successfully removed subject "' + query.t + '" from "' + rights + '" blacklist.', style: 'success'});
          refreshAccess(query.o);
        }
      });
    });

    $('#obj-access-refresh').on('click', function (e) {
      refreshAccess($('.access-list').attr('data-obj'));
    });
  })
}(window.jQuery)