
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

interface FeaturedPostProps {
  username: string;
  avatarUrl?: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
}

const FeaturedPost = ({
  username,
  avatarUrl,
  imageUrl,
  caption,
  likes,
  comments,
  timeAgo
}: FeaturedPostProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>{username.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{username}</p>
          <p className="text-sm text-muted-foreground">{timeAgo}</p>
        </div>
      </div>
      <div className="relative aspect-square">
        <img 
          src={imageUrl} 
          alt="Post content" 
          className="object-cover w-full h-full"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Button variant="ghost" size="sm" className="h-8 gap-1">
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
              className="lucide lucide-heart"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
            </svg>
            <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{comments}</span>
          </Button>
        </div>
        <p className="text-sm">
          <span className="font-medium">{username}</span> {caption}
        </p>
      </CardContent>
    </Card>
  );
};

export default FeaturedPost;
