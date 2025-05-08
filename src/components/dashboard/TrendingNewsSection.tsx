
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { NewsArticle } from '@/types/news';

interface TrendingNewsSectionProps {
  trendingArticles: NewsArticle[];
}

const TrendingNewsSection = ({ trendingArticles }: TrendingNewsSectionProps) => {
  const { t } = useTranslation();
  
  if (!trendingArticles || trendingArticles.length === 0) {
    return null;
  }
  
  // Generate a logo URL based on the source name
  const getSourceLogo = (source: string) => {
    const sourceLower = source.toLowerCase();
    if (sourceLower.includes('bbc')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/1200px-BBC_Logo_2021.svg.png';
    } else if (sourceLower.includes('nbc')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/NBC_News_2011.svg/1200px-NBC_News_2011.svg.png';
    } else if (sourceLower.includes('new york times') || sourceLower.includes('nyt')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/NewYorkTimes.svg/1200px-NewYorkTimes.svg.png';
    } else if (sourceLower.includes('cnn')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/1200px-CNN.svg.png';
    } else if (sourceLower.includes('fox')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/1200px-Fox_News_Channel_logo.svg.png';
    } else if (sourceLower.includes('washington') || sourceLower.includes('wapo')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/1200px-The_Logo_of_The_Washington_Post_Newspaper.svg.png';
    } else if (sourceLower.includes('reuters')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Reuters_2008_logo.svg/1200px-Reuters_2008_logo.svg.png';
    } else if (sourceLower.includes('guardian')) {
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_Guardian_2018.svg/1200px-The_Guardian_2018.svg.png';
    }
    return null;
  };
  
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
                      {getSourceLogo(article.source) ? (
                        <img src={getSourceLogo(article.source) || ''} alt={article.source} className="h-3 mr-1" />
                      ) : null}
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
