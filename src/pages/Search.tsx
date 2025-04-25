
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const isMobile = useIsMobile();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log('Searching for:', query);
      setHasSearched(true);
    }
  };

  const searchResults = [
    {
      title: "Understanding the Modern Web Development Ecosystem",
      url: "https://example.com/web-development",
      description: "A comprehensive guide to modern web development practices, tools, and frameworks.",
      type: "article"
    },
    {
      title: "The Future of Artificial Intelligence",
      url: "https://example.com/ai-future",
      description: "Experts discuss the potential impact of AI on society and technology in the coming decades.",
      type: "article" 
    },
    {
      title: "MainHours: The All-in-One Platform",
      url: "https://mainhours.com",
      description: "MainHours combines social networking, AI, search, news, finance, and more in one place.",
      type: "website"
    },
    {
      title: "Climate Change: Latest Research and Findings",
      url: "https://example.com/climate-research",
      description: "Recent studies on climate change and its effects on our planet's ecosystems.",
      type: "research"
    },
    {
      title: "Getting Started with React and TypeScript",
      url: "https://example.com/react-typescript",
      description: "A beginner's guide to building applications with React and TypeScript.",
      type: "tutorial"
    }
  ];
  
  const renderSearchResult = (result: typeof searchResults[0], index: number) => {
    return (
      <div key={index} className="mb-6">
        <h3 className="text-lg font-medium hover:underline">
          <a href={result.url} target="_blank" rel="noopener noreferrer">
            {result.title}
          </a>
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
                  <Button type="submit" className="h-12 px-6">Search</Button>
                </form>
              </CardContent>
            </Card>
            
            {hasSearched ? (
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
