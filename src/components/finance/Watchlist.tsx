
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Star } from 'lucide-react';

interface WatchlistItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([
    { symbol: 'AAPL', name: 'Apple Inc', price: 189.25, change: 2.45, changePercent: 1.31 },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: 412.84, change: -1.23, changePercent: -0.30 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 167.89, change: 3.45, changePercent: 2.10 }
  ]);
  const [newSymbol, setNewSymbol] = useState('');

  const addToWatchlist = () => {
    if (newSymbol.trim()) {
      // In a real app, you'd fetch the stock data here
      const newItem: WatchlistItem = {
        symbol: newSymbol.toUpperCase(),
        name: `${newSymbol.toUpperCase()} Corp`,
        price: Math.random() * 200 + 50,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5
      };
      setWatchlist([...watchlist, newItem]);
      setNewSymbol('');
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== symbol));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Star className="h-4 w-4 mr-2" />
            My Watchlist
          </CardTitle>
          <Badge variant="outline">{watchlist.length} stocks</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Enter symbol (e.g., TSLA)"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addToWatchlist()}
          />
          <Button onClick={addToWatchlist} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {watchlist.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between p-2 border rounded-lg">
              <div>
                <div className="font-medium">{item.symbol}</div>
                <div className="text-xs text-muted-foreground">{item.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.price.toFixed(2)}</div>
                <div className={`text-xs ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change > 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeFromWatchlist(item.symbol)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Watchlist;
