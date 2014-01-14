$(document).ready(function() {
    var prevQuery = null;
    var results = null;
    //should filter a pre-existing list to reduce being hammered on by users?
    $('#index-search').keypress(function(e) {
        if (e.which == 13) {
            return false;
        }
    });
    $('#index-search').keyup(function(e) {
        //TODO:
        //sanitize input
        //clean this code up
        var query = $(this).val();
        if (query.length > 2) {
            if (prevQuery === query) {
                if (results !== null) {
                    hideMenu();
                    $('#search-results').html(results);
                } else {
                    showMenu();
                }
                return false;
            } else {
                prevQuery = query;
                $.ajax({
                    type: 'POST',
                    url: '/index-search',
                    data: { course: query }
                }).done(function(newResults) {
                    if (newResults.length === 0) {
                        results = null;
                        showMenu();
                    } else {
                        results = newResults;
                        hideMenu();
                    }
                    $('#search-results').html(results);
                });
            }
        } else {
            showMenu();
            $('#search-results').html(null);
        }
    });

    function hideMenu() {
        //$('.content.menu').hide();
        $('.content.menu').animate({
            opacity: 'hide'
        }, {
            duration: 'slow'
        });
    }

    function showMenu() {
        //$('.content.menu').hide();
        $('.content.menu').animate({
            opacity: 'show'
        }, {
            duration: 'slow'
        });
    }
});

