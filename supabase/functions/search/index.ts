
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
    
    // Generate comprehensive search results based on the query
    const results = generateSearchResults(query);
    const relatedQueries = generateRelatedQueries(query);

    // Return the search results
    return new Response(JSON.stringify({ 
      results, 
      query,
      relatedQueries,
      timestamp: new Date().toISOString(),
      resultCount: results.length
    }), {
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

function generateSearchResults(query: string) {
  const lowerQuery = query.toLowerCase();
  const results = [];

  // Technology-related searches
  if (lowerQuery.includes('ai') || lowerQuery.includes('artificial intelligence')) {
    results.push(
      {
        title: "What is Artificial Intelligence? - Complete Guide",
        url: "https://www.ibm.com/cloud/learn/what-is-artificial-intelligence",
        description: "Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that work and react like humans. AI systems can perform tasks that typically require human intelligence, such as visual perception, speech recognition, decision-making, and language translation.",
        source: "IBM",
        type: "article",
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "OpenAI - Advancing AI research and deployment",
        url: "https://openai.com",
        description: "OpenAI is an AI research and deployment company. Our mission is to ensure that artificial general intelligence benefits all of humanity. We're the creators of GPT-4, DALL-E, and other groundbreaking AI systems.",
        source: "OpenAI",
        type: "news",
        date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Climate-related searches
  if (lowerQuery.includes('climate') || lowerQuery.includes('global warming')) {
    results.push(
      {
        title: "Climate Change Facts and Evidence - NASA",
        url: "https://climate.nasa.gov/evidence/",
        description: "The current warming trend is of particular significance because it is unequivocally the result of human activity since the mid-20th century and proceeding at a rate that is unprecedented over millennia. Scientific evidence for warming of the climate system is unequivocal.",
        source: "NASA",
        type: "academic",
        date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        title: "What is Climate Change? - United Nations",
        url: "https://www.un.org/en/climatechange/what-is-climate-change",
        description: "Climate change refers to long-term shifts in temperatures and weather patterns. Since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas.",
        source: "United Nations",
        type: "explainer",
        date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Health-related searches
  if (lowerQuery.includes('health') || lowerQuery.includes('medicine') || lowerQuery.includes('covid')) {
    results.push(
      {
        title: "World Health Organization (WHO) - Health topics",
        url: "https://www.who.int/health-topics",
        description: "WHO works worldwide to promote health, keep the world safe, and serve the vulnerable. Our goal is to ensure that a billion more people have universal health coverage, to protect a billion more people from health emergencies.",
        source: "WHO",
        type: "news",
        date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Economics and finance
  if (lowerQuery.includes('economy') || lowerQuery.includes('finance') || lowerQuery.includes('stock')) {
    results.push(
      {
        title: "Global Economic Outlook - World Bank",
        url: "https://www.worldbank.org/en/publication/global-economic-prospects",
        description: "The Global Economic Prospects examines trends for the world economy and how they affect developing countries. The report includes country-specific forecasts for major developing countries.",
        source: "World Bank",
        type: "analysis",
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Space and science
  if (lowerQuery.includes('space') || lowerQuery.includes('nasa') || lowerQuery.includes('mars')) {
    results.push(
      {
        title: "NASA - National Aeronautics and Space Administration",
        url: "https://www.nasa.gov",
        description: "NASA.gov brings you the latest images, videos and news from America's space agency. Get the latest updates on NASA missions, watch NASA TV live, and learn about our quest to reveal the unknown.",
        source: "NASA",
        type: "news",
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Programming and technology
  if (lowerQuery.includes('programming') || lowerQuery.includes('code') || lowerQuery.includes('javascript')) {
    results.push(
      {
        title: "MDN Web Docs - Resources for developers",
        url: "https://developer.mozilla.org",
        description: "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps. It also has developer-oriented documentation for Mozilla products.",
        source: "Mozilla",
        type: "academic",
        date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    );
  }

  // Always add some general results
  results.push(
    {
      title: `${query} - Wikipedia`,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
      description: `Wikipedia is a free online encyclopedia, created and edited by volunteers around the world. Find comprehensive information about ${query} including history, facts, and related topics.`,
      type: "article",
      source: "Wikipedia",
      date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      title: `Latest news about ${query}`,
      url: `https://news.google.com/search?q=${encodeURIComponent(query)}`,
      description: `Stay updated with the latest news and developments related to ${query}. Get real-time updates from trusted news sources worldwide.`,
      type: "news",
      source: "Google News",
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
      title: `${query} - Academic research and papers`,
      url: `https://scholar.google.com/scholar?q=${encodeURIComponent(query)}`,
      description: `Academic articles, theses, books, conference papers and other scholarly literature related to ${query}. Find peer-reviewed research from universities and academic institutions.`,
      type: "academic",
      source: "Google Scholar",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      title: `${query} videos and tutorials`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      description: `Watch educational videos, tutorials, and documentaries about ${query}. Learn from experts and enthusiasts in an engaging visual format.`,
      type: "video",
      source: "YouTube",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
      title: `${query} discussions on Reddit`,
      url: `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`,
      description: `Join community discussions about ${query}. Read opinions, ask questions, and share experiences with people who have similar interests.`,
      type: "forum",
      source: "Reddit",
      date: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    }
  );

  return results.slice(0, 10); // Return top 10 results
}

function generateRelatedQueries(query: string) {
  const lowerQuery = query.toLowerCase();
  const related = [];

  // Add context-specific related queries
  if (lowerQuery.includes('ai')) {
    related.push(
      "machine learning vs artificial intelligence",
      "how does AI work",
      "AI applications in daily life",
      "future of artificial intelligence",
      "AI ethics and safety"
    );
  } else if (lowerQuery.includes('climate')) {
    related.push(
      "climate change solutions",
      "global warming causes",
      "renewable energy",
      "carbon footprint reduction",
      "climate change effects"
    );
  } else if (lowerQuery.includes('programming')) {
    related.push(
      "best programming languages to learn",
      "how to start coding",
      "programming tutorials",
      "software development career",
      "coding bootcamps"
    );
  } else {
    // Generic related queries
    related.push(
      `what is ${query}`,
      `${query} explained`,
      `${query} news`,
      `${query} tutorial`,
      `${query} examples`,
      `${query} vs alternatives`
    );
  }

  return related.slice(0, 6);
}
