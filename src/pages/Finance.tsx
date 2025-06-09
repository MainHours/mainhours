import React, { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart, Search, ChartLine, DollarSign, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import MarketSummary from '@/components/finance/MarketSummary';
import MarketMovers from '@/components/finance/MarketMovers';
import SectorPerformance from '@/components/finance/SectorPerformance';
import MarketStats from '@/components/finance/MarketStats';
import Watchlist from '@/components/finance/Watchlist';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  marketCap: string;
}

interface NewsItem {
  title: string;
  description: string;
  time: string;
  url?: string;
}

const Finance = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [stockData, setStockData] = useState<Stock[]>([]);
  const [marketNews, setMarketNews] = useState<NewsItem[]>([]);

  // Chart data (keeping mock data for now as historical data requires additional API calls)
  const chartData = [
    { name: 'Jan', AAPL: 143.5, MSFT: 312.4, GOOGL: 143.7 },
    { name: 'Feb', AAPL: 150.8, MSFT: 325.2, GOOGL: 148.2 },
    { name: 'Mar', AAPL: 157.2, MSFT: 335.6, GOOGL: 151.1 },
    { name: 'Apr', AAPL: 165.4, MSFT: 341.8, GOOGL: 153.7 },
    { name: 'May', AAPL: 172.6, MSFT: 356.2, GOOGL: 155.2 },
    { name: 'Jun', AAPL: 168.3, MSFT: 348.7, GOOGL: 149.8 },
    { name: 'Jul', AAPL: 174.1, MSFT: 365.3, GOOGL: 154.3 },
    { name: 'Aug', AAPL: 178.2, MSFT: 378.5, GOOGL: 158.6 },
    { name: 'Sep', AAPL: 171.5, MSFT: 385.1, GOOGL: 160.1 },
    { name: 'Oct', AAPL: 179.8, MSFT: 407.3, GOOGL: 163.5 },
    { name: 'Nov', AAPL: 183.7, MSFT: 414.5, GOOGL: 167.2 },
    { name: 'Dec', AAPL: 181.4, MSFT: 416.8, GOOGL: 164.3 }
  ];

  const chartConfig = {
    AAPL: { label: "Apple", theme: { light: "#8884d8", dark: "#a78bfa" } },
    MSFT: { label: "Microsoft", theme: { light: "#82ca9d", dark: "#4ade80" } },
    GOOGL: { label: "Google", theme: { light: "#ffc658", dark: "#facc15" } },
  };

  // Fetch stock data from Finnhub API
  const fetchStockData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching stock data from Finnhub API...');
      
      const { data, error } = await supabase.functions.invoke('stock-api', {
        body: {
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JNJ'],
          includeNews: true
        }
      });

      if (error) {
        console.error('Error fetching stock data:', error);
        toast.error('Failed to fetch stock data');
        return;
      }

      if (data) {
        console.log('Stock data received:', data);
        setStockData(data.stocks || []);
        setMarketNews(data.news || []);
        setLastUpdated(new Date());
        toast.success('Market data updated');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast.error('Failed to fetch stock data');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle stock search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      setIsLoading(true);
      
      // Simulate API call with timeout
      setTimeout(() => {
        setIsLoading(false);
        toast.success(`Stock data for "${searchQuery}" loaded`);
      }, 1000);
    }
  };

  // Function to refresh data
  const refreshData = () => {
    fetchStockData();
  };

  // Load initial data
  useEffect(() => {
    fetchStockData();
  }, []);

  // Auto-update effect
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData();
    }, 300000); // Update every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const filteredStocks = stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Finance Dashboard</h1>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Badge className="mr-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-100">Finnhub</Badge>
                  <span className="flex items-center">
                    <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1" 
                      onClick={refreshData}
                      disabled={isLoading}
                    >
                      <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="mt-4 md:mt-0 flex">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search stocks..."
                    className="pl-8 pr-4 w-full md:w-[200px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="ml-2" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Search'}
                </Button>
              </form>
            </div>

            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="overview">Market Overview</TabsTrigger>
                <TabsTrigger value="stocks">Stocks</TabsTrigger>
                <TabsTrigger value="charts">Charts</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Market Summary */}
                <MarketSummary />

                {/* Market Stats and Watchlist */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MarketStats />
                  <Watchlist />
                </div>

                {/* Market Movers and Sector Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MarketMovers />
                  <SectorPerformance />
                </div>

                {/* Market News */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <ChartLine className="h-5 w-5 mr-2 text-blue-600" /> 
                      Latest Market News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {marketNews.length > 0 ? (
                        marketNews.slice(0, 6).map((news, index) => (
                          <div key={index} className="border-b pb-4 last:border-b-0">
                            <h3 className="font-medium hover:text-blue-600 cursor-pointer mb-2">
                              {news.url ? (
                                <a href={news.url} target="_blank" rel="noopener noreferrer">
                                  {news.title}
                                </a>
                              ) : (
                                news.title
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">{news.description}</p>
                            <p className="text-xs text-muted-foreground">{news.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 text-center py-4">
                          <p className="text-muted-foreground">Loading market news...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="stocks" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <DollarSign className="h-5 w-5 mr-2 text-green-600" /> 
                      Stock Market
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-gray-50 dark:bg-gray-900">
                          <TableRow>
                            <TableHead className="w-[100px]">Symbol</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                            <TableHead className="text-right">Market Cap</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredStocks.length > 0 ? (
                            filteredStocks.map((stock) => (
                              <TableRow key={stock.symbol} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                <TableCell className="font-medium">{stock.symbol}</TableCell>
                                <TableCell>{stock.name}</TableCell>
                                <TableCell className="text-right">${stock.price.toFixed(2)}</TableCell>
                                <TableCell className={`text-right ${
                                  stock.change > 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <div className="flex items-center justify-end">
                                    {stock.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">{stock.marketCap}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4">
                                {isLoading ? (
                                  <div className="flex items-center justify-center">
                                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                                    Loading stock data...
                                  </div>
                                ) : searchQuery ? (
                                  <span className="text-muted-foreground">
                                    No stocks found matching "{searchQuery}"
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    No stock data available
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="charts" className="space-y-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Market Performance</CardTitle>
                        <CardDescription>Year-to-date performance of top stocks</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">YTD</Badge>
                        <Badge variant="outline" className="border-gray-200 bg-transparent hover:bg-gray-100">1D</Badge>
                        <Badge variant="outline" className="border-gray-200 bg-transparent hover:bg-gray-100">1M</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="h-96">
                    <ChartContainer config={chartConfig} className="h-full">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.4} />
                        <XAxis
                          dataKey="name"
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "var(--border)" }}
                        />
                        <YAxis
                          fontSize={12}
                          tickLine={false}
                          axisLine={{ stroke: "var(--border)" }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="AAPL"
                          strokeWidth={2}
                          stroke="var(--color-AAPL)"
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="MSFT"
                          strokeWidth={2}
                          stroke="var(--color-MSFT)"
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="GOOGL"
                          strokeWidth={2}
                          stroke="var(--color-GOOGL)"
                          dot={false}
                          activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-lg">
                      <ChartLine className="h-5 w-5 mr-2 text-blue-600" /> 
                      Financial News
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {marketNews.length > 0 ? (
                        marketNews.map((news, index) => (
                          <div key={index} className="border-b pb-6 last:border-b-0">
                            <h2 className="text-xl font-semibold hover:text-blue-600 cursor-pointer mb-3">
                              {news.url ? (
                                <a href={news.url} target="_blank" rel="noopener noreferrer">
                                  {news.title}
                                </a>
                              ) : (
                                news.title
                              )}
                            </h2>
                            <p className="text-muted-foreground mb-2">{news.description}</p>
                            <p className="text-sm text-muted-foreground">{news.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">Loading financial news...</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="link" className="ml-auto px-0 text-blue-600">
                      View all news
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Finance;
