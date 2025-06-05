
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessageProps {
  message: {
    id: string;
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
    type?: 'text' | 'image';
    imageUrl?: string;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    toast.success('Copied to clipboard');
  };

  return (
    <div className={`flex gap-4 p-6 ${message.sender === 'user' ? 'bg-background' : 'bg-muted/30'}`}>
      <Avatar className="h-8 w-8 shrink-0">
        {message.sender === 'ai' ? (
          <AvatarImage 
            src="/lovable-uploads/a803f0aa-3b5c-4d71-b922-ff8d1eb26c9c.png" 
            alt="AI Assistant" 
          />
        ) : (
          <AvatarImage src="https://github.com/shadcn.png" alt="User" />
        )}
        <AvatarFallback>
          {message.sender === 'ai' ? 'AI' : 'U'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {message.type === 'image' && message.imageUrl ? (
            <div className="space-y-2">
              <img 
                src={message.imageUrl} 
                alt="Generated image" 
                className="rounded-lg max-w-md border"
              />
              {message.content && <p>{message.content}</p>}
            </div>
          ) : (
            <div className="whitespace-pre-wrap">{message.content}</div>
          )}
        </div>
        
        {message.sender === 'ai' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={copyToClipboard}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsUp className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm">
              <ThumbsDown className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
