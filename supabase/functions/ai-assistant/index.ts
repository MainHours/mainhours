
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

    // For now, we're using predefined responses since OpenAI API keys are not set up yet
    // In a real implementation, this would call the OpenAI API with the user's message
    const aiResponses = [
      `I understand you're asking about "${message}". Let me provide some insights based on my knowledge...`,
      `Thank you for your question about "${message}". Here's what I can tell you...`,
      `Regarding "${message}", there are several important aspects to consider...`,
      `I'd be happy to help with your query about "${message}". Based on the latest information...`,
      `"${message}" is an interesting topic! Here are some key points to understand...`
    ];
    
    const response = aiResponses[Math.floor(Math.random() * aiResponses.length)];

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
