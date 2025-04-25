
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hello! I\'m your AI assistant powered by GPT-4o. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      setMessages([...messages, { sender: 'user', content: input }]);
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', content: `This is a simulated response to: "${input}"` }
        ]);
      }, 1000);
      
      setInput('');
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
          <div className="rounded-full bg-mainhours-purple p-1 flex items-center justify-center w-8 h-8">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.29 7 12 12 20.71 7"></polyline>
              <line x1="12" y1="22" x2="12" y2="12"></line>
            </svg>
          </div>
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-8 w-8">
                {message.sender === 'ai' ? (
                  <AvatarImage src="https://github.com/shadcn.png" alt="AI" />
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
                  : 'bg-secondary text-secondary-foreground'
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
            placeholder="Ask me anything..." 
            className="flex-grow"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;
