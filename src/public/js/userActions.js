$(document).ready(function() {
  $('[data-toggle="modal"]').click(function() {
    var url = $(this).attr('href');

    $.ajax({
      type: 'GET',
      url: url
    }).done(function(data) {
      $(data).modal();
    });

    return false;
  });
});
