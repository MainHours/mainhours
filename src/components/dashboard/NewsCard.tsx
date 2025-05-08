
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Newspaper, ExternalLink, Clock, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface NewsCardProps {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
  url?: string;
  isBreaking?: boolean;
}

const NewsCard = ({
  title,
  description,
  source,
  category,
  imageUrl,
  time,
  url,
  isBreaking = false
}: NewsCardProps) => {
  const { t } = useTranslation();
  
  const handleReadMore = (e: React.MouseEvent) => {
    if (!url) {
      e.preventDefault();
      return;
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow duration-200">
      <div className="relative h-40">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D'} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D';
          }}
        />
        <Badge className="absolute top-2 right-2 bg-opacity-80">{category}</Badge>
        {isBreaking && (
          <div className="absolute bottom-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md flex items-center text-xs font-bold animate-pulse">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('news.breakingNews')}
          </div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center text-sm">
            <Newspaper className="h-3 w-3 mr-1" />
            {source}
          </CardDescription>
          <CardDescription className="text-xs flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {time}
          </CardDescription>
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        {url ? (
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm text-primary hover:underline flex items-center"
            onClick={handleReadMore}
          >
            {t('news.readMore')} <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No link available</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
