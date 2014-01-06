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
      }
    });

    $('#subject-login').on('click', function (e) {
      var formData = {
        name: $('#name').val(),
        password: $('#password').val()
      }
      if (formData.name.length < 1 || formData.password.length < 1) {
        alert('Invalid subject name or password.');
        return;
      }
      $.ajax({
        url: '/login',
        method: 'POST',
        dataType: 'json',
        success: function (data, status, xhr) {
          if (data.err) {
            alert(data.err);
            return;
          }
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
    })
  })
}(window.jQuery)
