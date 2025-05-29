const fs = require('fs').promises;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const USER_AGENT = 'JuanFavArtists/1.0 ( juandavid@hey.com )'; // Replace with actual app name and contact
const DELAY_MS = 1000; // 1 second delay for API calls

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchArtistMBID(artistName) {
  const url = `https://musicbrainz.org/ws/2/artist/?query=artist:"${encodeURIComponent(artistName)}"&fmt=json`;
  console.log(`Fetching MBID for: ${artistName} from ${url}`);
  try {
    await delay(DELAY_MS); // Adhere to rate limit
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!response.ok) {
      console.error(
        `Error fetching MBID for ${artistName}: ${response.status} ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    if (data.artists && data.artists.length > 0) {
      if (data.artists.length > 1) {
        console.warn(
          `Multiple artists found for "${artistName}". Using the first result: ${data.artists[0].name} (MBID: ${data.artists[0].id})`
        );
      }
      return data.artists[0].id;
    } else {
      console.warn(`No artists found for "${artistName}".`);
      return null;
    }
  } catch (error) {
    console.error(`Exception fetching MBID for ${artistName}:`, error);
    return null;
  }
}

async function fetchArtistDetails(mbid) {
  const url = `https://musicbrainz.org/ws/2/artist/${mbid}?inc=url-rels+aliases+tags+genres+ratings+release-groups&fmt=json`;
  console.log(`Fetching details for MBID: ${mbid} from ${url}`);
  try {
    await delay(DELAY_MS); // Adhere to rate limit
    const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!response.ok) {
      console.error(
        `Error fetching details for MBID ${mbid}: ${response.status} ${response.statusText}`
      );
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Exception fetching details for MBID ${mbid}:`, error);
    return null;
  }
}

async function fetchCoverArt(artistDetails) {
  if (
    !artistDetails ||
    !artistDetails['release-groups'] ||
    artistDetails['release-groups'].length === 0
  ) {
    console.log(`No release groups found for ${artistDetails.name} to fetch cover art.`);
    artistDetails.image_url = null;
    return;
  }

  console.log(`Attempting to fetch cover art for ${artistDetails.name}...`);
  // Prioritize "Album" type releases
  const sortedReleaseGroups = [...artistDetails['release-groups']].sort((a, b) => {
    if (a['primary-type'] === 'Album' && b['primary-type'] !== 'Album') return -1;
    if (a['primary-type'] !== 'Album' && b['primary-type'] === 'Album') return 1;
    return 0;
  });

  for (const releaseGroup of sortedReleaseGroups) {
    const releaseGroupMbid = releaseGroup.id;
    const coverArtUrl = `https://coverartarchive.org/release-group/${releaseGroupMbid}`;
    console.log(
      `Checking for cover art for release group: ${releaseGroup.title} (MBID: ${releaseGroupMbid}) at ${coverArtUrl}`
    );

    try {
      await delay(DELAY_MS); // Adhere to rate limit for Cover Art Archive
      const response = await fetch(coverArtUrl, { headers: { 'User-Agent': USER_AGENT } }); // User-Agent might not be strictly needed for CAA but good practice

      if (response.ok) {
        const coverData = await response.json();
        if (coverData.images && coverData.images.length > 0) {
          // Prefer a "front" image if available
          let imageUrl =
            coverData.images.find((img) => img.front)?.thumbnails?.large ||
            coverData.images.find((img) => img.front)?.image ||
            coverData.images[0]?.thumbnails?.large ||
            coverData.images[0]?.image;

          if (imageUrl) {
            console.log(`Found cover art for ${artistDetails.name}: ${imageUrl}`);
            artistDetails.image_url = imageUrl;
            return; // Found an image, stop here
          }
        }
      } else if (response.status === 404) {
        console.log(`No cover art found for release group MBID ${releaseGroupMbid} (404).`);
      } else {
        console.warn(
          `Error fetching cover art for release group MBID ${releaseGroupMbid}: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.error(
        `Exception fetching cover art for release group MBID ${releaseGroupMbid}:`,
        error
      );
    }
  }

  console.log(`No cover art found for ${artistDetails.name} after checking release groups.`);
  artistDetails.image_url = null; // Default if no image is found
}

async function main() {
  let myFavArtists;
  try {
    const artistsFileContent = await fs.readFile('src/data/myFavArtists.json', 'utf-8');
    myFavArtists = JSON.parse(artistsFileContent);
  } catch (error) {
    console.error('Error reading or parsing src/data/myFavArtists.json:', error);
    return;
  }

  const allArtistDetails = [];
  console.log(`Starting to fetch details for ${myFavArtists.length} artists.`);

  for (let i = 0; i < myFavArtists.length; i++) {
    const artist = myFavArtists[i];
    console.log(`\nProcessing artist ${i + 1}/${myFavArtists.length}: ${artist.name}`);

    const mbid = await fetchArtistMBID(artist.name);
    if (!mbid) {
      console.warn(`Skipping ${artist.name} due to missing MBID.`);
      continue;
    }

    const artistDetails = await fetchArtistDetails(mbid);
    if (!artistDetails) {
      console.warn(`Skipping ${artist.name} due to missing details.`);
      continue;
    }

    // Ensure essential fields are present, even if empty, to match expected structure
    artistDetails.id = artistDetails.id || mbid; // MBID should be the ID
    artistDetails.name = artistDetails.name || artist.name; // Fallback to original name
    artistDetails.country = artistDetails.country || null;
    artistDetails.area = artistDetails.area || null;
    artistDetails.disambiguation = artistDetails.disambiguation || null;
    artistDetails.genres = artistDetails.genres || [];
    artistDetails.tags = artistDetails.tags || [];
    artistDetails.rating = artistDetails.rating || {};
    artistDetails['url-rels'] = artistDetails['url-rels'] || []; // For external links

    await fetchCoverArt(artistDetails); // This will add image_url or set it to null

    allArtistDetails.push(artistDetails);
    console.log(`Successfully processed and added ${artistDetails.name}.`);
  }

  try {
    const outputData = { allArtists: allArtistDetails };
    await fs.writeFile('src/data/artistDetails.json', JSON.stringify(outputData, null, 2));
    console.log(
      '\nSuccessfully fetched and wrote all artist details to src/data/artistDetails.json'
    );
  } catch (error) {
    console.error('Error writing artistDetails.json:', error);
  }
}

main().catch((error) => {
  console.error('Unhandled error in main function:', error);
});
