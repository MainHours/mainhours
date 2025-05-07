
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

const Finance = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [activeTab, setActiveTab] = useState('all');

  const stockData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 181.42, change: 0.85, marketCap: '2.85T' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 416.78, change: -0.32, marketCap: '3.10T' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 164.25, change: 1.23, marketCap: '2.05T' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 179.62, change: -0.45, marketCap: '1.87T' },
    { symbol: 'META', name: 'Meta Platforms Inc.', price: 474.99, change: 2.15, marketCap: '1.21T' },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 176.75, change: -1.24, marketCap: '564.2B' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 881.86, change: 3.47, marketCap: '2.17T' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', price: 148.90, change: 0.21, marketCap: '358.1B' }
  ];
  
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
  
  const marketNews = [
    {
      title: "Fed Signals Potential Rate Cut",
      description: "Federal Reserve hints at possible interest rate reduction in upcoming meeting.",
      time: "2 hours ago"
    },
    {
      title: "Tech Sector Leads Market Rally",
      description: "Technology stocks drive market gains amid positive earnings reports.",
      time: "4 hours ago"
    },
    {
      title: "Oil Prices Stabilize After Recent Fluctuations",
      description: "Crude oil prices show signs of stability following weeks of volatility.",
      time: "5 hours ago"
    }
  ];

  const chartConfig = {
    AAPL: { label: "Apple", theme: { light: "#8884d8", dark: "#a78bfa" } },
    MSFT: { label: "Microsoft", theme: { light: "#82ca9d", dark: "#4ade80" } },
    GOOGL: { label: "Google", theme: { light: "#ffc658", dark: "#facc15" } },
  };

  // Function to handle stock search
  const handleSearch = (e) => {
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
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
      toast.success("Market data refreshed");
    }, 1000);
  };

  // Auto-update effect (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000); // Update every minute
    
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
                <h1 className="text-3xl font-bold">Finance</h1>
                <div className="flex items-center mt-1 text-sm text-muted-foreground">
                  <Badge className="mr-2 bg-blue-100 hover:bg-blue-200 text-blue-700 dark:bg-blue-900 dark:text-blue-100">MSN Money</Badge>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-full md:col-span-2 bg-white dark:bg-gray-800 shadow-sm border-0">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Market Overview</CardTitle>
                      <CardDescription>Year-to-date performance of top stocks</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200">YTD</Badge>
                      <Badge variant="outline" className="border-gray-200 bg-transparent hover:bg-gray-100">1D</Badge>
                      <Badge variant="outline" className="border-gray-200 bg-transparent hover:bg-gray-100">1M</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-80">
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
              
              <Card className="bg-white dark:bg-gray-800 shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ChartLine className="h-5 w-5 mr-2 text-blue-600" /> 
                    Market News
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketNews.map((news, index) => (
                      <div key={index} className={index < marketNews.length - 1 ? "border-b pb-4" : ""}>
                        <h3 className="font-medium hover:text-blue-600 cursor-pointer">{news.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{news.description}</p>
                        <p className="text-xs text-muted-foreground">{news.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="link" className="ml-auto px-0 text-blue-600">
                    More news
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card className="mb-8 bg-white dark:bg-gray-800 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <DollarSign className="h-5 w-5 mr-2 text-green-600" /> 
                  Stock Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="mb-4 bg-gray-100 dark:bg-gray-800">
                    <TabsTrigger value="all">All Stocks</TabsTrigger>
                    <TabsTrigger value="tech">Technology</TabsTrigger>
                    <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                    <TabsTrigger value="consumer">Consumer</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-0 p-0">
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
                          {filteredStocks.map((stock) => (
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
                          ))}
                          {filteredStocks.length === 0 && searchQuery && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                                No stocks found matching "{searchQuery}"
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tech" className="mt-0 p-0">
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
                          {stockData.slice(0, 5).map((stock) => (
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
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="healthcare" className="mt-0 p-0">
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
                          <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="font-medium">JNJ</TableCell>
                            <TableCell>Johnson & Johnson</TableCell>
                            <TableCell className="text-right">$148.90</TableCell>
                            <TableCell className="text-right text-green-600">
                              <div className="flex items-center justify-end">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +0.21%
                              </div>
                            </TableCell>
                            <TableCell className="text-right">358.1B</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="consumer" className="mt-0 p-0">
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium">Consumer Sector Data Coming Soon</h3>
                      <p className="text-muted-foreground">We're working on adding this data!</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Finance;
