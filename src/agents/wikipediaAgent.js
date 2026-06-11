/**
 * Wikipedia API Agent
 * Searches Wikipedia for an actor, fetches their main article intro text and thumbnail image.
 */
export async function fetchWikipediaData(actorName) {
  try {
    // 1. Search Wikipedia for the closest article titles
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(actorName)}&limit=3&namespace=0&format=json&origin=*`;
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) throw new Error('Wikipedia search failed');
    const searchData = await searchResponse.json();
    
    const titles = searchData[1] || [];
    if (titles.length === 0) {
      return { bio: null, photoUrl: null, title: null, raw: 'No Wikipedia page found.' };
    }
    
    // Pick the primary result
    const pageTitle = titles[0];
    
    // 2. Fetch the introductory section and page image thumbnail
    const queryUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(pageTitle)}&pithumbsize=600&format=json&origin=*`;
    const queryResponse = await fetch(queryUrl);
    if (!queryResponse.ok) throw new Error('Wikipedia query failed');
    const queryData = await queryResponse.json();
    
    const pages = queryData.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    if (pageId === '-1') {
      return { bio: null, photoUrl: null, title: pageTitle, raw: `Wikipedia page found as title: ${pageTitle}, but query returned empty.` };
    }
    
    const page = pages[pageId];
    const bio = page.extract || '';
    const photoUrl = page.thumbnail?.source || null;
    
    return {
      title: page.title,
      bio,
      photoUrl,
      raw: `Wikipedia Title: ${page.title}\nIntro Extract: ${bio.slice(0, 4000)}`
    };
  } catch (error) {
    console.error('Wikipedia Agent Error:', error);
    return { error: error.message, raw: `Wikipedia Agent Error: ${error.message}` };
  }
}
