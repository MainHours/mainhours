
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, MessageSquare, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

interface NewsArticle {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
  url?: string;
  isBreaking?: boolean;
  trending?: number;
  comments?: number;
}

interface NewsHeroProps {
  featuredNews: NewsArticle | null;
}

const NewsHero = ({ featuredNews }: NewsHeroProps) => {
  const { t } = useTranslation();
  
  if (!featuredNews) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="relative h-96">
        <img 
          src={featuredNews.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D'} 
          alt={featuredNews.title}
          className="object-cover w-full h-full"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D';
          }}
        />
        {featuredNews.isBreaking && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md flex items-center text-sm font-bold animate-pulse">
            <AlertCircle className="h-4 w-4 mr-1" />
            {t('news.breakingNews')}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex justify-between items-center mb-2">
            <Badge className="bg-mainhours-purple text-white">{featuredNews.source}</Badge>
            <span className="text-sm flex items-center opacity-80">
              <Clock className="h-3 w-3 mr-1" />
              {featuredNews.time}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {featuredNews.title}
          </h1>
          <p className="text-sm md:text-base mb-4 opacity-90 line-clamp-2 md:line-clamp-3">
            {featuredNews.description}
          </p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Button 
                size="sm" 
                className="bg-white text-black hover:bg-opacity-90" 
                asChild
              >
                <a href={featuredNews.url} target="_blank" rel="noopener noreferrer">
                  Read Full Story
                </a>
              </Button>
              <Button size="sm" variant="outline" className="text-white border-white hover:bg-white/20">
                <MessageSquare className="h-4 w-4 mr-1" />
                {featuredNews.comments || 0}
              </Button>
            </div>
            <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default NewsHero;
