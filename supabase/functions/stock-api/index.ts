
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface StockRequest {
  symbols?: string[];
  includeNews?: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JNJ'], includeNews = true } = await req.json() as StockRequest;
    const finnhubApiKey = Deno.env.get('FINNHUB_API_KEY');

    if (!finnhubApiKey) {
      console.error('Finnhub API key not configured');
      return new Response(
        JSON.stringify({ error: 'Stock API not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching stock data for symbols: ${symbols.join(', ')}`);

    // Fetch stock quotes for all symbols
    const stockPromises = symbols.map(async (symbol) => {
      const quoteResponse = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnhubApiKey}`);
      const profileResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${finnhubApiKey}`);
      
      if (!quoteResponse.ok || !profileResponse.ok) {
        console.error(`Failed to fetch data for ${symbol}`);
        return null;
      }

      const quote = await quoteResponse.json();
      const profile = await profileResponse.json();

      // Calculate percentage change
      const changePercent = quote.dp || 0;
      
      return {
        symbol,
        name: profile.name || symbol,
        price: quote.c || 0, // current price
        change: changePercent,
        marketCap: profile.marketCapitalization ? `${(profile.marketCapitalization / 1000).toFixed(1)}B` : 'N/A'
      };
    });

    // Fetch market news if requested
    let newsPromise = Promise.resolve([]);
    if (includeNews) {
      newsPromise = fetch(`https://finnhub.io/api/v1/news?category=general&token=${finnhubApiKey}`)
        .then(response => response.ok ? response.json() : [])
        .then(news => news.slice(0, 3).map((item: any) => ({
          title: item.headline,
          description: item.summary,
          time: new Date(item.datetime * 1000).toLocaleString(),
          url: item.url
        })))
        .catch(() => []);
    }

    const [stockResults, news] = await Promise.all([
      Promise.all(stockPromises),
      newsPromise
    ]);

    // Filter out any failed requests
    const stocks = stockResults.filter(stock => stock !== null);

    console.log(`Successfully fetched data for ${stocks.length} stocks`);

    return new Response(
      JSON.stringify({
        stocks,
        news,
        lastUpdated: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in stock-api function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stock data' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
