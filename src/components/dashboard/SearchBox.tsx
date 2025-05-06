
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, BarChart2, Book, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      try {
        console.log('Searching for:', query);
        // Redirect to search page with the query
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const trendingSearches = [
    'Climate Change',
    'AI Technology',
    'Renewable Energy',
    'Global Economy'
  ];

  const handleTrendingClick = (trend: string) => {
    navigate(`/search?q=${encodeURIComponent(trend)}`);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Search className="h-5 w-5" />
          MainHours Search
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex w-full items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search the web..."
              className="pl-8 pr-4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </Button>
        </form>

        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <BarChart2 className="h-4 w-4" />
            <span>Trending searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {trendingSearches.map((trend, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-secondary"
                onClick={() => handleTrendingClick(trend)}
              >
                {trend}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Newspaper className="h-4 w-4" />
          <span>News</span>
        </div>
        <div className="flex items-center gap-2">
          <Book className="h-4 w-4" />
          <span>Academic</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SearchBox;
