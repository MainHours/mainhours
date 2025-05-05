
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
    
    // Construct search results based on the query
    // This is a simplified version - in a real implementation, you would connect to a search API
    const results = [
      {
        title: `${query} - Main search result`,
        url: `https://example.com/search/${encodeURIComponent(query)}`,
        description: `Comprehensive information about ${query} with detailed resources and explanations.`,
        type: "article"
      },
      {
        title: `${query} - Wikipedia`,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
        description: `Wikipedia article about ${query} providing factual information, history, and relevant details.`,
        type: "article" 
      },
      {
        title: `Latest News about ${query}`,
        url: `https://news.example.com/topics/${encodeURIComponent(query)}`,
        description: `Breaking news and recent updates about ${query} from reliable sources worldwide.`,
        type: "news"
      },
      {
        title: `${query} Research and Studies`,
        url: `https://academic.example.com/research/${encodeURIComponent(query)}`,
        description: `Academic papers, scientific research, and studies related to ${query} from top institutions.`,
        type: "research"
      },
      {
        title: `Learn about ${query} - Comprehensive Guide`,
        url: `https://learn.example.com/${encodeURIComponent(query)}`,
        description: `Step-by-step tutorials and learning resources about ${query} for beginners to advanced users.`,
        type: "tutorial"
      },
      {
        title: `${query} Videos`,
        url: `https://videos.example.com/search?q=${encodeURIComponent(query)}`,
        description: `Watch videos about ${query} including tutorials, explanations, and demonstrations.`,
        type: "video"
      },
      {
        title: `${query} Images and Graphics`,
        url: `https://images.example.com/search?q=${encodeURIComponent(query)}`,
        description: `Browse through a collection of images, illustrations, and graphics related to ${query}.`,
        type: "image"
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
