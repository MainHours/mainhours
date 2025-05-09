
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { NewsSource } from '@/types/news';

interface NewsSourcesGridProps {
  sources: NewsSource[];
  selectedSourceId: string | null;
  onSourceSelect: (sourceId: string | null) => void;
}

const NewsSourcesGrid = ({ sources, selectedSourceId, onSourceSelect }: NewsSourcesGridProps) => {
  // Update the sources array with the new NBC logo if it exists
  const updatedSources = sources.map(source => {
    if (source.id === 'nbc') {
      return {
        ...source,
        logo: '/lovable-uploads/700af6d9-ee4a-44d6-827b-a76ffae80ed2.png'
      };
    }
    return source;
  });

  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 py-4">
          <div 
            className={`shrink-0 cursor-pointer flex flex-col items-center justify-center w-24 h-16 rounded-md border-2 ${!selectedSourceId ? 'border-mainhours-purple bg-mainhours-purple/10' : 'border-gray-200 hover:border-mainhours-purple/50 dark:border-gray-700'}`}
            onClick={() => onSourceSelect(null)}
          >
            <span className="text-sm font-medium">All Sources</span>
          </div>

          {updatedSources.map((source) => (
            <div 
              key={source.id}
              className={`shrink-0 cursor-pointer flex items-center justify-center w-24 h-16 rounded-md border-2 ${selectedSourceId === source.id ? 'border-mainhours-purple bg-mainhours-purple/10' : 'border-gray-200 hover:border-mainhours-purple/50 dark:border-gray-700'}`}
              onClick={() => onSourceSelect(source.id)}
            >
              <img 
                src={source.logo} 
                alt={source.name} 
                className="max-h-10 max-w-16 object-contain" 
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default NewsSourcesGrid;
