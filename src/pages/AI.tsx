
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/layout/Navbar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Menu, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import ChatMessage from '@/components/ai/ChatMessage';
import ChatInput from '@/components/ai/ChatInput';
import ChatSidebar from '@/components/ai/ChatSidebar';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  type?: 'text' | 'image';
  imageUrl?: string;
}

interface Chat {
  id: string;
  title: string;
  updatedAt: Date;
  messageCount: number;
  messages: Message[];
}

const AI = () => {
  const isMobile = useIsMobile();
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Welcome Chat',
      updatedAt: new Date(),
      messageCount: 1,
      messages: [
        {
          id: '1',
          sender: 'ai',
          content: "Hello! I'm Nebulosa, your AI assistant. I can help you with various tasks including answering questions, generating images, creative writing, and much more. How can I assist you today?",
          timestamp: new Date(),
          type: 'text'
        }
      ]
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(chat => chat.id === currentChatId);
  const messages = currentChat?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string, type: 'text' | 'image' = 'text') => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content,
      timestamp: new Date(),
      type
    };

    // Add user message to current chat
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId 
        ? { 
            ...chat, 
            messages: [...chat.messages, userMessage],
            messageCount: chat.messageCount + 1,
            updatedAt: new Date()
          }
        : chat
    ));

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: { message: content }
      });
      
      if (error) throw new Error(error.message);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        content: data.response,
        timestamp: new Date(),
        type: 'text'
      };

      // Add AI response to current chat
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { 
              ...chat, 
              messages: [...chat.messages, aiMessage],
              messageCount: chat.messageCount + 1,
              updatedAt: new Date()
            }
          : chat
      ));
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (prompt: string) => {
    // For now, we'll just show a placeholder - you can implement actual image generation
    toast.info('Image generation feature coming soon!');
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      updatedAt: new Date(),
      messageCount: 0,
      messages: []
    };
    
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId && chats.length > 1) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      setCurrentChatId(remainingChats[0]?.id || '');
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, title: newTitle } : chat
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <div className="absolute top-20 left-4 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Sidebar */}
        {(sidebarOpen || !isMobile) && (
          <ChatSidebar
            chats={chats}
            currentChatId={currentChatId}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            onRenameChat={handleRenameChat}
          />
        )}

        {/* Main chat area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b bg-background p-4">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-2">
                <Bot className="text-white h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Nebulosa AI</h1>
                <p className="text-sm text-muted-foreground">
                  {currentChat?.title || 'AI Assistant'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center p-8">
                <div className="max-w-md space-y-4">
                  <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-4 w-16 h-16 mx-auto flex items-center justify-center">
                    <Bot className="text-white h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-semibold">Start a conversation</h2>
                  <p className="text-muted-foreground">
                    Ask me anything! I can help with questions, creative writing, analysis, and more.
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && (
                  <div className="flex gap-4 p-6 bg-muted/30">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center">
                      <Bot className="text-white h-4 w-4" />
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-mainhours-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <ChatInput
            onSendMessage={handleSendMessage}
            onGenerateImage={handleGenerateImage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AI;
