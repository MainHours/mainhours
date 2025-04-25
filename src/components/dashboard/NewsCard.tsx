
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { News } from 'lucide-react';

interface NewsCardProps {
  title: string;
  description: string;
  source: string;
  category: string;
  imageUrl: string;
  time: string;
}

const NewsCard = ({
  title,
  description,
  source,
  category,
  imageUrl,
  time
}: NewsCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-40">
        <img 
          src={imageUrl} 
          alt={title}
          className="object-cover w-full h-full"
        />
        <Badge className="absolute top-2 right-2">{category}</Badge>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="flex items-center text-sm">
            <News className="h-3 w-3 mr-1" />
            {source}
          </CardDescription>
          <CardDescription className="text-xs">{time}</CardDescription>
        </div>
        <CardTitle className="text-lg line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <a href="#" className="text-sm text-mainhours-purple hover:underline">Read more</a>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
