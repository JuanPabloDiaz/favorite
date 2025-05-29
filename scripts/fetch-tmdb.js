const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;

async function fetchDetails(id, type) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${type} ${id}:`, error);
    return null;
  }
}

async function fetchPopular(type) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${type}/popular?api_key=${API_KEY}`);
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching popular ${type}:`, error);
    return [];
  }
}

async function fetchMoviesData() {
  const myFavMoviesByGenre = require('../src/data/myFavMoviesByGenre.json');

  // Fetch popular movies
  console.log('Fetching popular movies...');
  const popularMovies = await fetchPopular('movie');
  fs.writeFileSync('./src/data/popularMovies.json', JSON.stringify(popularMovies, null, 2));

  // Fetch details for each genre's movies
  console.log('Fetching movie details by genre...');
  const movieDetailsByGenre = {};
  for (const genre of Object.keys(myFavMoviesByGenre)) {
    console.log(`Processing genre: ${genre}`);
    const movies = myFavMoviesByGenre[genre];
    const details = await Promise.all(movies.map((movie) => fetchDetails(movie.id, 'movie')));
    movieDetailsByGenre[genre] = details.filter((d) => d !== null);
  }

  fs.writeFileSync('./src/data/movieDetails.json', JSON.stringify(movieDetailsByGenre, null, 2));

  console.log('✅ All movie data has been fetched and saved!');
}

async function fetchTVShowsData() {
  const myFavTvShows = require('../src/data/myFavTvShows.json');
  const myFavSpanishTvShows = require('../src/data/myFavSpTvShows.json');

  // Fetch details for favorite TV shows
  console.log('Fetching TV show details...');
  const tvShowDetails = await Promise.all(myFavTvShows.map((show) => fetchDetails(show.id, 'tv')));

  // Fetch details for favorite Spanish TV shows
  console.log('Fetching Spanish TV show details...');
  const spanishTvShowDetails = await Promise.all(
    myFavSpanishTvShows.map((show) => fetchDetails(show.id, 'tv'))
  );

  fs.writeFileSync(
    './src/data/tvShowDetails.json',
    JSON.stringify(
      {
        regular: tvShowDetails.filter((d) => d !== null),
        spanish: spanishTvShowDetails.filter((d) => d !== null),
      },
      null,
      2
    )
  );

  console.log('✅ All TV show data has been fetched and saved!');
}

async function main() {
  await fetchMoviesData();
  await fetchTVShowsData();
}

main().catch(console.error);
