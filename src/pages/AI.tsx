
import React, { useRef, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Bot, SendHorizonal, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const AI = () => {
  const isMobile = useIsMobile();
  const [messages, setMessages] = React.useState([{
    sender: 'ai',
    content: "Hello! I'm Nebulosa, your AI assistant powered by advanced language processing. How can I assist you today?"
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

        // Add AI response gradually with typing effect
        let response = data.response;
        
        setMessages(prev => [...prev, {
          sender: 'ai',
          content: response
        }]);
        setIsProcessing(false);
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
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-background/95">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-4 md:p-6 pb-0">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-mainhours-purple" />
              <h1 className="text-3xl font-bold">AI Assistant</h1>
            </div>
            <p className="text-muted-foreground flex items-center gap-1">
              <span>Powered by advanced language models</span>
            </p>
          </div>
          
          <div className="flex-grow flex flex-col p-4 md:p-6">
            <Card className="flex-grow flex flex-col shadow-lg border-mainhours-purple/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-1 flex items-center justify-center w-10 h-10">
                    <Bot className="text-white h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="flex items-center">
                      Nebulosa AI
                      <span className="ml-2 inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-mainhours-purple/20 text-mainhours-purple">
                        v2.0
                      </span>
                    </CardTitle>
                    <CardDescription>
                      Advanced language processing
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-grow overflow-y-auto space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <Avatar className={`h-10 w-10 ${message.sender === 'user' ? '' : 'ring-2 ring-mainhours-purple/20'}`}>
                        {message.sender === 'ai' ? (
                          <AvatarImage 
                            alt="AI" 
                            src="/lovable-uploads/a803f0aa-3b5c-4d71-b922-ff8d1eb26c9c.png" 
                            className="object-cover" 
                          />
                        ) : (
                          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                        )}
                        <AvatarFallback>
                          {message.sender === 'ai' ? 'AI' : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`rounded-lg p-4 ${
                          message.sender === 'user' 
                            ? 'bg-gradient-to-r from-mainhours-purple to-purple-700 text-white shadow-md' 
                            : 'bg-card border border-border shadow-sm'
                        }`}
                      >
                        {message.content.split('\n').map((text, i) => (
                          <p key={i} className={i > 0 ? 'mt-2' : ''}>
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[85%]">
                      <Avatar className="h-10 w-10 ring-2 ring-mainhours-purple/20">
                        <AvatarImage 
                          alt="AI" 
                          src="/lovable-uploads/a803f0aa-3b5c-4d71-b922-ff8d1eb26c9c.png" 
                        />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg p-4 bg-card border border-border shadow-sm flex items-center">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-4 border-t">
                <div className="flex flex-col w-full gap-2">
                  <div className="relative">
                    <Textarea 
                      value={input} 
                      onChange={e => setInput(e.target.value)} 
                      onKeyDown={handleKeyPress} 
                      placeholder="Ask me anything..." 
                      className="pr-12 min-h-[80px] resize-none focus-visible:ring-mainhours-purple" 
                      disabled={isProcessing} 
                    />
                    <Button 
                      size="icon" 
                      className="absolute bottom-3 right-3 rounded-full h-8 w-8 bg-mainhours-purple hover:bg-mainhours-purple/90"
                      onClick={handleSend} 
                      disabled={isProcessing || !input.trim()}
                    >
                      {isProcessing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SendHorizonal className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Shift + Enter for new line</p>
                    <p className="text-xs text-muted-foreground">
                      {input.length > 0 ? `${input.length} characters` : 'Enter to send'}
                    </p>
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
