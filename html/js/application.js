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
          if (data.err) {
            $('.float-msg').msg({msg: data.err + data.msg ? '\n' + data.msg: ''});
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

    $('.float-msg').on('click', '.float-msg-dismiss', function (e) {
      $('.float-msg').msg('hide');
    });
  })

  $.fn.msg = function(opt) {
    var self = $(this);
    var alert_class = 'alert alert-danger';
    var msg = 'An error has occurred.';
    if (typeof opt === 'string'){
      if (opt === 'show')
        return self.addClass('active');
      if (opt === 'hide')
        return self.removeClass('active');
    }
    else if (typeof opt.msg === 'undefined')
      return self;
    if (typeof opt.style === 'undefined')
      alert_style = 'alert alert-danger';
    else
      alert_style = 'alert alert-' + opt.style;
    msg = opt.msg;
    self.html('<div class="' + alert_style + '"><p>' + msg + ' <a href="#" class="float-msg-dismiss">Dismiss</a></p></div>').msg('show');
    return self;
  }
}(window.jQuery)
