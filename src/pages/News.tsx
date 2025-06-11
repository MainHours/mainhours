
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
import { RefreshCw, Clock, Newspaper, ExternalLink } from 'lucide-react';
import NewsHero from '@/components/dashboard/NewsHero';
import BreakingNewsSection from '@/components/dashboard/BreakingNewsSection';
import TrendingNewsSection from '@/components/dashboard/TrendingNewsSection';

const News = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>('headlines');
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState([]);
  const [featuredNews, setFeaturedNews] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(60);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [seenArticleIds, setSeenArticleIds] = useState<Set<string>>(new Set());
  const { t } = useTranslation();
  
  const generateUniqueId = (article) => {
    return `${article.title}-${article.source}`.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  };
  
  const fetchNews = useCallback(async (category: string = 'general', isRefresh: boolean = false) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('news-api', {
        body: { 
          category, 
          source: 'all',
          timestamp: new Date().getTime(),
          excludeIds: isRefresh ? Array.from(seenArticleIds) : []
        },
      });
      
      if (error) {
        console.error('Error fetching news:', error);
        toast.error('Failed to fetch news. Please try again later.');
        setLoading(false);
        return;
      }
      
      if (data && data.articles && data.articles.length > 0) {
        const newArticles = data.articles.filter(article => {
          const articleId = generateUniqueId(article);
          return !seenArticleIds.has(articleId);
        });
        
        if (newArticles.length === 0 && isRefresh) {
          toast.info('No new articles available at this time');
          setLoading(false);
          return;
        }
        
        const articlesWithBreaking = (isRefresh ? newArticles : data.articles).map((article, index) => {
          const articleId = generateUniqueId(article);
          return {
            ...article,
            id: articleId,
            isBreaking: index === 0 || Math.random() > 0.7,
            trending: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 200),
            isNew: isRefresh,
          };
        });
        
        const newSeenIds = new Set(seenArticleIds);
        articlesWithBreaking.forEach(article => {
          newSeenIds.add(article.id);
        });
        setSeenArticleIds(newSeenIds);
        
        if (isRefresh && newArticles.length > 0) {
          setArticles(prev => [...articlesWithBreaking.slice(1), ...prev]);
          setFeaturedNews(articlesWithBreaking[0]);
          toast.success(`${newArticles.length} new articles loaded`, { duration: 3000 });
        } else {
          setFeaturedNews(articlesWithBreaking[0]);
          setArticles(articlesWithBreaking.slice(1));
          toast.success('Latest news loaded', { duration: 2000 });
        }
        
        setLastUpdated(new Date());
      } else if (isRefresh) {
        toast.info('No new articles available');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [seenArticleIds]);
  
  useEffect(() => {
    setSeenArticleIds(new Set());
    fetchNews(activeTab === 'headlines' ? 'general' : activeTab);
    
    let refreshTimer: number | undefined;
    if (autoRefresh) {
      refreshTimer = window.setInterval(() => {
        fetchNews(activeTab === 'headlines' ? 'general' : activeTab, true);
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (refreshTimer) window.clearInterval(refreshTimer);
    };
  }, [activeTab, autoRefresh, refreshInterval]);
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleManualRefresh = () => {
    fetchNews(activeTab === 'headlines' ? 'general' : activeTab, true);
  };
  
  const formatLastUpdated = (date: Date) => {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  const getBreakingNewsArticles = () => {
    return articles.filter(article => article.isBreaking).slice(0, 5);
  };
  
  const getTrendingNewsArticles = () => {
    return [...articles].sort((a, b) => b.trending - a.trending).slice(0, 5);
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
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Simple Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <div className="mb-4 md:mb-0">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white font-serif">
                  News
                </h1>
                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-2" />
                  Last Updated: {formatLastUpdated(lastUpdated)}
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Auto Refresh</span>
                  <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleManualRefresh}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
                
                {autoRefresh && (
                  <Select 
                    value={refreshInterval.toString()} 
                    onValueChange={(value) => setRefreshInterval(parseInt(value))}
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30s</SelectItem>
                      <SelectItem value="60">1m</SelectItem>
                      <SelectItem value="300">5m</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
            
            {/* News Categories */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full mb-8">
              <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                <TabsList className="bg-transparent h-auto p-0 space-x-0">
                  <TabsTrigger 
                    value="headlines" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none px-6 py-3 font-semibold"
                  >
                    Top Headlines
                  </TabsTrigger>
                  <TabsTrigger 
                    value="business" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none px-6 py-3 font-semibold"
                  >
                    Business
                  </TabsTrigger>
                  <TabsTrigger 
                    value="technology" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none px-6 py-3 font-semibold"
                  >
                    Technology
                  </TabsTrigger>
                  <TabsTrigger 
                    value="health" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none px-6 py-3 font-semibold"
                  >
                    Health
                  </TabsTrigger>
                  <TabsTrigger 
                    value="science" 
                    className="border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 rounded-none px-6 py-3 font-semibold"
                  >
                    Science
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={activeTab} className="mt-0">
                {loading ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      <div className="col-span-full lg:col-span-3">
                        <Skeleton className="h-96 w-full rounded-lg" />
                      </div>
                      <div className="col-span-full lg:col-span-1">
                        <Skeleton className="h-96 w-full rounded-lg" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 w-full rounded-lg" />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Main News Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Featured Story */}
                      <div className="col-span-full lg:col-span-3">
                        <NewsHero featuredNews={featuredNews} />
                      </div>
                      
                      {/* Breaking News Sidebar */}
                      <div className="col-span-full lg:col-span-1">
                        <BreakingNewsSection breakingNewsArticles={getBreakingNewsArticles()} />
                      </div>
                    </div>
                    
                    {/* Trending Section */}
                    <TrendingNewsSection trendingArticles={getTrendingNewsArticles()} />
                    
                    {/* Latest News Grid */}
                    <div>
                      <h2 className="text-2xl font-bold mb-6 font-serif border-l-4 border-blue-600 pl-4">
                        Latest News
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles
                          .filter(article => !article.isBreaking)
                          .slice(0, 9)
                          .map((article, index) => (
                            <Card key={article.id || index} className="overflow-hidden hover:shadow-lg transition-shadow group">
                              {article.isNew && (
                                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                                  NEW
                                </div>
                              )}
                              <div className="h-48 overflow-hidden">
                                <img 
                                  src={article.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bmV3c3xlbnwwfHwwfHx8MA%3D%3D'} 
                                  alt={article.title}
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                                  <span className="font-medium">{article.source}</span>
                                  <span>{article.time}</span>
                                </div>
                                <h3 className="font-bold text-lg line-clamp-2 mb-2 hover:text-blue-600 font-serif">
                                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    {article.title}
                                  </a>
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                  {article.description}
                                </p>
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-blue-600 font-semibold">{article.category}</span>
                                  <a 
                                    href={article.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline flex items-center"
                                  >
                                    Read More <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    {/* News Wire */}
                    <Card>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-4 font-serif flex items-center">
                          <Newspaper className="h-5 w-5 mr-2 text-blue-600" />
                          News Wire - Latest Headlines
                        </h3>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-20">Time</TableHead>
                              <TableHead>Headline</TableHead>
                              <TableHead className="w-32">Source</TableHead>
                              <TableHead className="w-24">Category</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {articles.slice(0, 15).map((article, index) => (
                              <TableRow key={article.id || index} className={article.isNew ? 'bg-green-50 dark:bg-green-900/20' : ''}>
                                <TableCell className="text-xs">
                                  <div className="flex items-center">
                                    {article.isNew && <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>}
                                    {article.time}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <a 
                                    href={article.url} 
                                    className="hover:text-blue-600 hover:underline font-medium"
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                  >
                                    {article.title}
                                  </a>
                                </TableCell>
                                <TableCell className="text-sm font-medium">{article.source}</TableCell>
                                <TableCell>
                                  <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                    {article.category}
                                  </span>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    {articles.length === 0 && (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">
                          No news articles available at this time.
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
