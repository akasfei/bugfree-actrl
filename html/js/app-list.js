!function ($) {
  $(function(){
    $('.object-list-refresh').on('click', function (e) {
      $.ajax({
        url: '/objects/list',
        method: 'GET',
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data.err) {
            $('.float-msg').msg({msg: data.err + data.msg ? '\n' + data.msg: ''});
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
          if (data.err) {
            $('.float-msg').msg({msg: data.err + data.msg ? '\n' + data.msg: ''});
            return;
          }
          self.before(data.desc);
          self.remove();
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
          if (data.err) {
            $('.float-msg').msg({msg: data.err + data.msg ? '\n' + data.msg: ''});
            return;
          }
          $('.object-list-refresh').trigger('click');
        }
      });
    });
  })
}(window.jQuery)