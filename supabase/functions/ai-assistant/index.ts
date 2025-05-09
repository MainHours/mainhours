
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

    // More sophisticated AI response generation
    const query = message.toLowerCase();
    let responseContent = '';
    
    // Generate response based on message context
    if (query.includes('hello') || query.includes('hi')) {
      responseContent = `Hello! I'm Nebulosa, a modern AI assistant. How can I help you today?`;
    } 
    else if (query.includes('how are you')) {
      responseContent = `I'm functioning optimally, thank you for asking! As an AI, I don't experience feelings, but I'm ready to assist you with information, creative tasks, or problem-solving. What can I help you with?`;
    }
    else if (query.includes('what can you do') || query.includes('capabilities') || query.includes('features')) {
      responseContent = `As a modern AI assistant, I can:

1. Answer factual questions and provide information on various topics
2. Assist with research by providing relevant links and resources
3. Help generate creative content or ideas
4. Explain complex concepts in simple terms
5. Provide insights on current events and trending topics
6. Assist with problem-solving and analysis

What would you like help with today?`;
    }
    else {
      // Simulate a more sophisticated AI response
      responseContent = `Based on your query about "${message}", here's what I found:

I analyzed your question and can provide some relevant information. This topic relates to ${generateRelevantTopic(message)}. 

Some key points to consider:
- ${generateKeyPoint(1, message)}
- ${generateKeyPoint(2, message)}
- ${generateKeyPoint(3, message)}

For more detailed information, you might want to explore:
- ${generateResource(1, message)}
- ${generateResource(2, message)}

Would you like me to elaborate on any specific aspect of this topic?`;
    }

    return new Response(
      JSON.stringify({ response: responseContent }),
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

// Helper functions to generate more contextual responses
function generateRelevantTopic(message) {
  const topics = [
    "technology and digital transformation",
    "human knowledge and information processing",
    "communication and language understanding",
    "problem-solving methodologies",
    "current global trends and developments",
    "data analysis and pattern recognition"
  ];
  
  return topics[Math.floor(Math.random() * topics.length)];
}

function generateKeyPoint(num, message) {
  const keyPoints = [
    "Modern AI systems utilize large language models trained on diverse datasets",
    "Context understanding is crucial for generating meaningful responses",
    "AI assistants can process and synthesize information from multiple sources",
    "Pattern recognition allows for identifying relevant connections between concepts",
    "Continuous learning helps improve response quality over time",
    "The balance between specificity and generalization is important for helpful answers"
  ];
  
  return keyPoints[(num + message.length) % keyPoints.length];
}

function generateResource(num, message) {
  const domains = ["wikipedia.org", "scholar.google.com", "arxiv.org", "nature.com", "research.gov"];
  const domain = domains[(num + message.length) % domains.length];
  
  return `https://www.${domain}/search?q=${encodeURIComponent(message)}`;
}
