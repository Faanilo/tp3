const CACHE_NAME = 'movie';
const apiKey = '77ea88178dd845d483106935bca8413f';
const BaseUrl = 'https://api.themoviedb.org';
self.addEventListener('install', (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll([
                '/',
                './fetchData.js',
                '../css/style.css',
                '/error.html',
            ]);
        })()
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        cacheFirst({
            request: event.request,
            fallbackUrl: '/error.html',
        })
    );
});

const putInCache = async (request, response) => {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response);
};

const cacheFirst = async ({ request, fallbackUrl }) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    try {
        const responseFromNetwork = await fetch(request);

        if (responseFromNetwork.ok) {
            putInCache(request, responseFromNetwork.clone());
        }

        return responseFromNetwork;
    } catch (error) {
        if (!navigator.onLine) {
            return window.location.href= fallbackUrl;
        }

        const responseFromCache = await caches.match(fallbackUrl);
        if (responseFromCache) {
            return responseFromCache;
        }

        return new Response('Network Error.', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' },
        });
    }
};

function searchAllMovies(query) {
    const url = `${BaseUrl}/3/search/movie?api_key=${apiKey}&query=${query}`;
    return fetch(url)
        .then((response) => response.json())
        .then((data) => {
            return data.results;
        })
        .catch((error) => {
            if (!navigator.onLine) {
                window.location.href = "https://faniloniaina-ramilison.vercel.app/error.html";
            }
        });
}


function searchAllMoviesAndUpdate(query) {
    searchAllMovies(query).then((searchResults) => {
        displayMovies(searchResults, 'search-movie-container');
    });
}