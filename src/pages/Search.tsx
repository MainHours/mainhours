
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, Loader2, AlertCircle, ExternalLink, Clock, TrendingUp, Image, Play, BookOpen, ShoppingCart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import SearchResultCard from '@/components/search/SearchResultCard';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  type: string;
  source?: string;
  date?: string;
}

const Search = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchTime, setSearchTime] = useState(0);
  const [relatedQueries, setRelatedQueries] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [searchSource, setSearchSource] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Extract query from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [location.search]);

  // Generate search suggestions
  useEffect(() => {
    if (query.length > 2) {
      const mockSuggestions = [
        `${query} tutorial`,
        `${query} guide`,
        `${query} examples`,
        `${query} news`,
        `what is ${query}`,
        `${query} vs alternatives`
      ];
      setSuggestions(mockSuggestions.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query: searchQuery }
      });
      
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000);
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log('Search results:', data);
      setSearchResults(data.results || []);
      setRelatedQueries(data.relatedQueries || []);
      setSearchSource(data.source || 'unknown');
      
      if (data.source === 'fallback') {
        toast.info('Using backup search results. Real-time results may be limited.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
      setSearchResults([]);
      setRelatedQueries([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResultClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRelatedQueryClick = (relatedQuery: string) => {
    setQuery(relatedQuery);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(relatedQuery)}`);
    performSearch(relatedQuery);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(suggestion)}`);
    performSearch(suggestion);
  };

  const renderSearchResultSkeleton = () => {
    return (
      <div className="mb-6 p-4 border rounded-lg">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-11/12 mb-1" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    );
  };

  const filteredResults = activeTab === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeTab.toLowerCase());

  const trendingSearches = [
    'Artificial Intelligence',
    'Climate Change',
    'Cryptocurrency',
    'Space Exploration',
    'Renewable Energy',
    'Machine Learning'
  ];

  const searchCategories = [
    { id: 'web', label: 'Web', icon: SearchIcon },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'news', label: 'News', icon: BookOpen },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r bg-white/50 dark:bg-gray-800/50">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="mb-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg">
                  <SearchIcon className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  MainHours Search
                </h1>
                {searchSource === 'serpapi' && (
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Live Results
                  </Badge>
                )}
              </div>
              
              {/* Search Categories */}
              <div className="flex justify-center gap-4 mb-6">
                {searchCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeTab === category.id ? "default" : "ghost"}
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setActiveTab(category.id)}
                  >
                    <category.icon className="h-4 w-4" />
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Search Box */}
            <Card className="mb-8 shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="relative">
                  <div className="flex w-full items-center gap-2">
                    <div className="relative flex-grow">
                      <SearchIcon className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search anything on the web..."
                        className="pl-12 pr-4 h-14 text-lg border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      />
                      
                      {/* Search Suggestions */}
                      {showSuggestions && suggestions.length > 0 && (
                        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
                          <CardContent className="p-2">
                            {suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                className="w-full justify-start text-left h-auto p-3"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                <SearchIcon className="h-4 w-4 mr-3 text-muted-foreground" />
                                {suggestion}
                              </Button>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                    <Button type="submit" className="h-14 px-8 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Searching...
                        </>
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>
                </form>

                {/* Trending Searches */}
                {!hasSearched && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground font-medium">Trending searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((trend, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                          onClick={() => handleSuggestionClick(trend)}
                        >
                          {trend}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {isLoading ? (
              <div>
                <div className="mb-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid grid-cols-6 w-full md:w-auto">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="news">News</TabsTrigger>
                      <TabsTrigger value="video">Videos</TabsTrigger>
                      <TabsTrigger value="academic">Academic</TabsTrigger>
                      <TabsTrigger value="article">Articles</TabsTrigger>
                      <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="mb-4 text-sm text-muted-foreground flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching the web...
                </div>
                
                <div>
                  {[1, 2, 3, 4, 5].map((_, index) => renderSearchResultSkeleton())}
                </div>
              </div>
            ) : hasSearched ? (
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-3/4">
                  <div className="mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="grid grid-cols-6 w-full md:w-auto overflow-x-auto bg-white/50 dark:bg-gray-800/50">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="news">News</TabsTrigger>
                        <TabsTrigger value="video">Videos</TabsTrigger>
                        <TabsTrigger value="academic">Academic</TabsTrigger>
                        <TabsTrigger value="article">Articles</TabsTrigger>
                        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="mb-6 text-sm text-muted-foreground flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <Clock className="h-4 w-4" />
                    About <span className="font-bold">{filteredResults.length}</span> results ({searchTime.toFixed(2)} seconds)
                    {searchSource === 'fallback' && (
                      <div className="flex items-center gap-1 text-amber-600 ml-2">
                        <AlertCircle className="h-3 w-3" />
                        <span>Limited results</span>
                      </div>
                    )}
                  </div>
                  
                  {filteredResults.length > 0 ? (
                    <div className="space-y-4">
                      {filteredResults.map((result, index) => (
                        <SearchResultCard 
                          key={index}
                          result={result}
                          index={index}
                          onResultClick={handleResultClick}
                        />
                      ))}
                    </div>
                  ) : (
                    <Card className="bg-white/80 dark:bg-gray-800/80">
                      <CardHeader>
                        <CardTitle>No results found</CardTitle>
                        <CardDescription>
                          We couldn't find any {activeTab !== 'all' ? activeTab : ''} results for "{query}". Try a different search term.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
                
                <div className="lg:w-1/4">
                  {relatedQueries.length > 0 && (
                    <Card className="mb-6 bg-white/80 dark:bg-gray-800/80">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Related Searches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {relatedQueries.map((relatedQuery, index) => (
                            <li key={index}>
                              <Button 
                                variant="link" 
                                className="text-blue-600 dark:text-blue-400 p-0 h-auto font-normal text-left w-full justify-start hover:underline"
                                onClick={() => handleRelatedQueryClick(relatedQuery)}
                              >
                                {relatedQuery}
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card className="bg-white/80 dark:bg-gray-800/80">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Search Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span>Use quotes for exact phrases: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">"climate change"</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span>Exclude words with minus: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">climate -politics</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span>Search specific sites: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">site:bbc.com</code></span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                          <span>Find file types: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">report filetype:pdf</code></span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="bg-white/80 dark:bg-gray-800/80">
                <CardHeader>
                  <CardTitle className="text-2xl">Search the Web</CardTitle>
                  <CardDescription className="text-lg">
                    Discover information from across the internet with powerful search capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border rounded-xl p-6 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold">News & Articles</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Find the latest news articles and breaking stories from trusted sources worldwide</p>
                    </div>
                    <div className="border rounded-xl p-6 hover:bg-green-50 dark:hover:bg-green-900/20 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                          <Play className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold">Videos & Media</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Discover educational videos, tutorials, and multimedia content from various platforms</p>
                    </div>
                    <div className="border rounded-xl p-6 hover:bg-purple-50 dark:hover:bg-purple-900/20 cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-800 transition-colors">
                          <SearchIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h3 className="font-semibold">Academic Research</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Access scholarly articles, research papers, and academic publications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Search;
