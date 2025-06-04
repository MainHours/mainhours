import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY") || "";
const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY") || "";
const NY_TIMES_API_KEY = Deno.env.get("NY_TIMES_API_KEY") || "";
const NEWSDATA_IO_API_KEY = Deno.env.get("NEWSDATA_IO_API_KEY") || "";

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
  url: string;
}

const generateUniqueId = (article: NewsArticle): string => {
  return `${article.title}-${article.source}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
};

async function fetchFromNewsAPI(category = 'general', source = ''): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.log("NewsAPI key not found");
    return [];
  }
  
  try {
    // Construct the URL with optional source
    let url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`;
    if (source) {
      // Map source ID to domain or source name
      const sourceMappings: Record<string, string> = {
        'bbc': 'bbc.com,bbc.co.uk',
        'nyt': 'nytimes.com',
        'cnn': 'cnn.com',
        'fox': 'foxnews.com',
        'wapo': 'washingtonpost.com',
        'nbc': 'nbcnews.com',
        'reuters': 'reuters.com',
        'guardian': 'theguardian.com'
      };
      
      if (sourceMappings[source]) {
        url = `https://newsapi.org/v2/top-headlines?country=us&domains=${sourceMappings[source]}&apiKey=${NEWS_API_KEY}`;
      }
    }
    
    const response = await fetch(url);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("NewsAPI error:", data);
      return [];
    }
    
    return data.articles.map((article: any) => ({
      title: article.title || "No title",
      description: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      category: category,
      imageUrl: article.urlToImage || "",
      time: new Date(article.publishedAt).toRelativeString(),
      url: article.url
    }));
  } catch (error) {
    console.error("Error fetching from NewsAPI:", error);
    return [];
  }
}

async function fetchFromGNews(category = 'general', source = ''): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    console.log("GNews API key not found");
    return [];
  }
  
  try {
    // Construct the URL with optional source
    let url = `https://gnews.io/api/v4/top-headlines?topic=${category}&token=${GNEWS_API_KEY}&lang=en`;
    
    // Source filtering would be done later since GNews doesn't support source filtering in the API
    
    const response = await fetch(url);
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("GNews API error:", data);
      return [];
    }
    
    const articles = data.articles.map((article: any) => ({
      title: article.title || "No title",
      description: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      category: category,
      imageUrl: article.image || "",
      time: new Date(article.publishedAt).toRelativeString(),
      url: article.url
    }));
    
    // Filter by source if provided
    if (source) {
      const sourceName = getSourceName(source).toLowerCase();
      return articles.filter(article => 
        article.source.toLowerCase().includes(sourceName)
      );
    }
    
    return articles;
  } catch (error) {
    console.error("Error fetching from GNews:", error);
    return [];
  }
}

async function fetchFromNYTimes(category = 'general', source = ''): Promise<NewsArticle[]> {
  if (!NY_TIMES_API_KEY || source && source !== 'nyt') {
    // Skip if we're filtering for a different source
    return [];
  }
  
  try {
    // Map general categories to NYT sections
    const sectionMap: Record<string, string> = {
      'general': 'home',
      'business': 'business',
      'technology': 'technology',
      'science': 'science',
      'health': 'health',
      'sports': 'sports',
      'entertainment': 'arts',
      'politics': 'politics'
    };
    
    const section = sectionMap[category] || 'home';
    const url = `https://api.nytimes.com/svc/topstories/v2/${section}.json?api-key=${NY_TIMES_API_KEY}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!response.ok) {
      console.error("NY Times API error:", data);
      return [];
    }
    
    return data.results.map((article: any) => ({
      title: article.title || "No title",
      description: article.abstract || "No description available",
      source: "New York Times",
      category: category,
      imageUrl: article.multimedia && article.multimedia.length > 0 ? article.multimedia[0].url : "",
      time: new Date(article.published_date).toRelativeString(),
      url: article.url
    }));
  } catch (error) {
    console.error("Error fetching from NY Times API:", error);
    return [];
  }
}

// Helper function to get source display name from ID
function getSourceName(sourceId: string): string {
  const sourceNames: Record<string, string> = {
    'bbc': 'BBC',
    'nyt': 'New York Times',
    'cnn': 'CNN',
    'fox': 'Fox News',
    'wapo': 'Washington Post',
    'nbc': 'NBC News',
    'reuters': 'Reuters',
    'guardian': 'The Guardian'
  };
  
  return sourceNames[sourceId] || sourceId;
}

// Function to get relative time string
Date.prototype.toRelativeString = function(): string {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  
  if (diffSecs < 60) {
    return `${diffSecs} seconds ago`;
  } else if (diffMins < 60) {
    return `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`;
  } else {
    return `${diffDays} days ago`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request
    const reqData = await req.json();
    const category = reqData.category || 'general';
    const source = reqData.source || 'all';
    const excludeIds = reqData.excludeIds || [];
    
    console.log(`Fetching news for category: ${category}, source: ${source}, excluding: ${excludeIds.length} articles`);
    
    let articles: NewsArticle[] = [];
    
    // Fetch from multiple sources based on request
    if (source === 'all' || source === 'newsapi') {
      const newsApiArticles = await fetchFromNewsAPI(category, source !== 'all' ? source : '');
      articles = [...articles, ...newsApiArticles];
    }
    
    if (source === 'all' || source === 'gnews') {
      const gNewsArticles = await fetchFromGNews(category, source !== 'all' ? source : '');
      articles = [...articles, ...gNewsArticles];
    }
    
    if (source === 'all' || source === 'nyt') {
      const nytArticles = await fetchFromNYTimes(category);
      articles = [...articles, ...nytArticles];
    }
    
    // If no articles were fetched, return a default set
    if (articles.length === 0) {
      articles = generateDefaultArticles(category, source);
    }
    
    // Filter out excluded articles
    const filteredArticles = articles.filter(article => {
      const articleId = generateUniqueId(article);
      return !excludeIds.includes(articleId);
    });
    
    // Deduplicate articles by title
    const uniqueArticles = Array.from(
      new Map(filteredArticles.map(article => [article.title, article])).values()
    );
    
    // Shuffle and limit the number of articles, ensuring fresh content
    const finalArticles = shuffleArray(uniqueArticles).slice(0, excludeIds.length > 0 ? 10 : 20);
    
    console.log(`Returning ${finalArticles.length} articles (filtered ${articles.length - filteredArticles.length} duplicates)`);
    
    return new Response(
      JSON.stringify({ articles: finalArticles }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('Error in news-api function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch news',
        message: error.message,
        articles: generateDefaultArticles('general')
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});

// Utility function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Generate default articles if API calls fail
function generateDefaultArticles(category: string, source: string = 'all'): NewsArticle[] {
  // Map source IDs to display names
  const sourceMapping: Record<string, string> = {
    'bbc': 'BBC News',
    'nyt': 'New York Times',
    'cnn': 'CNN',
    'fox': 'Fox News',
    'wapo': 'Washington Post',
    'nbc': 'NBC News',
    'reuters': 'Reuters',
    'guardian': 'The Guardian',
    'all': ''
  };
  
  // Default sources to use if no specific source is requested
  const defaultSources = ['BBC News', 'CNN', 'New York Times', 'NBC News', 'Fox News', 'Reuters'];
  
  // Use the requested source or pick from defaults
  const sources = source !== 'all' ? [sourceMapping[source] || 'News Source'] : defaultSources;
  
  const categoryArticles: Record<string, any[]> = {
    general: [
      {
        title: "Global Leaders Agree on New Climate Initiatives",
        description: "World leaders have reached a consensus on ambitious new climate initiatives during the annual Climate Summit held in Geneva.",
        imageUrl: "https://images.unsplash.com/photo-1624638760852-62a4efacabfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        title: "Tech Company Announces Revolutionary AR Glasses",
        description: "A leading tech company has unveiled its next-generation augmented reality glasses, promising to change how we interact with digital content.",
        imageUrl: "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVnbWVudGVkJTIwcmVhbGl0eXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        title: "Economic Growth Exceeds Expectations in Third Quarter",
        description: "The economy grew faster than expected in the third quarter, defying predictions of a slowdown amidst global challenges.",
        imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
      },
      {
        title: "New Study Reveals Surprising Health Benefits of Coffee",
        description: "Research published today shows that moderate coffee consumption may have even more health benefits than previously thought, particularly for heart health.",
        imageUrl: "https://images.unsplash.com/photo-1515442261605-65987783cb6a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlfGVufDB8fDB8fHww",
      },
      {
        title: "Major Sports League Announces Expansion Teams",
        description: "The commissioner announced that the league will add two new expansion teams in the next three years, targeting growing markets.",
        imageUrl: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BvcnRzfGVufDB8fDB8fHww",
      }
    ],
    technology: [
      {
        title: "AI System Outperforms Doctors in Diagnosing Rare Conditions",
        description: "A new artificial intelligence system has demonstrated superior accuracy in diagnosing rare medical conditions compared to experienced physicians.",
        imageUrl: "https://images.unsplash.com/photo-1581093450021-a7a360e9a6b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        title: "Quantum Computing Milestone Achieved by Research Team",
        description: "Scientists have reached a significant milestone in quantum computing, bringing us closer to practical applications of this revolutionary technology.",
        imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbnR1bSUyMGNvbXB1dGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      },
      {
        title: "Major Tech Company Announces Carbon-Negative Goal by 2030",
        description: "The Silicon Valley giant has pledged to remove more carbon than it emits within the next decade, setting a new standard for environmental responsibility.",
        imageUrl: "https://images.unsplash.com/photo-1536599424071-0b215a388ba7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVjaG5vbG9neXxlbnwwfHwwfHx8MA%3D%3D",
      }
    ],
    health: [
      {
        title: "New Study Reveals Benefits of Intermittent Fasting",
        description: "Research indicates that intermittent fasting may have significant health benefits beyond weight loss, including improved metabolic health.",
        imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoeSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      },
      {
        title: "Breakthrough in Alzheimer's Treatment Shows Promise",
        description: "A new experimental drug has shown promising results in early clinical trials, potentially offering hope for Alzheimer's patients.",
        imageUrl: "https://images.unsplash.com/photo-1576671414121-aa2aee8569cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D",
      }
    ],
    business: [
      {
        title: "Major Merger Creates New Industry Giant",
        description: "Two leading companies have announced a merger that will create the largest entity in their sector, pending regulatory approval.",
        imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3N8ZW58MHx8MHx8fDA%3D",
      },
      {
        title: "Startup Raises Record Series A Funding Round",
        description: "The financial technology startup has secured $150 million in Series A funding, setting a new record for early-stage investment in the sector.",
        imageUrl: "https://images.unsplash.com/photo-1553729784-e91953dec042?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVuZGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      }
    ],
    entertainment: [
      {
        title: "Blockbuster Movie Breaks Opening Weekend Records",
        description: "The latest installment in the popular franchise has smashed box office records, becoming the highest-grossing opening weekend of all time.",
        imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bW92aWV8ZW58MHx8MHx8fDA%3D",
      },
      {
        title: "Acclaimed Singer Announces Surprise Album and World Tour",
        description: "The Grammy-winning artist has delighted fans with a surprise album release and the announcement of a worldwide concert tour starting next month.",
        imageUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29uY2VydHxlbnwwfHwwfHx8MA%3D%3D",
      }
    ],
    sports: [
      {
        title: "Underdog Team Wins Championship in Stunning Upset",
        description: "In one of the biggest surprises in recent sports history, the underdog team defeated the heavily favored champions to claim the title.",
        imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c3BvcnRzfGVufDB8fDB8fHww",
      },
      {
        title: "Star Athlete Signs Record-Breaking Contract",
        description: "The league's MVP has signed a historic contract extension that makes them the highest-paid player in the sport's history.",
        imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fDB8fHww",
      }
    ],
    science: [
      {
        title: "Scientists Discover New Species in Deep Ocean Exploration",
        description: "An international team of marine biologists has discovered several previously unknown species during a deep-sea expedition.",
        imageUrl: "https://images.unsplash.com/photo-1580894742597-87bc8789db3d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2NlYW4lMjBkZWVwfGVufDB8fDB8fHww",
      },
      {
        title: "Astronomers Capture First Images of Distant Exoplanet's Atmosphere",
        description: "Using advanced telescope technology, astronomers have obtained the first direct images of the atmosphere of an exoplanet orbiting a distant star.",
        imageUrl: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZXhvcGxhbmV0fGVufDB8fDB8fHww",
      }
    ],
    politics: [
      {
        title: "Historic Peace Agreement Signed Between Rival Nations",
        description: "After decades of tension, two long-standing rival nations have signed a comprehensive peace agreement, marking a new era of cooperation.",
        imageUrl: "https://images.unsplash.com/photo-1612033448550-9d6f9c17f07d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVhY2UlMjBhZ3JlZW1lbnR8ZW58MHx8MHx8fDA%3D",
      },
      {
        title: "Landmark Legislation Passes with Bipartisan Support",
        description: "In a rare show of unity, lawmakers from across the political spectrum have passed a major bill addressing key national priorities.",
        imageUrl: "https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFybGlhbWVudHxlbnwwfHwwfHx8MA%3D%3D",
      }
    ]
  };
  
  // If requested category doesn't exist in defaults, use general
  const articlesForCategory = categoryArticles[category] || categoryArticles.general;
  
  // Add timestamp to make articles unique on each request
  const timestamp = Date.now();
  
  return articlesForCategory.map((article, index) => {
    const sourceIndex = index % sources.length;
    const sourceToUse = sources[sourceIndex] || defaultSources[sourceIndex];
    
    return {
      title: `${article.title} - Update ${Math.floor(timestamp / 60000)}`, // Update every minute
      description: article.description,
      source: sourceToUse,
      category: category,
      imageUrl: article.imageUrl,
      time: `${index + 1} minutes ago`,
      url: `https://example.com/news/${timestamp}-${index}`
    };
  });
}
