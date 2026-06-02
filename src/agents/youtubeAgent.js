/**
 * YouTube API Agent
 * Searches for the official YouTube channel of the actor and fetches channel stats.
 */
export async function fetchYouTubeData(actorName) {
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!apiKey || apiKey === 'your_youtube_api_key_here') {
    return { channelName: null, subscribers: null, url: null, raw: 'YouTube API key is not configured.' };
  }

  try {
    // 1. Search for the actor's channel (append "official" or "official channel" to narrow down)
    const searchQuery = `${actorName} official channel`;
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(searchQuery)}&maxResults=1&key=${apiKey}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`YouTube Search failed: ${searchResponse.statusText}`);
    }
    
    const searchData = await searchResponse.json();
    const items = searchData.items || [];
    
    if (items.length === 0) {
      // Retry with just the actor's name if "official channel" returned nothing
      const retryUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${encodeURIComponent(actorName)}&maxResults=1&key=${apiKey}`;
      const retryResponse = await fetch(retryUrl);
      if (!retryResponse.ok) throw new Error('YouTube Search retry failed');
      const retryData = await retryResponse.json();
      const retryItems = retryData.items || [];
      if (retryItems.length === 0) {
        return { channelName: null, subscribers: null, url: null, raw: 'No YouTube channel found.' };
      }
      items.push(retryItems[0]);
    }

    const channelId = items[0].id.channelId;
    const initialTitle = items[0].snippet.title;

    // 2. Fetch detailed stats for the channel
    const detailsUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${channelId}&key=${apiKey}`;
    const detailsResponse = await fetch(detailsUrl);
    if (!detailsResponse.ok) {
      throw new Error(`YouTube Channel details failed: ${detailsResponse.statusText}`);
    }
    
    const detailsData = await detailsResponse.json();
    const detailsList = detailsData.items || [];
    
    if (detailsList.length === 0) {
      return {
        channelName: initialTitle,
        subscribers: null,
        url: `https://www.youtube.com/channel/${channelId}`,
        raw: `YouTube Channel found: ${initialTitle}, but details query was empty.`
      };
    }

    const channel = detailsList[0];
    const channelName = channel.snippet.title;
    const subscriberCount = channel.statistics.subscriberCount;
    const viewCount = channel.statistics.viewCount;
    const channelUrl = `https://www.youtube.com/channel/${channelId}`;

    // Format subscriber count (e.g. 10.5M, 240K)
    const subs = parseInt(subscriberCount, 10);
    let subscribersFormatted = subscriberCount;
    if (!isNaN(subs)) {
      if (subs >= 1000000) {
        subscribersFormatted = (subs / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
      } else if (subs >= 1000) {
        subscribersFormatted = (subs / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
    }

    return {
      channelName,
      subscribers: subscribersFormatted,
      url: channelUrl,
      raw: `YouTube Channel: ${channelName}\nSubscribers: ${subscribersFormatted} (${subscriberCount})\nTotal Views: ${viewCount}\nChannel URL: ${channelUrl}`
    };
  } catch (error) {
    console.error('YouTube Agent Error:', error);
    return { error: error.message, raw: `YouTube Agent Error: ${error.message}` };
  }
}
