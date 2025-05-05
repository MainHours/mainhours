
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request
    const { query } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Searching for: ${query}`);
    
    // Create search results based on the query with real URLs
    const results = [
      {
        title: `${query} - Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        description: `Wikipedia article about ${query} providing factual information, history, and relevant details.`,
        type: "article"
      },
      {
        title: `${query} - Google Search`,
        url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
        description: `Search Google for more information about ${query}.`,
        type: "search"
      },
      {
        title: `${query} - YouTube`,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        description: `Watch videos about ${query} on YouTube.`,
        type: "video"
      },
      {
        title: `${query} - Reddit Discussions`,
        url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
        description: `Join discussions about ${query} on Reddit.`,
        type: "forum"
      },
      {
        title: `${query} - Twitter / X`,
        url: `https://twitter.com/search?q=${encodeURIComponent(query)}`,
        description: `See what people are saying about ${query} on Twitter/X.`,
        type: "social"
      },
      {
        title: `${query} - GitHub`,
        url: `https://github.com/search?q=${encodeURIComponent(query)}`,
        description: `Find repositories and code related to ${query} on GitHub.`,
        type: "code"
      },
      {
        title: `${query} - Amazon Products`,
        url: `https://www.amazon.com/s?k=${encodeURIComponent(query)}`,
        description: `Shop for products related to ${query} on Amazon.`,
        type: "shopping"
      }
    ];

    // Return the search results
    return new Response(JSON.stringify({ results, query }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Search error:', error);
    
    return new Response(JSON.stringify({ error: 'Failed to process search request' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
