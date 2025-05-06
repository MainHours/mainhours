
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NewsCard from '@/components/dashboard/NewsCard';
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

interface NewsByCategoryProps {
  articles: NewsArticle[];
  category: string;
}

const NewsByCategory = ({ articles, category }: NewsByCategoryProps) => {
  const { t } = useTranslation();
  
  // Filter articles by the specified category
  const categoryArticles = articles.filter(article => 
    article.category.toLowerCase() === category.toLowerCase()
  );
  
  if (categoryArticles.length === 0) {
    return null; // Don't render this component if there are no articles in this category
  }
  
  return (
    <div className="mb-10">
      <h2 className="text-2xl font-bold mb-6">{category.charAt(0).toUpperCase() + category.slice(1)} {t('news.news')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryArticles.map((article, index) => (
          <div key={index}>
            <NewsCard {...article} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsByCategory;
