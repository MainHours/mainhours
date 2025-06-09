
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Mover {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketMovers = () => {
  const gainers: Mover[] = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 875.42, change: 45.67, changePercent: 5.51 },
    { symbol: 'META', name: 'Meta Platforms', price: 512.34, change: 23.45, changePercent: 4.79 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 245.67, change: 12.34, changePercent: 5.29 },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: 156.78, change: 8.90, changePercent: 6.02 },
    { symbol: 'GOOGL', name: 'Alphabet Inc', price: 167.89, change: 7.65, changePercent: 4.77 }
  ];

  const losers: Mover[] = [
    { symbol: 'INTC', name: 'Intel Corp', price: 43.21, change: -3.45, changePercent: -7.39 },
    { symbol: 'PYPL', name: 'PayPal Holdings', price: 67.89, change: -4.56, changePercent: -6.30 },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 456.78, change: -23.45, changePercent: -4.88 },
    { symbol: 'UBER', name: 'Uber Technologies', price: 65.43, change: -2.87, changePercent: -4.20 },
    { symbol: 'SNAP', name: 'Snap Inc', price: 12.34, change: -0.67, changePercent: -5.15 }
  ];

  const MoversList = ({ movers }: { movers: Mover[] }) => (
    <div className="space-y-2">
      {movers.map((mover) => (
        <div key={mover.symbol} className="flex items-center justify-between py-2 border-b border-border/50 last:border-b-0">
          <div>
            <div className="font-medium">{mover.symbol}</div>
            <div className="text-sm text-muted-foreground truncate">{mover.name}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">${mover.price.toFixed(2)}</div>
            <div className={`text-sm flex items-center ${
              mover.change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {mover.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {mover.change > 0 ? '+' : ''}{mover.changePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Movers</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gainers" className="text-green-600">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers" className="text-red-600">Top Losers</TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-4">
            <MoversList movers={gainers} />
          </TabsContent>
          <TabsContent value="losers" className="mt-4">
            <MoversList movers={losers} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MarketMovers;
