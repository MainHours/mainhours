
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, LinkIcon, ThumbsUp, ThumbsDown, Bookmark, Share2 } from 'lucide-react';
import { format } from 'date-fns';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  type: string;
  source?: string;
  date?: string;
}

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
  onResultClick: (url: string) => void;
}

const SearchResultCard: React.FC<SearchResultCardProps> = ({ result, index, onResultClick }) => {
  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      news: 'bg-blue-500',
      article: 'bg-green-500',
      search: 'bg-gray-500',
      video: 'bg-red-500',
      forum: 'bg-yellow-500',
      social: 'bg-purple-500',
      code: 'bg-emerald-500',
      shopping: 'bg-pink-500',
      analysis: 'bg-indigo-500',
      opinion: 'bg-amber-500',
      explainer: 'bg-cyan-500',
      history: 'bg-lime-500',
      academic: 'bg-violet-500',
      knowledge: 'bg-orange-500',
    };
    
    return typeColors[type] || 'bg-gray-500';
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  return (
    <div key={index} className="mb-8 hover:bg-slate-50 dark:hover:bg-slate-800/50 p-4 rounded-lg transition-colors">
      <div className="flex items-start gap-3 mb-2">
        <div className="flex items-center gap-2">
          {result.source && (
            <div className="flex items-center gap-1">
              <img 
                src={getFaviconUrl(result.url)} 
                alt="" 
                className="w-4 h-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Avatar className="h-6 w-6">
                <div className={`h-6 w-6 flex items-center justify-center rounded-full ${getTypeColor(result.type)}`}>
                  <span className="text-white text-xs font-bold">{result.source[0]}</span>
                </div>
              </Avatar>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h3 
            className="text-xl font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer line-clamp-2" 
            onClick={() => onResultClick(result.url)}
          >
            {result.title}
          </h3>
          <div className="flex items-center text-sm text-green-700 dark:text-green-400 mb-1">
            <LinkIcon className="h-3 w-3 mr-1" />
            <span className="mr-2 max-w-[300px] truncate">{result.url}</span>
            {result.source && <span className="text-gray-600 dark:text-gray-400">· {result.source}</span>}
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 leading-relaxed line-clamp-3">
        {result.description}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
        {result.date && (
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{format(new Date(result.date), 'MMM d, yyyy')}</span>
          </div>
        )}
        <Badge variant="outline" className={`text-xs ${getTypeColor(result.type)} bg-opacity-10 border-none text-gray-700 dark:text-gray-300`}>
          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
        </Badge>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <ThumbsUp className="h-3 w-3 mr-1" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <ThumbsDown className="h-3 w-3 mr-1" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Bookmark className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-6 px-2">
            <Share2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultCard;
