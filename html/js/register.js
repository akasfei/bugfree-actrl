!function ($) {
  $(function(){
    $('#subject-register').on('click', function (e) {
      var sbjData = {
        sbj_name: $('#sbj_name').val(),
        sbj_password: $('#sbj_password').val(),
        sbj_desc: $('#sbj_desc').val()
      }
      if (sbjData.sbj_name.length < 1 || sbjData.sbj_password.length < 1 || sbjData.sbj_desc.length < 1) {
        $('.float-msg').msg({msg: 'Invalid form.'});
        return;
      }
      $.ajax({
        url: '/subjects/new',
        method: 'POST',
        dataType: 'json',
        data: sbjData,
        success: function (data, status, xhr) {
          if (data.err) {
            $('.float-msg').msg({msg: data.err + data.msg ? '\n' + data.msg: ''});
            return;
          }
          window.location.href = '/index.html';
        }
      });
    });
  })
}(window.jQuery)