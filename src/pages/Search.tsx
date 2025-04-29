
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon, Loader2 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  type: string;
}

const Search = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  
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
      // Here we're using mock data, but in a real app you would connect to a search API
      console.log('Searching for:', searchQuery);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock search results based on query
      const mockResults: SearchResult[] = [
        {
          title: `Results for "${searchQuery}" - Main article`,
          url: `https://example.com/search/${encodeURIComponent(searchQuery)}`,
          description: `A comprehensive guide about ${searchQuery} with detailed information and resources.`,
          type: "article"
        },
        {
          title: `${searchQuery} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${encodeURIComponent(searchQuery)}`,
          description: `Wikipedia article about ${searchQuery} with facts, history and references.`,
          type: "article" 
        },
        {
          title: `Latest News about ${searchQuery}`,
          url: `https://news.example.com/topics/${encodeURIComponent(searchQuery)}`,
          description: `Breaking news and recent updates about ${searchQuery} from reliable sources.`,
          type: "news"
        },
        {
          title: `${searchQuery} Research Papers`,
          url: `https://academic.example.com/research/${encodeURIComponent(searchQuery)}`,
          description: `Academic papers and scientific research related to ${searchQuery}.`,
          type: "research"
        },
        {
          title: `Learn about ${searchQuery} - Tutorial`,
          url: `https://learn.example.com/${encodeURIComponent(searchQuery)}`,
          description: `Step-by-step tutorial and learning resources about ${searchQuery} for beginners to advanced users.`,
          type: "tutorial"
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to perform search. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResultClick = (url: string) => {
    // Open the URL in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  const renderSearchResult = (result: SearchResult, index: number) => {
    return (
      <div key={index} className="mb-6 cursor-pointer" onClick={() => handleResultClick(result.url)}>
        <h3 className="text-lg font-medium text-blue-600 hover:underline">
          {result.title}
        </h3>
        <p className="text-sm text-green-700 mb-1">{result.url}</p>
        <p className="text-sm text-gray-600">{result.description}</p>
      </div>
    );
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
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Search</h1>
            
            <Card className="mb-8">
              <CardContent className="pt-6">
                <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
                  <div className="relative flex-grow">
                    <SearchIcon className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
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
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : hasSearched ? (
              <div>
                <div className="mb-6">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="images">Images</TabsTrigger>
                      <TabsTrigger value="videos">Videos</TabsTrigger>
                      <TabsTrigger value="news">News</TabsTrigger>
                      <TabsTrigger value="maps">Maps</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="mb-4 text-sm text-muted-foreground">
                  About {searchResults.length} results (0.25 seconds)
                </div>
                
                <div>
                  {searchResults.map((result, index) => renderSearchResult(result, index))}
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
                      <h3 className="font-medium mb-1">Web Search</h3>
                      <p className="text-sm text-muted-foreground">Search for information, articles, and websites</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">Image Search</h3>
                      <p className="text-sm text-muted-foreground">Find images from around the web</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">News Search</h3>
                      <p className="text-sm text-muted-foreground">Discover the latest news articles</p>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-muted cursor-pointer">
                      <h3 className="font-medium mb-1">Academic Search</h3>
                      <p className="text-sm text-muted-foreground">Find scholarly articles and research papers</p>
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
