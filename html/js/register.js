!function ($) {
  $(function(){
    $('#subject-register').on('click', function (e) {
      var sbjData = {
        sbj_name: $('#sbj_name').val(),
        sbj_password: $('#sbj_password').val(),
        sbj_desc: $('#sbj_desc').val()
      }
      if (sbjData.sbj_name.length < 1 || sbjData.sbj_password.length < 1 || sbjData.sbj_desc.length < 1) {
        alert('Invalid form.');
        return;
      }
      $.ajax({
        url: '/subjects/new',
        method: 'POST',
        dataType: 'json',
        data: sbjData,
        success: function (data, status, xhr) {
          if (data.err) {
            alert(data.err);
            return;
          }
          window.location.href = '/index.html';
        }
      });
    });
  })
}(window.jQuery)