$(document).ready(function() {
    //should filter a pre-existing list to reduce being hammered on by users?
    $('#index-search').keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
    $('#index-search').keyup(function(e) {
        //sanitize input
        var search = $(this).val();
        if (search.length > 2) {
            $.ajax({
                type: 'POST',
                url: '/index-search',
                data: { course: search }
            }).done(function(results) {
                if (results.length === 0) {
                    results = null;
                }
                $('#search-results').html(results);
            });
        } else {
            $('#search-results').html(null);
        }
    });
});

