import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
const AI = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState([{
    sender: 'ai',
    content: "Hello! I'm Nebulosa. How can I help you today?"
  }]);
  const [input, setInput] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSend = async () => {
    if (input.trim() && !isProcessing) {
      // Add user message
      const userMessage = {
        sender: 'user',
        content: input
      };
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsProcessing(true);
      try {
        // Send request to AI assistant edge function
        const {
          data,
          error
        } = await supabase.functions.invoke('ai-assistant', {
          body: {
            message: input.trim()
          }
        });
        if (error) throw new Error(error.message);

        // Add AI response
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'ai',
            content: data.response
          }]);
          setIsProcessing(false);
        }, 500);
      } catch (error) {
        console.error('AI assistant error:', error);
        toast.error('Failed to get AI response. Please try again.');
        setIsProcessing(false);
      }
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  return <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>}
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
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
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
                {messages.map((message, index) => <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <Avatar className="h-10 w-10">
                        {message.sender === 'ai' ? <AvatarImage alt="AI" src="/lovable-uploads/a803f0aa-3b5c-4d71-b922-ff8d1eb26c9c.png" className="object-cover" /> : <AvatarImage src="https://github.com/shadcn.png" alt="User" />}
                        <AvatarFallback>
                          {message.sender === 'ai' ? 'AI' : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-4 ${message.sender === 'user' ? 'bg-mainhours-purple text-white' : 'bg-muted'}`}>
                        <p>{message.content}</p>
                      </div>
                    </div>
                  </div>)}
                <div ref={messagesEndRef} />
                
                {isProcessing && <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="AI" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-4 bg-muted flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>}
              </CardContent>
              
              <CardFooter className="pt-4 border-t">
                <div className="flex flex-col w-full gap-2">
                  <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyPress} placeholder="Ask me anything..." className="flex-grow min-h-[80px]" disabled={isProcessing} />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Press Enter to send</p>
                    <Button onClick={handleSend} disabled={isProcessing || !input.trim()}>
                      {isProcessing ? <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </> : 'Send Message'}
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    </div>;
};
export default AI;