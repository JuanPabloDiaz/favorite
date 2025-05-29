const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

const API_KEY = process.env.TMDB_API_KEY;

async function fetchMovieDetails(movieId) {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`
    );
    return await response.json();
  } catch (error) {
    console.error(`Error fetching movie ${movieId}:`, error);
    return null;
  }
}

async function fetchPopularMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return [];
  }
}

async function main() {
  const myFavMoviesByGenre = require('../src/data/myFavMoviesByGenre.json');

  // Fetch popular movies
  console.log('Fetching popular movies...');
  const popularMovies = await fetchPopularMovies();
  fs.writeFileSync(
    './src/data/popularMovies.json',
    JSON.stringify(popularMovies, null, 2)
  );

  // Fetch details for each genre's movies
  console.log('Fetching movie details by genre...');
  const detailsByGenre = {};
  for (const genre of Object.keys(myFavMoviesByGenre)) {
    console.log(`Processing genre: ${genre}`);
    const movies = myFavMoviesByGenre[genre];
    const details = await Promise.all(
      movies.map(movie => fetchMovieDetails(movie.id))
    );
    detailsByGenre[genre] = details.filter(d => d !== null);
  }
  
  fs.writeFileSync(
    './src/data/movieDetails.json',
    JSON.stringify(detailsByGenre, null, 2)
  );

  console.log('✅ All movie data has been fetched and saved!');
}

main().catch(console.error);
