// Function to check if a domain is accessible
async function isDomainAccessible(domain) {
  try {
    const response = await fetch(`https://${domain}`);
    return response.ok;
  } catch {
    return false;
  }
}

// Function to get the active domain
export async function getActiveDomain() {
  const primaryDomain = 'fav.jpdiaz.dev';
  const backupDomain = 'juan-favorites.vercel.app';

  return (await isDomainAccessible(primaryDomain)) ? primaryDomain : backupDomain;
}

export const metadata = {
  name: "Juan's Favorites",
  primaryDomain: 'fav.jpdiaz.dev',
  backupDomain: 'juan-favorites.vercel.app',
  // These will be updated dynamically
  domain: 'fav.jpdiaz.dev',
  baseUrl: 'https://fav.jpdiaz.dev',
  defaultLanguage: 'en',
  defaultDescription:
    'Explore my personal collection of favorite movies and TV shows. A carefully curated selection of audiovisual content including action movies, drama, comedy, and shows in English.',

  pages: {
    home: {
      title: "Juan's Favorites - Movies and TV Shows Collection",
      description:
        'Explore my personal collection of favorite movies, including action, drama, comedy, and more. A carefully curated selection of the best films of all time.',
      priority: 1.0,
      changefreq: 'weekly',
    },
    tv: {
      title: "Favorite TV Shows - Juan's Favorites",
      description:
        'Discover my personal selection of favorite TV shows, including dramas, comedies, and more. A carefully curated collection of the best series.',
      priority: 0.8,
      changefreq: 'weekly',
    },
    about: {
      title: "About - Juan's Favorites",
      description:
        'Learn more about this personal collection of movies and TV shows, and why these works have been selected as favorites.',
      priority: 0.5,
      changefreq: 'monthly',
    },
    search: {
      title: "Search - Juan's Favorites",
      description:
        'Search specific movies and TV shows in our personal collection. Find content by title, genre, or description.',
      priority: 0.7,
      changefreq: 'weekly',
    },
  },
};
