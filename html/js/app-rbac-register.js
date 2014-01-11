!function ($) {
  $(function(){
    $('#user-register').on('click', function (e) {
      var usrData = {
        user_name: $('#user_name').val(),
        user_password: $('#user_password').val(),
        user_desc: $('#user_desc').val()
      }
      if (usrData.user_name.length < 1 || usrData.user_password.length < 1 || usrData.user_desc.length < 1) {
        $('.float-msg').msg({msg: 'Invalid form.'});
        return;
      }
      $.ajax({
        url: '/rbac/register',
        method: 'POST',
        dataType: 'json',
        data: usrData,
        success: function (data, status, xhr) {
          if (data.err) {
            $('.float-msg').msg({msg: data.err + (data.msg ? '\n' + data.msg: '')});
            return;
          }
          window.location.href = '/rbac-index.html';
        }
      });
    });
  })
}(window.jQuery)