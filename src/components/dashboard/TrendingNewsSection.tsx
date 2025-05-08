
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ExternalLink } from 'lucide-react';
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

interface TrendingNewsSectionProps {
  trendingArticles: NewsArticle[];
}

const TrendingNewsSection = ({ trendingArticles }: TrendingNewsSectionProps) => {
  const { t } = useTranslation();
  
  if (!trendingArticles || trendingArticles.length === 0) {
    return null;
  }
  
  return (
    <Card className="bg-gradient-to-r from-mainhours-purple/10 to-transparent border-l-4 border-l-mainhours-purple">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="h-5 w-5 mr-2 text-mainhours-purple" />
          Trending Now
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {trendingArticles.map((article, index) => (
            <Card key={index} className="overflow-hidden bg-transparent border-0 shadow-none">
              <a 
                href={article.url} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col h-full hover:text-mainhours-purple"
              >
                <div className="flex items-center mb-2">
                  <span className="text-3xl font-bold text-mainhours-purple/50 mr-3">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-medium line-clamp-2 text-sm">
                      {article.title}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <span>{article.source}</span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                        {article.trending}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingNewsSection;
