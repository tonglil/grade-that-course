$(document).ready(function() {
  $('#search-results').on('click', '.button.vote', function() {
    //Send an upvote to a type for a course
    var query = $(this).attr('href');
    var incr = $(this).children('.counter');
    console.log(query, incr);

    $.ajax({
      type: 'POST',
      url: query
    }).done(function(results) {
      //Increment the type's number
      incr.html(parseInt(incr.html(), 10) + 1);
    });

    return false;
  });
});
