import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import SearchResultCard from '@/components/search/SearchResultCard';

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
  
  // Extract query from URL on page load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q');
    if (queryParam) {
      setQuery(queryParam);
      performSearch(queryParam);
    }
  }, [location.search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Update the URL to reflect the search
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      performSearch(query.trim());
    }
  };

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      const startTime = performance.now();
      
      // Call the enhanced search function with SerpAPI
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query: searchQuery }
      });
      
      const endTime = performance.now();
      setSearchTime((endTime - startTime) / 1000); // Convert to seconds
      
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
    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRelatedQueryClick = (relatedQuery: string) => {
    setQuery(relatedQuery);
    navigate(`/search?q=${encodeURIComponent(relatedQuery)}`);
    performSearch(relatedQuery);
  };

  const renderSearchResultSkeleton = () => {
    return (
      <div className="mb-6">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-1" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-11/12 mb-1" />
      </div>
    );
  };

  const filteredResults = activeTab === 'all' 
    ? searchResults 
    : searchResults.filter(result => result.type === activeTab.toLowerCase());

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
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-2">
              <div className="bg-blue-500 text-white p-2 rounded-lg">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">MainHours Search</h1>
              {searchSource === 'serpapi' && (
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <ExternalLink className="h-4 w-4" />
                  <span>Live Results</span>
                </div>
              )}
            </div>
            
            <Card className="mb-8 shadow-md">
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search the web..."
                      className="pl-10 pr-4 h-12 text-lg"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="h-12 px-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      'Search'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            {isLoading ? (
              <div>
                <div className="mb-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="news">News</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="academic">Academic</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="mb-4 text-sm text-muted-foreground">
                  Searching...
                </div>
                
                <div>
                  {[1, 2, 3, 4, 5].map((_, index) => renderSearchResultSkeleton())}
                </div>
              </div>
            ) : hasSearched ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-3/4">
                  <div className="mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <TabsList className="w-full md:w-auto overflow-x-auto">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="news">News</TabsTrigger>
                        <TabsTrigger value="video">Videos</TabsTrigger>
                        <TabsTrigger value="academic">Academic</TabsTrigger>
                        <TabsTrigger value="article">Articles</TabsTrigger>
                        <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  
                  <div className="mb-6 text-sm text-muted-foreground flex items-center gap-1">
                    About <span className="font-bold">{filteredResults.length}</span> results ({searchTime.toFixed(2)} seconds)
                    {searchSource === 'fallback' && (
                      <div className="flex items-center gap-1 text-amber-600 ml-2">
                        <AlertCircle className="h-3 w-3" />
                        <span>Limited results</span>
                      </div>
                    )}
                  </div>
                  
                  {filteredResults.length > 0 ? (
                    <div>
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
                    <Card>
                      <CardHeader>
                        <CardTitle>No results found</CardTitle>
                        <CardDescription>
                          We couldn't find any {activeTab !== 'all' ? activeTab : ''} results for "{query}". Try a different search term.
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  )}
                </div>
                
                <div className="md:w-1/4">
                  {relatedQueries.length > 0 && (
                    <Card className="mb-6">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Related Searches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {relatedQueries.map((relatedQuery, index) => (
                            <li key={index}>
                              <Button 
                                variant="link" 
                                className="text-blue-600 dark:text-blue-400 p-0 h-auto font-normal text-left w-full justify-start"
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
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Search Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground list-disc pl-4">
                        <li>Use quotes for exact phrases: "climate change"</li>
                        <li>Add - to exclude words: climate -politics</li>
                        <li>Use site: to search specific websites: site:bbc.com</li>
                        <li>Add filetype: for specific files: report filetype:pdf</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Search Anything</CardTitle>
                  <CardDescription>
                    Enter your query and discover information from across the web
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">News Search</h3>
                      <p className="text-sm text-muted-foreground">Find the latest news articles and updates</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">Academic Search</h3>
                      <p className="text-sm text-muted-foreground">Find scholarly articles and research papers</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">Video Search</h3>
                      <p className="text-sm text-muted-foreground">Find videos from various sources</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">Opinion & Analysis</h3>
                      <p className="text-sm text-muted-foreground">Find expert opinions and analysis</p>
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
