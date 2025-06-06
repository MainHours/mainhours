
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
    
    const serpApiKey = Deno.env.get('SERPAPI_API_KEY');
    
    if (!serpApiKey) {
      console.log('SerpAPI key not found, using fallback results');
      const fallbackResults = generateFallbackResults(query);
      return new Response(JSON.stringify({ 
        results: fallbackResults.results, 
        query,
        relatedQueries: fallbackResults.relatedQueries,
        timestamp: new Date().toISOString(),
        resultCount: fallbackResults.results.length,
        source: 'fallback'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Call SerpAPI for Google search results
    const serpApiUrl = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=10`;
    
    const serpResponse = await fetch(serpApiUrl);
    
    if (!serpResponse.ok) {
      throw new Error(`SerpAPI request failed: ${serpResponse.status}`);
    }
    
    const serpData = await serpResponse.json();
    console.log('SerpAPI response received');
    
    // Transform SerpAPI results to our format
    const results = transformSerpResults(serpData, query);
    const relatedQueries = serpData.related_searches?.map((item: any) => item.query) || generateRelatedQueries(query);

    // Return the search results
    return new Response(JSON.stringify({ 
      results, 
      query,
      relatedQueries: relatedQueries.slice(0, 6),
      timestamp: new Date().toISOString(),
      resultCount: results.length,
      source: 'serpapi'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback to mock results if SerpAPI fails
    const fallbackResults = generateFallbackResults(query);
    return new Response(JSON.stringify({ 
      results: fallbackResults.results, 
      query,
      relatedQueries: fallbackResults.relatedQueries,
      timestamp: new Date().toISOString(),
      resultCount: fallbackResults.results.length,
      source: 'fallback',
      error: 'SerpAPI unavailable, showing fallback results'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});

function transformSerpResults(serpData: any, query: string) {
  const results = [];
  
  // Add organic results
  if (serpData.organic_results) {
    for (const result of serpData.organic_results) {
      results.push({
        title: result.title || 'No title',
        url: result.link || '#',
        description: result.snippet || 'No description available',
        source: extractDomain(result.link || ''),
        type: 'article',
        date: new Date().toISOString()
      });
    }
  }
  
  // Add news results if available
  if (serpData.news_results) {
    for (const result of serpData.news_results) {
      results.push({
        title: result.title || 'No title',
        url: result.link || '#',
        description: result.snippet || 'No description available',
        source: result.source || extractDomain(result.link || ''),
        type: 'news',
        date: result.date || new Date().toISOString()
      });
    }
  }
  
  // Add knowledge graph if available
  if (serpData.knowledge_graph) {
    const kg = serpData.knowledge_graph;
    if (kg.title && kg.description) {
      results.unshift({
        title: kg.title,
        url: kg.source?.link || kg.website || '#',
        description: kg.description,
        source: kg.source?.name || 'Knowledge Graph',
        type: 'knowledge',
        date: new Date().toISOString()
      });
    }
  }
  
  return results.slice(0, 10);
}

function extractDomain(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch {
    return 'Unknown';
  }
}

function generateFallbackResults(query: string) {
  const results = [
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      description: `Wikipedia is a free online encyclopedia. Find comprehensive information about ${query} including history, facts, and related topics.`,
      type: "article",
      source: "Wikipedia",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      title: `Latest news about ${query}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      description: `Stay updated with the latest news and developments related to ${query}. Get real-time updates from trusted news sources.`,
      type: "news",
      source: "Google News",
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      title: `${query} videos and tutorials`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      description: `Watch educational videos, tutorials, and documentaries about ${query}. Learn from experts and enthusiasts.`,
      type: "video",
      source: "YouTube",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    }
  ];
  
  const relatedQueries = [
    `what is ${query}`,
    `${query} explained`,
    `${query} news`,
    `${query} tutorial`,
    `${query} examples`
  ];
  
  return { results, relatedQueries };
}

function generateRelatedQueries(query: string) {
  return [
    `what is ${query}`,
    `${query} explained`,
    `${query} news`,
    `${query} tutorial`,
    `${query} examples`,
    `${query} vs alternatives`
  ];
}
