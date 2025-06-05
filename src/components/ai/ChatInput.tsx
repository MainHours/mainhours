
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  SendHorizonal, 
  Paperclip, 
  Image as ImageIcon, 
  Mic, 
  Square 
} from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, type?: 'text' | 'image') => void;
  onGenerateImage: (prompt: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onGenerateImage, 
  isLoading, 
  disabled 
}) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleImageGeneration = () => {
    if (input.trim() && !isLoading) {
      onGenerateImage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-background p-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Message Nebulosa..."
              className="min-h-[60px] max-h-[200px] resize-none pr-12 py-4"
              disabled={disabled}
            />
            <div className="absolute right-2 bottom-2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImageGeneration}
              disabled={!input.trim() || isLoading || disabled}
              className="h-9"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsRecording(!isRecording)}
              disabled={disabled}
              className="h-9"
            >
              {isRecording ? (
                <Square className="h-4 w-4 text-red-500" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || isLoading || disabled}
              className="h-9"
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-2 text-xs text-muted-foreground text-center">
          Nebulosa can make mistakes. Consider checking important information.
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
