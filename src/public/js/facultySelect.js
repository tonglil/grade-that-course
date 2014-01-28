$(document).ready(function() {
  var prevQuery = null;
  var results = null;
  var cache = {};

  $('.button.faculty').click(function() {
    var query = $(this).attr('id');

    if (query == prevQuery) {
      $('#faculty-results').slideToggle();
      $('.scores').slideToggle();
      prevQuery = null;
      return false;
    }

    prevQuery = query;

    if (typeof cache[query] !== 'undefined') {
      $('#faculty-results').slideUp(null, function() {
        $('#faculty-results').html(cache[query]).slideDown();
        $('.scores').slideUp();
      });
    } else {
      $.ajax({
        type: 'POST',
        url: '/faculty',
        data: {
          faculty: query
        }
      }).done(function(results) {
        if (results) {
          $('#faculty-results').slideUp(null, function() {
            $('#faculty-results').html(results).slideDown();
            $('.scores').slideUp();
            cache[query] = results;
          });
        }
      });
    }

    return false;
  });
});
