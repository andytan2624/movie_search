var OMDBModule = (function () {

    var omdbAPIURL = "http://www.omdbapi.com/";
    var searchTerm = "";
    /**
     * Given data object of movies, go through each one and append to the movies container
     * @param data
     */
    var displayMovies = function (data) {
        $("#movies").html('');
        console.log(data);
        if (data.Search) {
            $.each(data.Search, function(i, movie) {

                var html = '<li data-imdbid="' + movie.imdbID+ '">';
                html += '<div class="poster-wrap">';

                if ( movie.Poster != 'N/A') {
                    html += '<img class="movie-poster" src="' + movie.Poster + '">';
                } else {
                    html += '<i class="material-icons poster-placeholder">crop_original</i>';
                }
                html += '</div>';
                html += '<span class="movie-title">' + movie.Title + '</span>';
                html += '<span class="movie-year">' + movie.Year + '</span>';
                html += '</li>';

                $("#movies").append(html);
            });
        } else {
            var html = '<li class="no-movies">';
            html += '<i class="material-icons icon-help">help_outline</i>No movies found that match: ' + searchTerm;
            html += '</li>';
            $("#movies").append(html);
        }
    };

    /**
     * Function which does an AJAX call to OMDB to get list of movies
     * @param s
     * @param year
     */
    var queryAllMovies = function(s, year) {
        searchTerm = s;
        var options = {
            s: s,
            y: year,
            r: "json"
        };
        $.getJSON(omdbAPIURL, options, displayMovies);
    };

    /**
     * Function which does an AJAX call to OMDB to get details for a single movie
     * @param imdbID
     */
    var querySingleMovie = function(imdbID) {
        var options = {
            i: imdbID,
            plot: "full",
            r: "json"
        };
        $.getJSON(omdbAPIURL, options, displayDetailedMovie);
    };

    /**
     * Goes back to the search results page and hides the movie detail page
     */
    var goBackToSearchResults = function() {
        $('.detailed-content').hide();
        $('.main-content').show();
    };

    /**
     * Given a object which contains details about a movie, displays the information accordingly
     * @param movie
     */
    var displayDetailedMovie = function(movie) {
        $('#selected-movie-title').html(movie.Title);
        $('#selected-movie-rating').html(movie.imdbRating);
        $('#selected-movie-plot').html(movie.Plot);
        if (movie.Poster != 'N/A') {
            $('#selected-movie-image').show();
            $('#selected-movie-image img').attr("src", movie.Poster);

        } else {
            $('#selected-movie-image').hide();
        }
        $('#selected-movie-link').attr("href", "http://www.imdb.com/title/" + movie.imdbID);

        $('.detailed-content').show();
        $('.main-content').hide();
    };

    return {
        queryAllMovies: queryAllMovies,
        querySingleMovie: querySingleMovie,
        goBackToSearchResults: goBackToSearchResults
    };
})();

$(document).ready(function(){
    /**
     * When search form is submitted, call the ajax call to get list of movies
     */
    $('.search-form').submit(function(e){
        e.preventDefault();
        var $searchField = $("#search").val();
        var $yearField = $("#year").val();
        OMDBModule.queryAllMovies( $searchField, $yearField);
    });

});

$(document).on('click', '#movies li', function(){
    /**
     * When a movie is clicked, get the details about the user and redirect to that page
     * @type {*|jQuery}
     */
    var imdbID = $(this).data('imdbid');
    OMDBModule.querySingleMovie(imdbID);
});

