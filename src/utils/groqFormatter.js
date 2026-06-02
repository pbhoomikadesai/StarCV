/**
 * Groq Formatter Utility
 * Sends raw aggregated data to Groq (Llama 3.3 70B) to structure it into standard JSON.
 */
import { MASTER_PROMPT } from '../constants/prompt';

export async function formatWithGroq(rawPayload, actorName) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    throw new Error('Groq API Key is not configured. Please add VITE_GROQ_API_KEY to your .env file.');
  }

  // Enforce a hard 8-second timeout for the LLM request
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: MASTER_PROMPT
          },
          {
            role: 'user',
            content: `Query Actor: ${actorName}\n\nRaw Search Aggregated Results:\n${rawPayload}`
          }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' } // Instruct the model to speak strict JSON
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API returned HTTP ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Groq LLM.');
    }

    const parsedJson = JSON.parse(content);
    return parsedJson;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Groq formatting request timed out (limit: 8 seconds)');
    }
    console.error('Groq Formatter Error:', error);
    throw error;
  }
}
