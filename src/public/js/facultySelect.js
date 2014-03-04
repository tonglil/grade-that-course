$(document).ready(function() {
  var prevQuery = null;
  var results = null;
  var cache = {};

  $('.button.faculty').click(function() {
    var query = $(this).attr('id');

    if (query == prevQuery) {
      $('#faculty-results').slideToggle();
      $('#search-results').slideToggle();
      $('.scores').slideToggle();
      $('.search').slideToggle();
      prevQuery = null;
      return false;
    }

    prevQuery = query;

    if (typeof cache[query] !== 'undefined') {
      $('#faculty-results').slideUp(null, function() {
        $('#faculty-results').html(cache[query]).slideDown();
        $('.scores').slideUp();
        $('.search').slideUp();
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
          $('#search-results').slideUp();
          $('#faculty-results').slideUp(null, function() {
            $('#faculty-results').html(results).slideDown();
            $('.scores').slideUp();
            $('.search').slideUp();
            cache[query] = results;
          });
        }
      });
    }

    return false;
  });
});
