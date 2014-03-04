$(document).ready(function() {
  var prevQuery = null;
  var results = null;
  var cache = {};
  var menu = $('.menu');

  $('#index-search').keypress(function(e) {
    if (e.which == 13) return false;
  });

  $('#index-search').keyup(function(e) {
    //TODO:
    //sanitize input on server side..
    //clean this code up
    var query = $(this).val().trim();
    var length = query.length;

    if (length > 0) {
      menu.slideUp();
    }

    if (length === 0) {
      menu.slideDown();
    }

    //TODO: adjust this based on use
    if (length > 2 && length < 10) {
      if (query == prevQuery) {
        if (results !== null) {
          $('#search-results').html(results);
        }

        return false;
      }

      prevQuery = query;

      if (cache[query] && typeof cache[query] !== 'undefined') {
        $('#search-results').html(cache[query]);
      } else {
        $.ajax({
          type: 'POST',
          url: '/index-search',
          data: {
            course: query
          }
        }).done(function(newResults) {
          if (!newResults || newResults.length === 0) {
            results = null;
          } else {
            results = newResults;
          }

          $('#search-results').slideDown();
          $('#search-results').html(results);
          cache[query] = results;
        });
      }
    } else {
      $('#search-results').html(null);
    }
  });
});
