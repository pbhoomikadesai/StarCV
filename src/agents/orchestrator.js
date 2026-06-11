/**
 * Orchestrator Agent
 * Executes all search agents in parallel, gathers statistics, and calculates response time.
 */
import { fetchWikipediaData } from './wikipediaAgent';
import { fetchYouTubeData } from './youtubeAgent';
import { fetchInstagramData, fetchFacebookData, fetchLinkedInData, fetchCareerDetails } from './tavilyAgent';

export async function runOrchestrator(actorName) {
  const startTime = performance.now();

  // Define parallel search promises
  const promises = {
    wikipedia: fetchWikipediaData(actorName),
    youtube: fetchYouTubeData(actorName),
    instagram: fetchInstagramData(actorName),
    facebook: fetchFacebookData(actorName),
    linkedin: fetchLinkedInData(actorName),
    career: fetchCareerDetails(actorName)
  };

  const keys = Object.keys(promises);
  const settledResults = await Promise.allSettled(Object.values(promises));

  const results = {};
  const apiStatus = {};

  keys.forEach((key, index) => {
    const status = settledResults[index];
    if (status.status === 'fulfilled') {
      results[key] = status.value;
      // It is successful if no error field was returned
      apiStatus[key] = !status.value.error;
    } else {
      results[key] = {
        error: status.reason?.message || 'Execution failed',
        raw: `${key} Error: ${status.reason?.message || 'Rejected promise'}`
      };
      apiStatus[key] = false;
    }
  });

  const endTime = performance.now();
  const durationMs = Math.round(endTime - startTime);

  // Build structured raw text payload for Groq processing
  const rawTextPayload = `
QUERY: ${actorName}

[WIKIPEDIA DATA]
${results.wikipedia.raw || 'No Wikipedia data retrieved.'}
Wikipedia Photo URL: ${results.wikipedia.photoUrl || 'None'}

[YOUTUBE DATA]
${results.youtube.raw || 'No YouTube data retrieved.'}

[INSTAGRAM DATA]
${results.instagram.raw || 'No Instagram data retrieved.'}

[FACEBOOK DATA]
${results.facebook.raw || 'No Facebook data retrieved.'}

[LINKEDIN DATA]
${results.linkedin.raw || 'No LinkedIn data retrieved.'}

[CAREER & ACCLAIM DETAILS]
${results.career.raw || 'No career details retrieved.'}
`.trim();

  return {
    rawPayload: rawTextPayload,
    apiStatus,
    durationMs,
    photoUrls: {
      wikipedia: results.wikipedia.photoUrl
    }
  };
}
