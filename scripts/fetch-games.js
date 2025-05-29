import 'dotenv/config';
import fs from 'fs/promises';
import fetch from 'node-fetch';

// --- Constants ---
const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
const IGDB_CLIENT_SECRET = process.env.IGDB_CLIENT_SECRET;
const USER_AGENT = 'JuanFavGames_IGDB_Integration/1.0 (YOUR_CONTACT_INFO)'; // TODO: Update contact info
const DELAY_MS = 300; // IGDB rate limit is generous (4 req/s), but good to be safe. ~250ms per req.
const GAME_INPUT_FILE = 'src/data/myFavGames.json';
const GAME_OUTPUT_FILE = 'src/data/gameDetails.json';
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/500x750.png?text=No+Cover+Art';
const IGDB_API_BASE_URL = 'https://api.igdb.com/v4';
const TWITCH_AUTH_URL = 'https://id.twitch.tv/oauth2/token';

let accessToken = null;

// --- Helper Functions ---

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function getIgdbImageUrl(imageId, size = 'cover_big') {
  if (!imageId) return null;
  // Ensures scheme is present, defaults to https
  return `https://images.igdb.com/igdb/image/upload/t_${size}/${imageId}.jpg`;
}

function convertUnixTimestampToYear(timestamp) {
  if (!timestamp) return null;
  return new Date(timestamp * 1000).getFullYear().toString();
}

function convertUnixTimestampToDateString(timestamp) {
    if (!timestamp) return null;
    const date = new Date(timestamp * 1000);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


async function getIgdbAccessToken() {
  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    console.error('IGDB_CLIENT_ID or IGDB_CLIENT_SECRET is not set in .env file.');
    return null;
  }
  try {
    const response = await fetch(TWITCH_AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=${IGDB_CLIENT_ID}&client_secret=${IGDB_CLIENT_SECRET}&grant_type=client_credentials`,
    });
    if (!response.ok) {
      console.error(`Error fetching Twitch access token: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }
    const data = await response.json();
    console.log('Successfully obtained IGDB access token.');
    return data.access_token;
  } catch (error) {
    console.error('Unexpected error fetching Twitch access token:', error);
    return null;
  }
}

async function fetchGameData(gameName) {
  if (!accessToken) {
    console.error('Access token is not available. Cannot fetch game data.');
    return null;
  }
  console.log(`\nFetching IGDB data for: "${gameName}"`);

  const query = `
    fields 
        id, name, slug, summary, first_release_date, aggregated_rating, 
        cover.image_id,
        genres.name, 
        platforms.name, 
        involved_companies.developer, 
        involved_companies.publisher,
        involved_companies.company.name,
        screenshots.image_id,
        websites.url,
        websites.category;
    search "${gameName.replace(/"/g, '\\"')}";
    limit 1; 
  `;

  try {
    await delay(DELAY_MS);
    const response = await fetch(`${IGDB_API_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': IGDB_CLIENT_ID,
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json', // Though IGDB uses text/plain for request body, it returns application/json
        'User-Agent': USER_AGENT,
      },
      body: query, // Request body is plain text for APOCALYPTO
    });

    if (!response.ok) {
      console.error(`Error fetching data for "${gameName}" from IGDB: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error('Error body:', errorBody);
      return null;
    }

    const results = await response.json();
    if (!results || results.length === 0) {
      console.warn(`No game found on IGDB for "${gameName}".`);
      return null;
    }

    const gameData = results[0];

    const developers = gameData.involved_companies?.filter(ic => ic.developer).map(ic => ic.company?.name).filter(Boolean) || [];
    const publishers = gameData.involved_companies?.filter(ic => ic.publisher).map(ic => ic.company?.name).filter(Boolean) || [];
    const genres = gameData.genres?.map(g => g.name).filter(Boolean) || [];
    const platforms = gameData.platforms?.map(p => p.name).filter(Boolean) || [];
    
    let officialWebsite = gameData.websites?.find(w => w.category === 1)?.url || null;
    if (!officialWebsite) {
        officialWebsite = gameData.websites?.find(w => w.category === 13)?.url || // Steam
                          gameData.websites?.find(w => w.category === 17)?.url || // GOG
                          gameData.websites?.find(w => w.category === 16)?.url || // Epic Games
                          null;
    }
    // Ensure website URL has a scheme
    if (officialWebsite && officialWebsite.startsWith('//')) {
        officialWebsite = 'https:' + officialWebsite;
    } else if (officialWebsite && !officialWebsite.startsWith('http')) {
        officialWebsite = 'https://' + officialWebsite;
    }


    return {
      id: gameData.id,
      slug: gameData.slug || null,
      name: gameData.name || gameName,
      description_raw: gameData.summary || '',
      metacritic: gameData.aggregated_rating ? Math.round(gameData.aggregated_rating) : null,
      released: convertUnixTimestampToDateString(gameData.first_release_date),
      background_image: getIgdbImageUrl(gameData.cover?.image_id, 'cover_big') || PLACEHOLDER_IMAGE_URL,
      website: officialWebsite,
      platforms: platforms,
      developers: developers,
      publishers: publishers,
      genres: genres,
      short_screenshots: gameData.screenshots?.map(s => getIgdbImageUrl(s.image_id, 'screenshot_med')).filter(Boolean) || [],
    };

  } catch (error) {
    console.error(`Unexpected error while fetching IGDB data for "${gameName}":`, error);
    return null;
  }
}


// --- Main Function ---
async function main() {
  console.log('Starting IGDB game fetching script...');

  if (!IGDB_CLIENT_ID || !IGDB_CLIENT_SECRET) {
    console.error('Error: IGDB_CLIENT_ID or IGDB_CLIENT_SECRET is not set in .env file. Exiting.');
    process.exit(1);
  }

  accessToken = await getIgdbAccessToken();
  if (!accessToken) {
    console.error('Failed to obtain access token. Exiting.');
    process.exit(1);
  }

  let gameInput;
  try {
    const fileContent = await fs.readFile(GAME_INPUT_FILE, 'utf-8');
    gameInput = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading or parsing input file "${GAME_INPUT_FILE}":`, error.message);
    process.exit(1);
  }

  if (!Array.isArray(gameInput) || !gameInput.every((g) => typeof g.name === 'string')) {
    console.error(
      `Invalid format in "${GAME_INPUT_FILE}". Expected an array of objects with a "name" property.`
    );
    process.exit(1);
  }

  const allGameDetails = [];
  console.log(`Found ${gameInput.length} games in the input file.`);

  for (let i = 0; i < gameInput.length; i++) {
    const game = gameInput[i];
    const gameData = await fetchGameData(game.name);
    if (gameData) {
      allGameDetails.push(gameData);
      console.log(`Successfully fetched and processed data for "${game.name}" from IGDB.`);
    } else {
      console.warn(`Could not fetch data for "${game.name}" from IGDB. It will be skipped.`);
    }
  }

  const outputData = {
    allGames: allGameDetails,
  };

  try {
    await fs.writeFile(GAME_OUTPUT_FILE, JSON.stringify(outputData, null, 2));
    console.log(
      `\nSuccessfully wrote ${allGameDetails.length} game details to "${GAME_OUTPUT_FILE}"`
    );
  } catch (error) {
    console.error(`Error writing output file "${GAME_OUTPUT_FILE}":`, error.message);
    process.exit(1);
  }

  console.log('IGDB Game fetching script finished.');
}

// --- Script Execution ---
main().catch((error) => {
  console.error('Unhandled error in main IGDB execution:', error);
  process.exit(1);
});