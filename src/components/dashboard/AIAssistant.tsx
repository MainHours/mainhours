
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Bot } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm Nebulosa, your AI assistant. I can help you with analysis, research, and creative tasks. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { sender: 'user', content: input }]);
      setIsLoading(true);
      
      try {
        // Simulate AI processing time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get contextual response based on input
        const aiResponse = getContextualResponse(input);
        
        setMessages(prev => [...prev, { sender: 'ai', content: aiResponse }]);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get response. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        setInput('');
      }
    }
  };

  const getContextualResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! How can I help you today?";
    }
    
    if (input.includes('how are you')) {
      return "I'm functioning well, thank you for asking! I'm here to assist you with any questions or tasks you might have.";
    }
    
    if (input.includes('what can you do') || input.includes('help me')) {
      return "I can help you with various tasks including analysis, answering questions, providing explanations, writing, and creative work. What specific assistance do you need?";
    }
    
    if (input.includes('who are you')) {
      return "I'm Nebulosa, an AI assistant designed to help you with various tasks. I can analyze data, answer questions, help with research, and engage in creative discussions.";
    }

    // Default response with follow-up question
    return `Based on your input about "${userInput}", I can help analyze this further. Could you provide more specific details about what you'd like to know?`;
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-r from-purple-500 to-blue-500 p-1 flex items-center justify-center w-8 h-8">
            <Bot className="text-white h-5 w-5" />
          </div>
          Nebulosa AI
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8">
                {message.sender === 'ai' ? (
                  <AvatarImage src="/lovable-uploads/f65d98ab-d9f7-4561-a13e-18e5a61bada7.png" alt="Nebulosa" />
                ) : (
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                )}
                <AvatarFallback>
                  {message.sender === 'ai' ? 'AI' : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-mainhours-purple text-white'
                  : 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-foreground'
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Nebulosa anything..." 
            className="flex-grow"
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            {isLoading ? 'Thinking...' : 'Send'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
