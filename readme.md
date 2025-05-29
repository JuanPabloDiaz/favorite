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

### IGDB API Credentials (for Game Data)

This project uses the Internet Game Database (IGDB) API, via the Twitch Developer portal, to fetch video game data. To use it, you'll need to register an application on Twitch and get a Client ID and Client Secret.

**Steps to get your IGDB Credentials:**

1.  **Go to the Twitch Developer Portal:** Navigate to [https://dev.twitch.tv/](https://dev.twitch.tv/).
2.  **Log In/Sign Up:** Log in with your existing Twitch account, or create one if you don't have it.
3.  **Register Your Application:**
    *   Once logged in, go to your Dashboard or the "Applications" section.
    *   Click on "Register Your Application" (or a similar button like "+ Register Application").
    *   **Name:** Give your application a unique name (e.g., "MyFavoritesSite_Games").
    *   **OAuth Redirect URLs:** For this project, you can typically set this to `http://localhost:3000` or any placeholder URL if you don't intend to use OAuth for user authentication (the script uses server-to-server authentication).
    *   **Category:** Choose "API" or "Application Integration" (select the most fitting category available).
    *   Click "Create".
4.  **Get Your Client ID:** After your application is registered, you will be taken to its management page. Your **Client ID** will be visible here. Copy it.
5.  **Generate a Client Secret:** On the same application management page, find the button to generate a "New Secret" (or similar). Click it to generate your **Client Secret**.
    *   **Important:** Copy your new Client Secret immediately and store it securely. Twitch will only show it to you once. If you lose it, you'll need to generate a new one.
6.  **Set Up Environment Variables:**
    *   If you haven't already, create a `.env` file in the root of the project by copying the example file:
        ```bash
        cp .env.example .env
        ```
    *   Open the `.env` file and add your credentials:
        ```env
        IGDB_CLIENT_ID=your_twitch_client_id_here
        IGDB_CLIENT_SECRET=your_twitch_client_secret_here
        ```
        Replace `your_twitch_client_id_here` and `your_twitch_client_secret_here` with your actual credentials.

These Client ID and Client Secret will be used by the `fetch-games.js` script to automatically obtain an OAuth access token from Twitch. This token is then used to authorize requests to the IGDB API.

After adding your API keys and credentials, you'll need to fetch the initial data. See the "Fetching Data" section under "Available Scripts" for more details (e.g., run `npm run fetch-data`).

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
