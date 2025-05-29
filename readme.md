# 🎬 Juan’s Favorites

Juan’s Favorites is a personal web application built with Astro that showcases a curated collection of my favorite movies and TV shows. The application fetches real-time data from the TMDB API, providing detailed information such as titles, release dates, ratings, and more.

Read the [Spanish README](readme-es.md) for more information.

## 🌐 Live Demo

- Main site: fav.jpdiaz.dev
- Fallback: juan-favorites.pages.dev

## 🚀 Technologies Used

- Astro – Modern framework for building fast websites.
- Tailwind CSS – Utility-first CSS framework for responsive design.
- TMDB API – Source of movie and TV show data.
- Cloudflare Pages – Deployment platform for static sites.

## 🧰 Project Structure

```
juan-favorites/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable components
│   ├── layouts/          # Layout templates
│   ├── pages/            # Site pages
│   └── styles/           # Global styles
├── .env.example          # Example environment variables
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
└── tailwind.config.cjs   # Tailwind CSS configuration
```

⚙️ Getting Started

1. Clone the repository:

```bash
git clone https://github.com/JuanPabloDiaz/juan-favorites.git
cd juan-favorites
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file and replace `YOUR_TMDB_API_KEY` with your TMDB API key.

### Listen Notes API Key

Additionally, this project uses the Listen Notes API for podcast data. You'll need to obtain an API key from [Listen Notes](https://www.listennotes.com/api/).

Once you have your API key, add it to your `.env` file like this:

```
LISTEN_NOTES_API_KEY=YOUR_LISTEN_NOTES_API_KEY
```

After adding your API keys, you'll need to fetch the initial data. See the "Fetching Data" section under "Available Scripts" for more details (e.g., run `npm run fetch-data`).

### Managing Favorite Podcasts

Your favorite podcasts are managed through the `src/data/myFavPodcasts.json` file. To add, remove, or change the podcasts displayed on the site, edit this file.

The format for this file is a simple JSON array of objects, where each object has a "name" key:

```json
[{ "name": "Podcast Name 1" }, { "name": "Another Podcast Title" }]
```

**Important Steps After Editing `myFavPodcasts.json`:**

1.  **Run the Fetch Script**: After modifying `myFavPodcasts.json`, you **must** run the podcast fetching script to update the detailed podcast data stored in `src/data/podcastDetails.json`. You can do this by running:

    ```bash
    npm run fetch-podcasts
    ```

    Alternatively, you can run `npm run fetch-data` to update data for all media types (movies, music, podcasts).

2.  **Check Console Output**: The `fetch-podcasts.js` script will log its progress in the console. If a podcast name from `myFavPodcasts.json` cannot be found via the Listen Notes API, a warning will be logged. The script will continue with other podcasts.

    - If a podcast isn't appearing on your site, check the console output from the fetch script.
    - Verify the spelling of the podcast name in `myFavPodcasts.json`.
    - Sometimes, the Listen Notes API may require a more specific name or might not have the exact podcast you're looking for. Try variations if needed.

3.  Start the development server:

```bash
npm run dev
```

5. View the application:
   Open your browser and navigate to `http://localhost:3000` to see the application in action.

### Listen Notes API Considerations

- **API Limits**: The Listen Notes API has usage limits. On the free tier, this is typically around 10,000 requests per month (but always check their official website for current details). Each podcast search and subsequent detail fetch in the `fetch-podcasts.js` script counts as API calls.
- **Script Delay**: The `fetch-podcasts.js` script includes a 1-second delay between API calls. This is to respect the API's rate limits and avoid overwhelming the service. Fetching a very large list of new podcasts for the first time might take a while.
- **Search Accuracy**: The accuracy of podcast data depends on the names provided in `myFavPodcasts.json` and how well they match entries in the Listen Notes database. If a podcast isn't found, try using a more specific or alternative name.
- **Metadata Availability**: Not all podcasts will have complete metadata (e.g., artwork, detailed descriptions, specific genre names). The application uses placeholder images when artwork is missing.

## 📦 Available Scripts

- `npm run dev` – Start the development server.
- `npm run build` – Build the project for production.
- `npm run preview` – Preview the production build locally.
- `npm run fetch-movies` – Fetches movie data from TMDB API. (Assuming this was the original intent for a more specific script if `fetch-music` and `fetch-podcasts` exist)
- `npm run fetch-music` – Fetches music data from MusicBrainz API. (Assuming this script exists or will exist)
- `npm run fetch-podcasts` – Fetches details for podcasts listed in `src/data/myFavPodcasts.json` using the Listen Notes API.
- `npm run fetch-data` – Runs all data fetching scripts (movies, music, podcasts).
- `npm run format` – Run Prettier to format the code.

## ✨ Podcasts Integration Details

This section outlines the files that were added or changed to integrate the podcast functionality.

### New Files Created:

- `scripts/fetch-podcasts.js`: Node.js script to fetch podcast data from the Listen Notes API based on `myFavPodcasts.json`.
- `src/data/myFavPodcasts.json`: User-managed list of favorite podcast names.
- `src/data/podcastDetails.json`: Stores detailed podcast information fetched by `fetch-podcasts.js`. (This file is gitignored and generated locally).
- `src/components/PodcastCard.astro`: Astro component to display a single podcast card.
- `src/pages/podcasts/index.astro`: Main page for listing all favorite podcasts.
- `src/pages/fragments/PodcastList/index.astro`: Astro fragment that fetches and renders the list of podcast cards.
- `src/pages/podcasts/[id].astro`: Dynamic page for displaying details of a single podcast.
- `src/pages/fragments/PodcastDetails/[id].astro`: Astro fragment that fetches and renders the details for a specific podcast.

### Existing Files Modified:

- `.env.example`: Added `LISTEN_NOTES_API_KEY` placeholder.
- `package.json`: Added `fetch-podcasts` script and updated `fetch-data` script.
- `astro.config.mjs`: Added `LISTEN_NOTES_API_KEY` to `vite.define` for environment variable access.
- `src/components/Nav.astro`: Added a "Podcasts" link to the main navigation.
- `readme.md`: Updated with documentation for the podcast feature (this file).

**Note on Data Loading:** During development and testing, `src/pages/fragments/PodcastList/index.astro` and `src/pages/fragments/PodcastDetails/[id].astro` were updated from using `node:fs/promises` to `Astro.glob()` for importing the `podcastDetails.json` data. This change was made to resolve build issues related to Node.js built-in module resolution in the Astro/Vite environment.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.
