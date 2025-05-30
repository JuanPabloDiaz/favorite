# 🎬 Juan's Favorites

Juan's Favorites is a personal web application built with Astro that showcases a curated collection of my favorite books, movies, TV shows, games, artists, and podcasts. The application fetches real-time data from multiple APIs, providing detailed information such as titles, release dates, ratings, and more.

Read the [Spanish README](readme-es.md) for more information.

## 🌐 Live Demo

- Main site: fav.jpdiaz.dev
- Fallback: juan-favorites.pages.dev

## 📚 Content Categories

- **Books** — Fiction, non-fiction, and everything in between
- **Movies** — Cinema that left an impression  
- **TV Shows** — Series worth your time
- **Games** — Interactive experiences that captivate
- **Artists** — Musicians and creators who inspire
- **Podcasts** — Conversations and stories worth hearing

## 🚀 Technologies Used

- Astro – Modern framework for building fast websites.
- Tailwind CSS – Utility-first CSS framework for responsive design.
- TMDB API – Source of movie and TV show data.
- Listen Notes API – Podcast data and metadata.
- IGDB API – Video game information via Twitch Developer portal.
- MusicBrainz API – Artist and music data.
- Cloudflare Pages – Deployment platform for static sites.

## 🧰 Project Structure

```
juan-favorites/
├── public/               # Static assets
├── scripts/              # Generate data files
├── src/
│   ├── components/       # Reusable components
│   ├── config/           # Configuration files
│   ├── data/             # Data files
│   ├── layouts/          # Layout templates
│   ├── pages/            # Site pages
│   ├── scripts/          # JavaScript files
│   └── styles/           # Global styles
├── .env.example          # Example environment variables
├── astro.config.mjs      # Astro configuration
├── package.json          # Dependencies and scripts
└── tailwind.config.cjs   # Tailwind CSS configuration
```

## ⚙️ Getting Started

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

Edit the `.env` file and replace the placeholder values with your actual API keys.

4. Fetch initial data:

```bash
npm run fetch-data
```

5. Start the development server:

```bash
npm run dev
```

6. View the application:
   Open your browser and navigate to `http://localhost:4321` to see the application in action.

## 🔑 API Setup

<details>

1. Go to [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Create an account and request an API key
3. Add it to your `.env` file:
   ```
   TMDB_API_KEY=YOUR_TMDB_API_KEY
   ```
</details>

<details>
<summary><strong>🎵 MusicBrainz API (Artists)</strong></summary>

MusicBrainz API doesn't require an API key, but you should set a proper User-Agent string:

```
MUSICBRAINZ_USER_AGENT=YourAppName/1.0.0 (your-email@example.com)
```
</details>

<details>
<summary><strong>🎙️ Listen Notes API Key (Podcasts)</strong></summary>

1. Go to [Listen Notes API](https://www.listennotes.com/api/)
2. Sign up and get your API key
3. Add it to your `.env` file:
   ```
   LISTEN_NOTES_API_KEY=YOUR_LISTEN_NOTES_API_KEY
   ```

**API Considerations:**
- **API Limits**: Free tier typically allows ~10,000 requests per month
- **Script Delay**: The fetch script includes a 1-second delay between API calls to respect rate limits
- **Search Accuracy**: Depends on podcast names in `myFavPodcasts.json` matching Listen Notes database
</details>

<details>
<summary><strong>🎮 IGDB API Credentials (Games)</strong></summary>

This project uses the Internet Game Database (IGDB) API via the Twitch Developer portal.

**Steps to get your IGDB Credentials:**

1. **Go to the Twitch Developer Portal:** Navigate to [https://dev.twitch.tv/](https://dev.twitch.tv/)
2. **Log In/Sign Up:** Log in with your existing Twitch account, or create one if you don't have it
3. **Register Your Application:**
   - Once logged in, go to your Dashboard or the "Applications" section
   - Click on "Register Your Application" (or "+ Register Application")
   - **Name:** Give your application a unique name (e.g., "MyFavoritesSite_Games")
   - **OAuth Redirect URLs:** Set this to `http://localhost:3000` or any placeholder URL
   - **Category:** Choose "API" or "Application Integration"
   - Click "Create"
4. **Get Your Client ID:** Your **Client ID** will be visible on the application management page
5. **Generate a Client Secret:** Click "New Secret" to generate your **Client Secret**
   - **Important:** Copy it immediately and store it securely. Twitch only shows it once
6. **Set Up Environment Variables:**
   ```env
   IGDB_CLIENT_ID=your_twitch_client_id_here
   IGDB_CLIENT_SECRET=your_twitch_client_secret_here
   ```

These credentials will be used to automatically obtain an OAuth access token from Twitch for IGDB API requests.
</details>

<details>
<summary><strong>📖 Books API Setup</strong></summary>

*Add your books API configuration details here when implemented*

```
BOOKS_API_KEY=YOUR_BOOKS_API_KEY
```
</details>

## 📦 Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the project for production
- `npm run preview` – Preview the production build locally
- `npm run fetch-movies` – Fetches movie data from TMDB API
- `npm run fetch-music` – Fetches music data from MusicBrainz API
- `npm run fetch-podcasts` – Fetches podcast details using Listen Notes API
- `npm run fetch-games` – Fetches game data from IGDB API
- `npm run fetch-books` – Fetches book data *(when implemented)*
- `npm run fetch-data` – Runs all data fetching scripts
- `npm run format` – Run Prettier to format the code

## 📱 Content Management

<details>
<summary><strong>🎙️ Managing Favorite Podcasts</strong></summary>

Your favorite podcasts are managed through the `src/data/myFavPodcasts.json` file. To add, remove, or change the podcasts displayed on the site, edit this file.

The format is a simple JSON array of objects:

```json
[
  { "name": "Podcast Name 1" }, 
  { "name": "Another Podcast Title" }
]
```

**Important Steps After Editing:**

1. **Run the Fetch Script**: After modifying `myFavPodcasts.json`, you **must** run:
   ```bash
   npm run fetch-podcasts
   ```

2. **Check Console Output**: The script will log its progress. If a podcast name cannot be found, a warning will be logged.

3. **Troubleshooting**: If a podcast isn't appearing:
   - Check the console output from the fetch script
   - Verify the spelling of the podcast name
   - Try variations of the name if the API can't find an exact match
</details>

<details>
<summary><strong>🎵 Managing Favorite Artists</strong></summary>

*Add details about managing artists when the feature is fully implemented*

Favorite artists are managed through `src/data/myFavArtists.json`:

```json
[
  { "name": "Artist Name 1" },
  { "name": "Another Artist" }
]
```

Run `npm run fetch-music` after making changes.
</details>

<details>
<summary><strong>🎮 Managing Favorite Games</strong></summary>

*Add details about managing games when the feature is fully implemented*

Games are managed through the IGDB integration. Run `npm run fetch-games` to update game data.
</details>

<details>
<summary><strong>📖 Managing Favorite Books</strong></summary>

*Add details about managing books when the feature is fully implemented*

Books will be managed through `src/data/myFavBooks.json`:

```json
[
  { "title": "Book Title", "author": "Author Name" }
]
```

Run `npm run fetch-books` after making changes.
</details>

## ✨ Integration Details

<details>
<summary><strong>🎙️ Podcasts Integration</strong></summary>

**New Files Created:**
- `scripts/fetch-podcasts.js`: Node.js script to fetch podcast data from Listen Notes API
- `src/data/myFavPodcasts.json`: User-managed list of favorite podcast names
- `src/data/podcastDetails.json`: Stores detailed podcast information (gitignored, generated locally)
- `src/components/PodcastCard.astro`: Component to display a single podcast card
- `src/pages/podcasts/index.astro`: Main page for listing all favorite podcasts
- `src/pages/fragments/PodcastList/index.astro`: Fragment that fetches and renders podcast cards
- `src/pages/podcasts/[id].astro`: Dynamic page for displaying podcast details
- `src/pages/fragments/PodcastDetails/[id].astro`: Fragment for specific podcast details

**Existing Files Modified:**
- `.env.example`: Added `LISTEN_NOTES_API_KEY` placeholder
- `package.json`: Added `fetch-podcasts` script and updated `fetch-data` script
- `astro.config.mjs`: Added `LISTEN_NOTES_API_KEY` to `vite.define`
- `src/components/Nav.astro`: Added "Podcasts" link to navigation

**Note on Data Loading:** Components use `Astro.glob()` for importing `podcastDetails.json` data to resolve build issues with Node.js built-in modules in the Astro/Vite environment.
</details>

<details>
<summary><strong>🎵 Artists Integration</strong></summary>

*Add details about artists integration files and structure when implemented*
</details>

<details>
<summary><strong>🎮 Games Integration</strong></summary>

*Add details about games integration files and structure when implemented*
</details>

<details>
<summary><strong>📖 Books Integration</strong></summary>

*Add details about books integration files and structure when implemented*
</details>

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Built with ❤️ by [Juan Pablo Diaz](https://jpdiaz.dev)