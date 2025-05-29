const fs = require('fs').promises;
// node-fetch v3 is ESM-only, so we'll use dynamic import later

const BOOK_INPUT_FILE = 'src/data/myFavBooks.json';
const BOOK_OUTPUT_FILE = 'src/data/books/bookDetails.json';
const API_DELAY_MS = 500; // ms to wait between API calls
const USER_AGENT = 'JuanFavBooks_OpenLibrary_Integration/1.0 (https://fav.jpdiaz.dev; jpdiaz.contact@gmail.com)';
const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/500x750.png?text=No+Cover+Art';

let fetch; // Will be dynamically imported

// Helper Functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getOpenLibraryImageUrl = (coverId, size = 'L') => {
  if (coverId && Number.isInteger(parseInt(coverId)) && parseInt(coverId) > 0) {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
  return PLACEHOLDER_IMAGE_URL;
};

const extractYear = (dateString) => {
  if (!dateString) return null;
  const yearMatch = dateString.match(/\d{4}/);
  return yearMatch ? yearMatch[0] : null;
};

const generateSlug = (title, workId) => {
  const cleanedWorkId = workId ? workId.replace('/works/', '') : '';
  const titleSlug = title ? title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-') : 'no-title';
  return `${titleSlug}-${cleanedWorkId}`;
};

async function fetchBookData(bookInput) {
  console.log(`Attempting to fetch data for: ${bookInput.title} by ${bookInput.author}`);
  try {
    // 1. Search for the book
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(bookInput.title)}&author=${encodeURIComponent(bookInput.author)}&limit=1`;
    let searchResponse;
    try {
      searchResponse = await fetch(searchUrl, { headers: { 'User-Agent': USER_AGENT } });
      if (!searchResponse.ok) {
        console.warn(`Search API request failed for "${bookInput.title}": ${searchResponse.status} ${searchResponse.statusText}`);
        return null;
      }
    } catch (e) {
        console.error(`Network error during search for "${bookInput.title}": ${e.message}`);
        return null;
    }

    const searchData = await searchResponse.json();
    if (!searchData.docs || searchData.docs.length === 0) {
      console.warn(`No search results found for: ${bookInput.title}`);
      return null;
    }

    const bookDoc = searchData.docs[0];
    const workKey = bookDoc.key; // e.g., "/works/OL45804W"
    const primaryAuthorKey = bookDoc.author_key && bookDoc.author_key.length > 0 ? bookDoc.author_key[0] : null; // e.g., "OL23919A"

    if (!workKey) {
      console.warn(`Could not find work_key for: ${bookInput.title}`);
      return null;
    }

    // 2. Fetch Work Details
    await delay(API_DELAY_MS); // Delay before next API call
    const workUrl = `https://openlibrary.org${workKey}.json`;
    let workResponse;
    try {
        workResponse = await fetch(workUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (!workResponse.ok) {
            console.error(`Failed to fetch work details for ${workKey}: ${workResponse.status} ${workResponse.statusText}`);
            return null;
        }
    } catch (e) {
        console.error(`Network error fetching work details for ${workKey}: ${e.message}`);
        return null;
    }
    
    const workData = await workResponse.json();

    let description = workData.description;
    if (description && typeof description === 'object' && description.value) {
      description = description.value;
    } else if (typeof description !== 'string') {
      description = 'No description available.';
    }

    const subjects = workData.subjects || [];
    const publication_year = extractYear(workData.first_publish_date);
    const cover_id = workData.covers && workData.covers.length > 0 ? workData.covers[0] : null;
    const cover_url = getOpenLibraryImageUrl(cover_id);
    const isbn_10 = workData.isbn_10 && workData.isbn_10.length > 0 ? workData.isbn_10[0] : null;
    const isbn_13 = workData.isbn_13 && workData.isbn_13.length > 0 ? workData.isbn_13[0] : null;
    
    const workAuthors = workData.authors; // Array of author objects like { author: { key: "/authors/OL..." } }
    let authorKeyFromWork = primaryAuthorKey; // Use the one from search first
    if (!authorKeyFromWork && workAuthors && workAuthors.length > 0 && workAuthors[0].author && workAuthors[0].author.key) {
        authorKeyFromWork = workAuthors[0].author.key.replace('/authors/', '');
    }


    // 3. Fetch Author Details (if author key is available)
    let authorDetails = { name: bookInput.author, bio: null, birth_date: null, death_date: null };
    const authorNameFromInput = bookInput.author; // Keep original name as fallback

    if (authorKeyFromWork) {
      await delay(API_DELAY_MS); // Delay before next API call
      const authorUrl = `https://openlibrary.org/authors/${authorKeyFromWork}.json`;
      try {
        const authorResponse = await fetch(authorUrl, { headers: { 'User-Agent': USER_AGENT } });
        if (authorResponse.ok) {
          const authorData = await authorResponse.json();
          let bio = authorData.bio;
          if (bio && typeof bio === 'object' && bio.value) {
            bio = bio.value;
          } else if (typeof bio !== 'string') {
            bio = null;
          }
          authorDetails = {
            name: authorData.name || authorNameFromInput,
            bio: bio,
            birth_date: authorData.birth_date || null,
            death_date: authorData.death_date || null,
          };
        } else {
          console.warn(`Failed to fetch author details for key ${authorKeyFromWork}: ${authorResponse.status} ${authorResponse.statusText}. Using name from input.`);
          authorDetails.name = authorNameFromInput; // Ensure name from input is used if API fails
        }
      } catch (e) {
        console.error(`Network error fetching author details for ${authorKeyFromWork}: ${e.message}. Using name from input.`);
        authorDetails.name = authorNameFromInput; // Ensure name from input is used on network error
      }
    } else {
        console.warn(`No author_key found for primary author of "${bookInput.title}". Using name from input for author details.`);
        authorDetails.name = authorNameFromInput;
    }


    // 4. Map to Output Structure
    const cleanedWorkId = workKey.replace('/works/', '');
    const bookOutput = {
      id: cleanedWorkId,
      slug: generateSlug(workData.title || bookInput.title, cleanedWorkId),
      title: workData.title || bookInput.title,
      authors: [authorDetails.name], // Use the (potentially updated) name from authorDetails
      author_details: [authorDetails],
      description: description,
      subjects: subjects,
      publication_year: publication_year,
      average_rating: null, // Not easily available from work details
      page_count: null, // Not available in work details, requires edition fetching
      cover_url: cover_url,
      isbn_10: isbn_10,
      isbn_13: isbn_13,
      publisher: null, // Not available in work details
      links: {
        open_library: `https://openlibrary.org${workKey}`
      },
      source_api: "OpenLibrary",
      api_version_info: { // For potential debugging or tracking changes
        work_revision: workData.latest_revision || workData.revision || null,
      }
    };

    console.log(`Successfully fetched and processed: ${bookOutput.title}`);
    return bookOutput;

  } catch (error) {
    console.error(`An unexpected error occurred while fetching data for "${bookInput.title}": ${error.message}`);
    console.error(error.stack);
    return null;
  }
}

async function main() {
  console.log("Starting book data fetching process...");

  // Dynamically import node-fetch
  try {
    const nodeFetch = await import('node-fetch');
    fetch = nodeFetch.default;
  } catch (err) {
    console.error("Failed to load node-fetch:", err);
    return; // Exit if fetch cannot be loaded
  }

  let bookInputs;
  try {
    const fileContent = await fs.readFile(BOOK_INPUT_FILE, 'utf-8');
    bookInputs = JSON.parse(fileContent);
  } catch (error) {
    console.error(`Failed to read or parse book input file ${BOOK_INPUT_FILE}: ${error.message}`);
    return;
  }

  if (!Array.isArray(bookInputs)) {
    console.error(`Book input file ${BOOK_INPUT_FILE} does not contain a valid JSON array.`);
    return;
  }

  const allBookDetails = [];
  let booksProcessed = 0;

  for (const book of bookInputs) {
    if (!book.title || !book.author) {
        console.warn("Skipping invalid book entry, missing title or author:", book);
        await delay(API_DELAY_MS); // Still delay to respect API rate limits
        continue;
    }
    const bookData = await fetchBookData(book);
    if (bookData) {
      allBookDetails.push(bookData);
    }
    booksProcessed++;
    // Delay is already handled within fetchBookData for API calls, 
    // but an additional one here ensures spacing even if fetchBookData returns early (e.g. search fail)
    // The problem states "after each book processing (even if it failed...)"
    // fetchBookData has delays *between its internal calls*, this one is *between processing each book*
    if (booksProcessed < bookInputs.length) { // No delay after the very last book
        await delay(API_DELAY_MS);
    }
  }

  try {
    await fs.mkdir('src/data/books', { recursive: true }); // Ensure directory exists
    await fs.writeFile(BOOK_OUTPUT_FILE, JSON.stringify({ allBooks: allBookDetails }, null, 2));
    console.log(`Successfully wrote book details to ${BOOK_OUTPUT_FILE}`);
  } catch (error) {
    console.error(`Failed to write book details to ${BOOK_OUTPUT_FILE}: ${error.message}`);
    return;
  }

  console.log(`Book data fetching process completed. Processed ${booksProcessed} books. Found details for ${allBookDetails.length} books.`);
}

main().catch(error => {
  console.error("An error occurred in the main execution:", error);
});
