$(document).ready(function() {
    //should filter a pre-existing list to reduce being hammered on by users?
    $('#index-search').keyup(function(e) {
        //sanitize input
        var search = $(this).val();
        if (search.length > 2) {
            $.ajax({
                type: 'POST',
                url: '/index-search',
                data: { course: search }
            }).done(function(data) {
                if (data.length === 0) {
                    data = null;
                }
                $('#search-results').html(data);
            });
        }
    });
});

