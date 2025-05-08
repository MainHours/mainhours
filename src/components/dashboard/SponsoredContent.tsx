
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

const SponsoredContent = () => {
  const sponsoredItems = [
    {
      title: "Ultimate Guide to Smart Home Technology",
      imageUrl: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      advertiser: "TechSmart",
      url: "https://example.com/sponsored1"
    },
    {
      title: "10 Travel Destinations You Must Visit This Year",
      imageUrl: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      advertiser: "TravelMore",
      url: "https://example.com/sponsored2"
    },
    {
      title: "Financial Freedom: Start Investing Today",
      imageUrl: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      advertiser: "InvestWise",
      url: "https://example.com/sponsored3"
    }
  ];
  
  return (
    <Card className="border border-dashed border-mainhours-purple/30 bg-muted/30">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-sm font-medium text-muted-foreground">Sponsored Content</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sponsoredItems.map((item, index) => (
            <a 
              key={index} 
              href={item.url} 
              target="_blank" 
              rel="noopener sponsored" 
              className="group"
            >
              <div className="relative overflow-hidden rounded-md">
                <div className="aspect-w-16 aspect-h-9 h-40">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title} 
                    className="object-cover w-full h-full rounded-md group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  Ad
                </div>
              </div>
              <h3 className="mt-2 font-medium text-sm group-hover:text-mainhours-purple flex items-center">
                {item.title}
                <ExternalLink className="h-3 w-3 ml-1 opacity-60" />
              </h3>
              <p className="text-xs text-muted-foreground">
                By {item.advertiser}
              </p>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsoredContent;
