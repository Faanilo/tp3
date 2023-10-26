const apiKey = '77ea88178dd845d483106935bca8413f';
const BaseUrl = 'https://api.themoviedb.org';
const moviesPerPage = 10;
let currentPage = 1;
let allMovies = [];


function displayMoviesByPage(movies, containerId, page) {
    const startIndex = (page - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    const moviesToDisplay = movies.slice(startIndex, endIndex);
    displayMovies(moviesToDisplay, containerId);
}




function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const poster = document.createElement('img');
    poster.classList.add('movie-poster');
    poster.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    poster.alt = `${movie.title} Poster`;

    const title = document.createElement('div');
    title.classList.add('movie-title');
    title.textContent = movie.title;

    const description = document.createElement('div');
    description.classList.add('movie-description');
    description.textContent = movie.overview;

    movieCard.appendChild(poster);
    movieCard.appendChild(title);
    movieCard.appendChild(description);

    return movieCard;
}

function displayMovies(movies, containerId) {
    const movieContainer = document.getElementById(containerId);

    if (movieContainer) {
        movieContainer.innerHTML = '';
        movies.forEach((movie) => {
            const movieCard = createMovieCard(movie);
            movieContainer.appendChild(movieCard);
        });
    } else {
        console.error(`Container with ID ${containerId} not found.`);
    }
}

function getTopMovies() {
    const url = `${BaseUrl}/3/movie/top_rated?api_key=${apiKey}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const topRatedMovies = data.results.slice(0, 3);
            displayMovies(topRatedMovies, 'top-movie-container');
        })
        .catch((error) => console.error('Error:', error));
}


function getAllMovies() {
    const url = `${BaseUrl}/3/discover/movie?api_key=${apiKey}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            allMovies = data.results;
            displayMoviesByPage(allMovies, 'all-movie-container', currentPage);
        })
        .catch((error) => console.error('Error:', error));
}

function searchMovie(query) {
    const url = `${BaseUrl}/3/search/movie?api_key=${apiKey}&query=${query}`;
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const searchResults = data.results;
            displayMovies(searchResults, 'search-movie-container');
        })
        .catch((error) => {
            if (!navigator.onLine) {
                window.location.href="http://127.0.0.1:8080/error.html"
            }
        });
}
function getMoviesByGenre(genreId) {
    const url = `${BaseUrl}/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const genreMovies = data.results;
            displayMovies(genreMovies, 'all-movie-container');
        })
        .catch((error) => console.error('Error:', error));
}

function getAllGenres() {
    const url = `${BaseUrl}/3/genre/movie/list?api_key=${apiKey}`;

    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            const genres = data.genres;
            const genreSelect = document.getElementById('genre-select');
            const allGenresOption = document.createElement('option');
            allGenresOption.value = '';
            allGenresOption.textContent = 'All Genres';
            genreSelect.appendChild(allGenresOption);

            // Add options for individual genres
            genres.forEach((genre) => {
                const option = document.createElement('option');
                option.value = genre.id;
                option.textContent = genre.name;
                genreSelect.appendChild(option);
            });

            return genres;
        })
        .catch((error) => {
            console.error('Error:', error);
            return [];
        });
}

document.getElementById('genre-select').addEventListener('change', function () {
    const selectedGenre = this.value;
    if (selectedGenre) {
        getMoviesByGenre(selectedGenre);
    } else {
        getAllMovies();
    }
});
document.getElementById('search-button').addEventListener('click', function (e) {
    e.preventDefault();
    const query = document.getElementById('search').value;
    searchMovie(query);
});
document.getElementById('next-page').addEventListener('click', function () {
    currentPage++;
    displayMoviesByPage(allMovies, 'all-movie-container', currentPage);
});

document.getElementById('prev-page').addEventListener('click', function () {
    if (currentPage > 1) {
        currentPage--;
        displayMoviesByPage(allMovies, 'all-movie-container', currentPage);
    }
});
getAllGenres()
getTopMovies();
getAllMovies();
