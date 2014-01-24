$(document).ready(function() {
  //$('#search-results').click('#take', function() {
  $('#search-results').on('click', '.button.vote', function() {
    //Send an upvote to a type for a course
    var type = $(this).attr('type');
    var courseCode = $(this).parent().attr('course');
    var incr = $(this).children('.counter');

    $.ajax({
      type: 'POST',
      url: '/vote/course',
      data: {
        courseCode: courseCode,
        type: type
      }
    }).done(function(results) {
      //Increment the type's number
      incr.html(parseInt(incr.html(), 10) + 1);
    });
  });
});
