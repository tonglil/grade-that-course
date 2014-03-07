$(document).ready(function () {
    $('form#login').validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
        }
      },
      errorPlacement: function(error, element) {
      },
      highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      success: function(element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      }
    });

    $('form#register').validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 5
        },
        passwordRepeat: {
          equalTo: '#password'
        }
      },
      errorPlacement: function(error, element) {
      },
      highlight: function(element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      success: function(element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      }
    });
});
