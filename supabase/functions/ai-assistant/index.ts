
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { message } = await req.json();
    
    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Processing AI request: ${message}`);

    // Generate a response that includes references to real websites
    const query = message.toLowerCase();
    
    // Create a more sophisticated response with actual links
    const response = `I found some information about "${message}". Here are some resources you might find helpful:
    
1. Wikipedia has comprehensive information: https://en.wikipedia.org/wiki/${encodeURIComponent(message)}
2. For more search results, check Google: https://www.google.com/search?q=${encodeURIComponent(message)}
3. YouTube has videos on this topic: https://www.youtube.com/results?search_query=${encodeURIComponent(message)}
4. You might find interesting discussions on Reddit: https://www.reddit.com/search/?q=${encodeURIComponent(message)}
5. Academic resources are available on Google Scholar: https://scholar.google.com/scholar?q=${encodeURIComponent(message)}

Is there anything specific about "${message}" that you'd like me to focus on?`;

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('AI Assistant error:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to process AI request' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
