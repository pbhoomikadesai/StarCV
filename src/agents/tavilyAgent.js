/**
 * Tavily API Agent
 * Queries Tavily Search API (via local Vite proxy) for Instagram, Facebook, and LinkedIn details.
 */
async function searchTavily(query) {
  const apiKey = import.meta.env.VITE_TAVILY_API_KEY;

  if (!apiKey || apiKey === 'your_tavily_api_key_here') {
    return { results: [], raw: `Tavily API key not configured for query: ${query}` };
  }

  try {
    const response = await fetch('/api/tavily/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query: query,
        search_depth: 'basic',
        include_images: false,
        max_results: 3
      })
    });

    if (!response.ok) {
      throw new Error(`Tavily search failed with status: ${response.status}`);
    }

    const data = await response.json();
    const results = data.results || [];

    // Format the search result snippets for the LLM to digest
    const rawSnippet = results
      .map((r, i) => `[Result ${i + 1}]\nTitle: ${r.title}\nURL: ${r.url}\nSnippet: ${r.content}`)
      .join('\n\n');

    return {
      results,
      raw: rawSnippet || `Tavily query returned no results for: "${query}"`
    };
  } catch (error) {
    console.error(`Tavily Agent Error for query "${query}":`, error);
    return { error: error.message, raw: `Tavily Agent Error ("${query}"): ${error.message}` };
  }
}

export async function fetchInstagramData(actorName) {
  return searchTavily(`${actorName} Instagram followers handle official`);
}

export async function fetchFacebookData(actorName) {
  return searchTavily(`${actorName} Facebook official page likes`);
}

export async function fetchLinkedInData(actorName) {
  return searchTavily(`${actorName} LinkedIn profile headline`);
}
