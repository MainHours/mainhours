
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
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

interface BreakingNewsSectionProps {
  breakingNewsArticles: NewsArticle[];
}

const BreakingNewsSection = ({ breakingNewsArticles }: BreakingNewsSectionProps) => {
  const { t } = useTranslation();
  
  if (breakingNewsArticles.length === 0) {
    return null;
  }
  
  return (
    <Card className="border-t-4 border-t-red-500">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-red-500">
          <AlertCircle className="h-4 w-4 mr-2" /> 
          {t('news.breakingNews')}
        </CardTitle>
        <CardDescription>{t('news.justIn')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakingNewsArticles.slice(0, 3).map((article, index) => (
          <div key={index} className="border-b pb-4 last:border-0">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs">{article.category}</Badge>
              <p className="text-xs text-muted-foreground">{article.time}</p>
            </div>
            <h3 className="font-medium hover:text-mainhours-purple">
              {article.url ? (
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {article.title}
                </a>
              ) : article.title}
            </h3>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BreakingNewsSection;
