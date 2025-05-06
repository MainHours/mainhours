
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsCard from '@/components/dashboard/NewsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { RefreshCw, AlertCircle, Clock } from 'lucide-react';

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

const News = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('general');
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(60);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { t } = useTranslation();
  
  const fetchNews = useCallback(async (category: string = 'general') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { category },
      });
      
      if (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to fetch news. Please try again later.');
        setLoading(false);
        return;
      }
      
      if (data && data.articles && data.articles.length > 0) {
        // Mark random articles as breaking news for demo purposes
        const articlesWithBreaking = data.articles.map((article: NewsArticle, index: number) => ({
          ...article,
          isBreaking: index === 0 || Math.random() > 0.7 // First article and ~30% of others are breaking news
        }));
        
        // Set the first article as featured news
        setFeaturedNews(articlesWithBreaking[0]);
        // Set the rest as regular articles
        setArticles(articlesWithBreaking.slice(1));
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchNews(activeTab);
    
    // Setup auto refresh if enabled
    let refreshTimer: number | undefined;
    if (autoRefresh) {
      refreshTimer = window.setInterval(() => {
        fetchNews(activeTab);
        toast.info(`${t('news.realTimeUpdates')}: ${t('news.justIn')}!`, {
          duration: 3000
        });
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (refreshTimer) window.clearInterval(refreshTimer);
    };
  }, [activeTab, autoRefresh, refreshInterval, fetchNews, t]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">News Portal</h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {t('news.lastUpdated')}: {formatLastUpdated(lastUpdated)}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 h-auto" 
                    onClick={() => fetchNews(activeTab)}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{t('news.autoRefresh')}</span>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                </div>
                
                {autoRefresh && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{t('news.refreshInterval')}</span>
                    <Select 
                      value={refreshInterval.toString()} 
                      onValueChange={(value) => setRefreshInterval(parseInt(value))}
                    >
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="60s" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30s</SelectItem>
                        <SelectItem value="60">1m</SelectItem>
                        <SelectItem value="300">5m</SelectItem>
                        <SelectItem value="600">10m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
              <div className="flex justify-center mb-6 overflow-x-auto">
                <TabsList>
                  <TabsTrigger value="general">{t('news.topStories')}</TabsTrigger>
                  <TabsTrigger value="technology">Technology</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                  <TabsTrigger value="sports">Sports</TabsTrigger>
                  <TabsTrigger value="science">Science</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  // Loading state
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="col-span-full md:col-span-2">
                        <Card>
                          <div className="h-80 bg-muted rounded-t-lg" />
                          <CardHeader>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-6 w-full mb-4" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                          </CardContent>
                        </Card>
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <Card>
                          <CardHeader>
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-24" />
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {[1, 2].map((_, i) => (
                              <div key={i} className="border-b pb-4">
                                <Skeleton className="h-3 w-16 mb-1" />
                                <Skeleton className="h-5 w-full" />
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="overflow-hidden">
                          <div className="h-40 bg-muted" />
                          <CardHeader>
                            <Skeleton className="h-4 w-32 mb-2" />
                            <Skeleton className="h-5 w-full" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredNews && (
                        <div className="col-span-full md:col-span-2">
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
                        </div>
                      )}
                      
                      <div className="col-span-full md:col-span-1 space-y-6">
                        <Card className="border-t-4 border-t-red-500">
                          <CardHeader className="pb-2">
                            <CardTitle className="flex items-center text-red-500">
                              <AlertCircle className="h-4 w-4 mr-2" /> 
                              {t('news.breakingNews')}
                            </CardTitle>
                            <CardDescription>{t('news.justIn')}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {articles.filter(a => a.isBreaking).slice(0, 3).map((article, index) => (
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
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mt-8 mb-6">{activeTab === 'general' ? t('news.topStories') : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + ' News'}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.slice(2).map((article, index) => (
                        <div key={index}>
                          <NewsCard {...article} />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default News;
