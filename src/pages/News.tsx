
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { RefreshCw, Clock, Newspaper, Bell, ExternalLink } from 'lucide-react';
import NewsHero from '@/components/dashboard/NewsHero';
import BreakingNewsSection from '@/components/dashboard/BreakingNewsSection';
import NewsSourcesGrid from '@/components/dashboard/NewsSourcesGrid';
import SponsoredContent from '@/components/dashboard/SponsoredContent';
import TrendingNewsSection from '@/components/dashboard/TrendingNewsSection';
import { NewsSource } from '@/types/news';

const News = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('featured');
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(60);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { t } = useTranslation();
  const [newsSources, setNewsSources] = useState<NewsSource[]>([
    { id: 'bbc', name: 'BBC', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/1200px-BBC_Logo_2021.svg.png' },
    { id: 'nbc', name: 'NBC News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/NBC_logo.svg/1200px-NBC_logo.svg.png' },
    { id: 'nyt', name: 'New York Times', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/NewYorkTimes.svg/1200px-NewYorkTimes.svg.png' },
    { id: 'cnn', name: 'CNN', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/1200px-CNN.svg.png' },
    { id: 'fox', name: 'Fox News', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/1200px-Fox_News_Channel_logo.svg.png' },
    { id: 'wapo', name: 'Washington Post', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/The_Logo_of_The_Washington_Post_Newspaper.svg/1200px-The_Logo_of_The_Washington_Post_Newspaper.svg.png' },
    { id: 'reuters', name: 'Reuters', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Reuters_logo.svg/1200px-Reuters_logo.svg.png' },
    { id: 'guardian', name: 'The Guardian', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/The_Guardian_2018.svg/1200px-The_Guardian_2018.svg.png' },
  ]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  
  const fetchNews = useCallback(async (category: string = 'general') => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { 
          category, 
          source: selectedSourceId || 'all',
          timestamp: new Date().getTime()  // Add timestamp to prevent caching
        },
      });
      
      if (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to fetch news. Please try again later.');
        setLoading(false);
        return;
      }
      
      if (data && data.articles && data.articles.length > 0) {
        // Mark random articles as breaking news for demo purposes
        const articlesWithBreaking = data.articles.map((article, index) => ({
          ...article,
          isBreaking: index === 0 || Math.random() > 0.7, // First article and ~30% of others are breaking news
          trending: Math.floor(Math.random() * 1000) + 100,
          comments: Math.floor(Math.random() * 200),
        }));
        
        // Set the first article as featured news
        setFeaturedNews(articlesWithBreaking[0]);
        // Set the rest as regular articles
        setArticles(articlesWithBreaking.slice(1));
        setLastUpdated(new Date());
        toast.success('Latest news loaded', { duration: 2000 });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedSourceId]);
  
  useEffect(() => {
    fetchNews(activeTab === 'featured' ? 'general' : activeTab);
    
    // Setup auto refresh if enabled
    let refreshTimer: number | undefined;
    if (autoRefresh) {
      refreshTimer = window.setInterval(() => {
        fetchNews(activeTab === 'featured' ? 'general' : activeTab);
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
  
  // Get breaking news articles
  const getBreakingNewsArticles = () => {
    return articles.filter(article => article.isBreaking).slice(0, 5);
  };
  
  // Get trending news articles
  const getTrendingNewsArticles = () => {
    return [...articles].sort((a, b) => b.trending - a.trending).slice(0, 5);
  };

  // Get articles by source
  const getArticlesBySource = (source: string) => {
    return articles.filter(article => article.source.toLowerCase().includes(source.toLowerCase()));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2 flex items-center">
                  <Newspaper className="h-6 w-6 mr-2 text-mainhours-purple" />
                  MainHours News
                </h1>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {t('news.lastUpdated')}: {formatLastUpdated(lastUpdated)}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-1 h-auto" 
                    onClick={() => fetchNews(activeTab === 'featured' ? 'general' : activeTab)}
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
            
            <NewsSourcesGrid 
              sources={newsSources} 
              selectedSourceId={selectedSourceId} 
              onSourceSelect={setSelectedSourceId} 
            />
            
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
              <div className="flex justify-center mb-6 overflow-x-auto border-b">
                <TabsList className="bg-transparent">
                  <TabsTrigger value="featured">{t('news.featured')}</TabsTrigger>
                  <TabsTrigger value="technology">Technology</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                  <TabsTrigger value="sports">Sports</TabsTrigger>
                  <TabsTrigger value="science">Science</TabsTrigger>
                  <TabsTrigger value="politics">Politics</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  // Loading state
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-full md:col-span-2">
                        <Skeleton className="h-96 w-full rounded-lg" />
                      </div>
                      <div className="col-span-full md:col-span-1">
                        <Skeleton className="h-96 w-full rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Top News Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-full md:col-span-2">
                        <NewsHero featuredNews={featuredNews} />
                      </div>
                      
                      <div className="col-span-full md:col-span-1 space-y-6">
                        <BreakingNewsSection breakingNewsArticles={getBreakingNewsArticles()} />
                      </div>
                    </div>
                    
                    {/* Trending Section */}
                    <TrendingNewsSection trendingArticles={getTrendingNewsArticles()} />
                    
                    {/* Main News Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles
                        .filter(article => !article.isBreaking)
                        .slice(0, 6)
                        .map((article, index) => (
                          <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-48 overflow-hidden">
                              <img 
                                src={article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D'} 
                                alt={article.title}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                              />
                            </div>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                <span>{article.source}</span>
                                <span>{article.time}</span>
                              </div>
                              <h3 className="font-bold text-lg line-clamp-2 mb-2 hover:text-mainhours-purple">
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                  {article.title}
                                </a>
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                {article.description}
                              </p>
                              <div className="flex justify-between items-center mt-4 text-xs">
                                <span className="text-mainhours-purple">{article.category}</span>
                                <a 
                                  href={article.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-mainhours-purple hover:underline"
                                >
                                  Read more <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                    
                    {/* Sponsored Content */}
                    <SponsoredContent />

                    {/* Latest Headlines Table */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4">Latest Headlines</h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Time</TableHead>
                              <TableHead className="w-[50%]">Headline</TableHead>
                              <TableHead>Source</TableHead>
                              <TableHead>Category</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {articles.slice(0, 10).map((article, index) => (
                              <TableRow key={index}>
                                <TableCell>{article.time}</TableCell>
                                <TableCell>
                                  <a 
                                    href={article.url} 
                                    className="hover:text-mainhours-purple hover:underline"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    {article.title}
                                  </a>
                                </TableCell>
                                <TableCell>{article.source}</TableCell>
                                <TableCell>{article.category}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    {articles.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">
                          {t('news.noMoreNews')}
                        </p>
                      </div>
                    )}
                  </div>
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
