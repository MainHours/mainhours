
import React from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, LinkIcon, ThumbsUp, ThumbsDown, Bookmark, Share2, ExternalLink } from 'lucide-react';
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
      news: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      article: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      search: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700',
      video: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      forum: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      social: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
      code: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
      shopping: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
      analysis: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
      opinion: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
      explainer: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
      history: 'bg-lime-50 text-lime-700 border-lime-200 dark:bg-lime-900/20 dark:text-lime-300 dark:border-lime-800',
      academic: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
      knowledge: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    };
    
    return typeColors[type] || 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'news': return '📰';
      case 'video': return '🎥';
      case 'academic': return '🎓';
      case 'knowledge': return '📚';
      case 'article': return '📝';
      case 'social': return '💬';
      case 'shopping': return '🛒';
      default: return '🔍';
    }
  };

  const getFaviconUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;
    } catch {
      return null;
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm hover:shadow-md transition-all duration-200 p-6 group">
      {/* Header with source info and type */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img 
              src={getFaviconUrl(result.url)} 
              alt="" 
              className="w-4 h-4"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {result.source || getDomainFromUrl(result.url)}
            </span>
          </div>
          {result.date && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 mr-1" />
              <span>{format(new Date(result.date), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>
        <Badge className={`text-xs ${getTypeColor(result.type)} border`}>
          <span className="mr-1">{getTypeIcon(result.type)}</span>
          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
        </Badge>
      </div>
      
      {/* Title */}
      <h3 
        className="text-xl font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer mb-2 line-clamp-2 group-hover:underline transition-colors" 
        onClick={() => onResultClick(result.url)}
      >
        {result.title}
      </h3>
      
      {/* URL */}
      <div className="flex items-center text-sm text-green-700 dark:text-green-400 mb-3">
        <LinkIcon className="h-3 w-3 mr-1" />
        <span className="truncate max-w-md">{result.url}</span>
        <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3 mb-4">
        {result.description}
      </p>
      
      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
          <ThumbsUp className="h-3 w-3 mr-1" />
          Helpful
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
          <Bookmark className="h-3 w-3 mr-1" />
          Save
        </Button>
        <Button variant="ghost" size="sm" className="h-8 px-3 text-xs">
          <Share2 className="h-3 w-3 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default SearchResultCard;
