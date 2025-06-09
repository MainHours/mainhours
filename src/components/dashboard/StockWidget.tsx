
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StockItemProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
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
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching stock data for widget...');
      
      const { data, error } = await supabase.functions.invoke('stock-api', {
        body: {
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN'],
          includeNews: false
        }
      });

      if (error) {
        console.error('Error fetching stock data:', error);
        return;
      }

      if (data?.stocks) {
        console.log('Stock widget data received:', data.stocks);
        setStocks(data.stocks.slice(0, 4)); // Show only top 4 stocks
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchStockData, 300000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <BarChart className="h-5 w-5 mr-2" /> 
            Market Watch
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge>Finnhub</Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={fetchStockData}
              disabled={isLoading}
            >
              <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-1 divide-y">
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <StockItem key={stock.symbol} {...stock} />
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">
                {isLoading ? 'Loading stock data...' : 'No stock data available'}
              </p>
            </div>
          )}
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
