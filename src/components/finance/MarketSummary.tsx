
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketIndex {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePercent: number;
}

const MarketSummary = () => {
  // Mock data for major indices
  const marketIndices: MarketIndex[] = [
    { symbol: 'SPY', name: 'S&P 500', value: 4785.23, change: 23.45, changePercent: 0.49 },
    { symbol: 'QQQ', name: 'NASDAQ', value: 16789.45, change: -45.67, changePercent: -0.27 },
    { symbol: 'DIA', name: 'Dow Jones', value: 37689.54, change: 156.78, changePercent: 0.42 },
    { symbol: 'IWM', name: 'Russell 2000', value: 2087.65, change: -12.34, changePercent: -0.59 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketIndices.map((index) => (
            <div key={index.symbol} className="text-center">
              <div className="font-medium text-sm text-muted-foreground">{index.name}</div>
              <div className="font-bold text-lg">{index.value.toFixed(2)}</div>
              <div className={`text-sm flex items-center justify-center ${
                index.change > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {index.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent > 0 ? '+' : ''}{index.changePercent.toFixed(2)}%)
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSummary;
