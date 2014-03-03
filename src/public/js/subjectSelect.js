$(document).ready(function() {
  var prevQuery = null;
  var results = null;
  var cache = {};

  $('#faculty-results').on('click', '.button.subject', function() {
    var query = $(this).attr('href');

    if (query == prevQuery) {
      $('#subject-results').slideToggle();
      prevQuery = null;
      return false;
    }

    prevQuery = query;

    if (typeof cache[query] !== 'undefined') {
      $('#subject-results').slideUp(null, function() {
        $('#subject-results').html(cache[query]).slideDown();
      });
    } else {
      $.ajax({
        type: 'POST',
        url: query,
      }).done(function(results) {
        if (results) {
          $('#subject-results').html(results).slideDown();
          cache[query] = results;
        }
      });
    }

    return false;
  });
});
