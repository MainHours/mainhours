
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const NEWS_API_KEY = Deno.env.get("NEWS_API_KEY") || "";
const GNEWS_API_KEY = Deno.env.get("GNEWS_API_KEY") || "";

// CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type NewsSource = 'newsapi' | 'gnews';

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
  url: string;
}

async function fetchFromNewsAPI(category = 'general'): Promise<NewsArticle[]> {
  if (!NEWS_API_KEY) {
    console.log("NewsAPI key not found");
    return [];
  }
  
  try {
    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${NEWS_API_KEY}`
    );
    
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

async function fetchFromGNews(category = 'general'): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    console.log("GNews API key not found");
    return [];
  }
  
  try {
    const response = await fetch(
      `https://gnews.io/api/v4/top-headlines?topic=${category}&token=${GNEWS_API_KEY}&lang=en`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("GNews API error:", data);
      return [];
    }
    
    return data.articles.map((article: any) => ({
      title: article.title || "No title",
      description: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      category: category,
      imageUrl: article.image || "",
      time: new Date(article.publishedAt).toRelativeString(),
      url: article.url
    }));
  } catch (error) {
    console.error("Error fetching from GNews:", error);
    return [];
  }
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
    const url = new URL(req.url);
    const category = url.searchParams.get('category') || 'general';
    const source = (url.searchParams.get('source') || 'all') as NewsSource | 'all';
    
    console.log(`Fetching news for category: ${category}, source: ${source}`);
    
    let articles: NewsArticle[] = [];
    
    if (source === 'all' || source === 'newsapi') {
      const newsApiArticles = await fetchFromNewsAPI(category);
      articles = [...articles, ...newsApiArticles];
    }
    
    if (source === 'all' || source === 'gnews') {
      const gNewsArticles = await fetchFromGNews(category);
      articles = [...articles, ...gNewsArticles];
    }
    
    // If no articles were fetched, return a default set
    if (articles.length === 0) {
      articles = generateDefaultArticles(category);
    }
    
    // Shuffle and limit the number of articles
    articles = shuffleArray(articles).slice(0, 20);
    
    return new Response(
      JSON.stringify({ articles }),
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
function generateDefaultArticles(category: string): NewsArticle[] {
  const defaultSources = ['The Daily News', 'Global Tribune', 'Metro Herald', 'City Post', 'World Report'];
  
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
    ]
  };
  
  // If requested category doesn't exist in defaults, use general
  const articlesForCategory = categoryArticles[category] || categoryArticles.general;
  
  return articlesForCategory.map((article, index) => ({
    title: article.title,
    description: article.description,
    source: defaultSources[index % defaultSources.length],
    category: category,
    imageUrl: article.imageUrl,
    time: `${index + 1} hours ago`,
    url: `https://example.com/news/${index}`
  }));
}
