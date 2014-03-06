$(document).ready(function () {
    $('form').validate({
      rules: {
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          //minlength: 3
        }
      },
      errorPlacement: function(error, element) {
      },
      highlight: function (element) {
        $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
      },
      success: function (element) {
        $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
      }
    });
});
