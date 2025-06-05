import fs from 'fs/promises';

async function extractPodcasts() {
  try {
    const fileContent = await fs.readFile('src/data/mySpotifyLibrary.json', 'utf-8');
    const data = JSON.parse(fileContent);

    const matches = [];

    function search(obj, parent = {}) {
      if (typeof obj === 'string') {
        if (obj.toLowerCase().includes('podcast') && parent.name) {
          matches.push({ name: parent.name });
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item) => search(item, item));
      } else if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach((value) => search(value, obj));
      }
    }

    search(data);

    // Eliminar duplicados por nombre
    const unique = Array.from(new Map(matches.map((p) => [p.name, p])).values());

    await fs.writeFile('src/data/myFavPodcasts.json', JSON.stringify(unique, null, 2));
    console.log(`Extracted ${unique.length} unique podcasts.`);
  } catch (error) {
    console.error('Error processing file:', error);
  }
}

extractPodcasts();
