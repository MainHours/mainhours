
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const AI = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState([
    { sender: 'ai', content: "Hello! I'm Nebulosa. How can I help you today?" }
  ]);
  const [input, setInput] = React.useState('');

  const handleSend = () => {
    if (input.trim()) {
      // Add user message
      setMessages([...messages, { sender: 'user', content: input }]);
      
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: 'ai', content: getAIResponse(input) }
        ]);
      }, 1000);
      
      setInput('');
    }
  };

  const getAIResponse = (query: string) => {
    // This is a simple simulation of AI responses
    const responses = [
      `I understand you're asking about "${query}". This topic is quite interesting! Let me provide some insights...`,
      `Thanks for asking about "${query}". Here's what I can tell you based on my knowledge...`,
      `"${query}" is a fascinating subject! Here are some key points to consider...`,
      `I'd be happy to help with your question about "${query}". Based on the latest information...`,
      `Regarding "${query}", there are several important aspects to consider...`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-4 md:p-6 pb-0">
            <h1 className="text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">
              Powered by GPT-4o - ask me anything!
            </p>
          </div>
          
          <div className="flex-grow flex flex-col p-4 md:p-6">
            <Card className="flex-grow flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-2">
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
                  <CardTitle>Chat with AI Assistant</CardTitle>
                </div>
                <CardDescription>
                  Ask any question and get intelligent responses
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-10 w-10">
                        {message.sender === 'ai' ? (
                          <AvatarImage src="https://github.com/shadcn.png" alt="AI" />
                        ) : (
                          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        )}
                        <AvatarFallback>
                          {message.sender === 'ai' ? 'AI' : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-4 ${
                        message.sender === 'user'
                          ? 'bg-mainhours-purple text-white'
                          : 'bg-muted'
                      }`}>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter className="pt-4 border-t">
                <div className="flex flex-col w-full gap-2">
                  <Textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask me anything..." 
                    className="flex-grow min-h-[80px]"
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Press Enter to send</p>
                    <Button onClick={handleSend}>Send Message</Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AI;
