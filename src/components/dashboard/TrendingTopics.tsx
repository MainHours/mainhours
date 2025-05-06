
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface TrendingTopic {
  id: number;
  topic: string;
  count: string;
  category: string;
}

const TrendingTopics = () => {
  const { t } = useTranslation();
  
  const trends: TrendingTopic[] = [
    { id: 1, topic: '#TechConference2025', count: '120K posts', category: 'Technology' },
    { id: 2, topic: 'Olympic Games', count: '95K posts', category: 'Sports' },
    { id: 3, topic: 'New AI Breakthrough', count: '85K posts', category: 'Science' },
    { id: 4, topic: 'Financial Markets', count: '62K posts', category: 'Business' },
    { id: 5, topic: 'Climate Summit', count: '58K posts', category: 'Environment' },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {t('trends.topicTitle')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {trends.map((trend) => (
            <div key={trend.id} className="flex items-start">
              <div className="flex-shrink-0 mr-2 mt-1 text-lg font-bold text-muted-foreground">
                {trend.id}
              </div>
              <div>
                <p className="font-medium">{trend.topic}</p>
                <div className="flex items-center text-sm text-muted-foreground">
                  <span>{trend.count}</span>
                  <span className="mx-1">•</span>
                  <span>{trend.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;
