$(document).ready(function() {
  var prevQuery = null;
  var results = null;
  var cache = {};

  $('#faculty-results').on('click', '.button.subject', function() {
    var query = $(this).attr('href');

    if (query == prevQuery) {
      $('#search-results').slideToggle();
      prevQuery = null;
      return false;
    }

    prevQuery = query;

    if (typeof cache[query] !== 'undefined') {
      $('#search-results').slideUp(null, function() {
        $('#search-results').html(cache[query]).slideDown();
      });
    } else {
      $.ajax({
        type: 'POST',
        url: query,
      }).done(function(results) {
        if (results) {
          $('#search-results').slideUp(null, function() {
            $('#search-results').html(results).slideDown();
            cache[query] = results;
          });
        }
      });
    }

    return false;
  });
});
