$(document).ready(function() {
    //$('#search-results').click('#take', function() {
    $('#search-results').on('click', '.button', function() {
        //Send an upvote to a type for a course
        var type = $(this).attr('type');
        var courseCode = $(this).parent().attr('course');

        $.ajax({
            type: 'POST',
            url: '/vote/course',
            data: {
                courseCode: courseCode,
                type: type
            }
        }).done(function(results) {
            console.log('success?');
        });
    });
});
