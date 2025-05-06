
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle } from 'lucide-react';
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
}

interface FeaturedNewsSectionProps {
  featuredNews: NewsArticle | null;
}

const FeaturedNewsSection = ({ featuredNews }: FeaturedNewsSectionProps) => {
  const { t } = useTranslation();
  
  if (!featuredNews) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative h-80">
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
      </div>
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Badge variant="secondary" className="bg-mainhours-red text-white">
              {featuredNews.category}
            </Badge>
            <span className="ml-2 text-sm text-muted-foreground">
              {featuredNews.source}
            </span>
          </div>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {featuredNews.time}
          </span>
        </div>
        <CardTitle className="text-2xl">{featuredNews.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{featuredNews.description}</p>
        <div className="mt-4">
          {featuredNews.url ? (
            <a 
              href={featuredNews.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-mainhours-purple hover:underline"
            >
              {t('news.readMore')}
            </a>
          ) : (
            <span className="text-muted-foreground">No link available</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeaturedNewsSection;
