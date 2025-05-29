# 🎬 Juan’s Favorites

Juan’s Favorites is a personal web application built with Astro that showcases a curated collection of my favorite movies and TV shows. The application fetches real-time data from the TMDB API, providing detailed information such as titles, release dates, ratings, and more.

Read the [Spanish README](readme-es.md) for more information.

## 🌐 Live Demo
	•	Main site: fav.jpdiaz.dev
	•	Fallback: juan-favorites.pages.dev

## 🚀 Technologies Used
	•	Astro – Modern framework for building fast websites.
	•	Tailwind CSS – Utility-first CSS framework for responsive design.
	•	TMDB API – Source of movie and TV show data.
	•	Cloudflare Pages – Deployment platform for static sites.

## 🧰 Project Structure

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

⚙️ Getting Started
	1.	Clone the repository:

git clone https://github.com/JuanPabloDiaz/juan-favorites.git
cd juan-favorites


	2.	Install dependencies:

npm install


	3.	Set up environment variables:

cp .env.example .env

Edit the .env file and replace YOUR_TMDB_API_KEY with your TMDB API key.

	4.	Start the development server:

npm run dev


	5.	View the application:
Open your browser and navigate to http://localhost:3000 to see the application in action.

## 📦 Available Scripts
	•	npm run dev – Start the development server.
	•	npm run build – Build the project for production.
	•	npm run preview – Preview the production build locally.
    •	npm run fetch-data – Fetch data from TMDB API and save it to JSON files.

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.