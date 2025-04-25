
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StockItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const StockItem = ({ symbol, name, price, change }: StockItemProps) => {
  const isPositive = change > 0;
  
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium">{symbol}</p>
        <p className="text-sm text-muted-foreground">{name}</p>
      </div>
      <div className="text-right">
        <p className="font-medium">${price.toFixed(2)}</p>
        <p className={`text-sm flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

const StockWidget = () => {
  const stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 181.42, change: 0.85 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 416.78, change: -0.32 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 164.25, change: 1.23 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 179.62, change: -0.45 }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <BarChart className="h-5 w-5 mr-2" /> 
            Market Watch
          </CardTitle>
          <Badge>MSN Money</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {stocks.map((stock) => (
            <StockItem key={stock.symbol} {...stock} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Adding this mock component to fix the missing import error
const BarChart = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

export default StockWidget;
