import fs from 'fs/promises';
import fetch from 'node-fetch';

// Constants
const LISTEN_NOTES_API_KEY = process.env.LISTEN_NOTES_API_KEY;
const USER_AGENT = 'JuanFavPodcasts/1.0 (jp@jpdiaz.dev)'; // Replace with appropriate contact
const DELAY_MS = 1000; // 1-second delay
const PODCAST_INPUT_FILE = 'src/data/myFavPodcasts.json';
const PODCAST_OUTPUT_FILE = 'src/data/podcastDetails.json';
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/500x500.png?text=No+Artwork';

// --- Helper Functions ---

/**
 * Delays execution for a specified number of milliseconds.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>}
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Fetches detailed data for a given podcast name from the Listen Notes API.
 * @param {string} podcastName - The name of the podcast to search for.
 * @returns {Promise<object|null>} - The podcast details object or null if an error occurs or not found.
 */
async function fetchPodcastData(podcastName) {
  // TODO: Implement podcast data fetching logic
  console.log(`Fetching data for: ${podcastName}`);
  await delay(DELAY_MS); // Respect API rate limits

  if (!LISTEN_NOTES_API_KEY) {
    console.error('LISTEN_NOTES_API_KEY is not set. Please set it in your .env file.');
    return null;
  }

  // 1. Search for the podcast
  const searchUrl = `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(podcastName)}&type=podcast&sort_by_date=0&language=Any%20language&offset=0&len=5&safe_mode=0`;
  let searchResponse;
  try {
    searchResponse = await fetch(searchUrl, {
      headers: {
        'X-ListenAPI-Key': LISTEN_NOTES_API_KEY,
        'User-Agent': USER_AGENT,
      },
    });

    if (!searchResponse.ok) {
      console.error(
        `Error searching for podcast "${podcastName}": ${searchResponse.status} ${searchResponse.statusText}`
      );
      const errorBody = await searchResponse.text();
      console.error('Error body:', errorBody);
      return null;
    }

    const searchData = await searchResponse.json();

    if (!searchData.results || searchData.results.length === 0) {
      console.warn(`No podcast found for "${podcastName}".`);
      return null;
    }

    const podcastSearchResult = searchData.results[0];
    const podcastId = podcastSearchResult.id;

    // 2. Fetch detailed podcast information using the ID
    await delay(DELAY_MS); // Delay before the next API call
    const detailsUrl = `https://listen-api.listennotes.com/api/v2/podcasts/${podcastId}?sort=recent_first`;
    let detailsResponse;

    detailsResponse = await fetch(detailsUrl, {
      headers: {
        'X-ListenAPI-Key': LISTEN_NOTES_API_KEY,
        'User-Agent': USER_AGENT,
      },
    });

    if (!detailsResponse.ok) {
      console.error(
        `Error fetching details for podcast ID "${podcastId}" (${podcastName}): ${detailsResponse.status} ${detailsResponse.statusText}`
      );
      const errorBody = await detailsResponse.text();
      console.error('Error body:', errorBody);
      return null;
    }

    const detailsData = await detailsResponse.json();

    // 3. Extract and structure the data
    const image = detailsData.image || detailsData.thumbnail || PLACEHOLDER_IMAGE_URL;
    // Prioritize genres from search results if they are an array of strings
    let genres = podcastSearchResult.genres || [];
    if (!Array.isArray(genres) || !genres.every((g) => typeof g === 'string')) {
      // Fallback to genre_ids from detailsData if search result genres are not suitable
      // For simplicity, we'll store genre_ids directly if names aren't readily available.
      // A more robust solution would map these IDs to names.
      genres = detailsData.genre_ids || [];
    }

    return {
      id: detailsData.id,
      title: detailsData.title || podcastSearchResult.title_original,
      image: image,
      publisher: detailsData.publisher || podcastSearchResult.publisher_original,
      genres: genres,
      episode_count: detailsData.total_episodes,
      description: detailsData.description || podcastSearchResult.description_original,
      website: detailsData.website,
      listennotes_url: detailsData.listennotes_url,
      latest_pub_date_ms: detailsData.latest_pub_date_ms,
      explicit_content: detailsData.explicit_content,
      // rating: detailsData.rating || null, // ListenNotes API doesn't seem to provide a direct rating field
    };
  } catch (error) {
    console.error(`An unexpected error occurred while fetching data for "${podcastName}":`, error);
    return null;
  }
}

// --- Main Function ---

/**
 * Main script function to fetch podcast details.
 */
async function main() {
  console.log('Starting podcast fetching script...');

  if (!LISTEN_NOTES_API_KEY) {
    console.error('Error: LISTEN_NOTES_API_KEY is not set in .env file. Exiting.');
    process.exit(1);
  }

  let podcastInput;
  try {
    const fileContent = await fs.readFile(PODCAST_INPUT_FILE, 'utf-8');
    podcastInput = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing input file "${PODCAST_INPUT_FILE}":`, error.message);
    process.exit(1);
  }

  if (!Array.isArray(podcastInput) || !podcastInput.every((p) => typeof p.name === 'string')) {
    console.error(
      `Invalid format in "${PODCAST_INPUT_FILE}". Expected an array of objects with a "name" property.`
    );
    process.exit(1);
  }

  const allPodcastDetails = [];
  console.log(`Found ${podcastInput.length} podcasts in the input file.`);

  for (let i = 0; i < podcastInput.length; i++) {
    const podcast = podcastInput[i];
    console.log(`\nProcessing podcast ${i + 1} of ${podcastInput.length}: "${podcast.name}"`);
    const podcastData = await fetchPodcastData(podcast.name);
    if (podcastData) {
      allPodcastDetails.push(podcastData);
      console.log(`Successfully fetched data for "${podcast.name}"`);
    } else {
      console.warn(`Could not fetch data for "${podcast.name}". It will be skipped.`);
    }
  }

  const outputData = {
    allPodcasts: allPodcastDetails,
  };

  try {
    await fs.writeFile(PODCAST_OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(
      `\nSuccessfully wrote ${allPodcastDetails.length} podcast details to "${PODCAST_OUTPUT_FILE}"`
    );
  } catch (error) {
    console.error(`Error writing output file "${PODCAST_OUTPUT_FILE}":`, error.message);
    process.exit(1);
  }

  console.log('Podcast fetching script finished.');
}

// --- Script Execution ---

main().catch((error) => {
  console.error('Unhandled error in main execution:', error);
  process.exit(1);
});
