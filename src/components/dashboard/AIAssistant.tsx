
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      content: "Hello! I'm Nebulosa, your AI assistant. How can I assist you today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim()) {
      // Add user message
      setMessages(prev => [...prev, { sender: 'user', content: input }]);
      setIsLoading(true);
      
      try {
        // Send request to AI assistant edge function
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: {
            message: input.trim()
          }
        });
        
        if (error) throw new Error(error.message);
        
        // Add AI response
        setMessages(prev => [...prev, { 
          sender: 'ai', 
          content: data.response 
        }]);
      } catch (error) {
        console.error('Error:', error);
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-1 flex items-center justify-center w-8 h-8">
            <Bot className="text-white h-5 w-5" />
          </div>
          <span>Nebulosa AI</span>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-mainhours-purple/20 text-mainhours-purple">
            v2.0
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8">
                {message.sender === 'ai' ? (
                  <AvatarImage src="/lovable-uploads/a803f0aa-3b5c-4d71-b922-ff8d1eb26c9c.png" alt="AI" />
                ) : (
                  <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                )}
                <AvatarFallback>
                  {message.sender === 'ai' ? 'AI' : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className={`rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-mainhours-purple to-purple-700 text-white'
                  : 'bg-muted'
              }`}>
                {message.content.split('\n').map((text, i) => (
                  <p key={i} className={`text-sm ${i > 0 ? 'mt-1' : ''}`}>{text}</p>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <div className="flex w-full gap-2">
          <div className="relative flex-grow">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Nebulosa anything..." 
              className="pr-10"
              disabled={isLoading}
            />
            <Button 
              size="icon"
              variant="ghost" 
              className="absolute right-0 top-0 h-full" 
              onClick={handleSend} 
              disabled={isLoading}
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
