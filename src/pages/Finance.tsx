
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Finance = () => {
  const isMobile = useIsMobile();
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Finance</h1>
              <div className="mt-2 md:mt-0 flex items-center">
                <Badge className="mr-2">MSN Money</Badge>
                <p className="text-sm text-muted-foreground">Last updated: April 25, 2025, 2:30 PM</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="col-span-full md:col-span-2">
                <CardHeader>
                  <CardTitle>Market Overview</CardTitle>
                  <CardDescription>Year-to-date performance of top stocks</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="AAPL" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="MSFT" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="GOOGL" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Market News</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketNews.map((news, index) => (
                      <div key={index} className={index < marketNews.length - 1 ? "border-b pb-4" : ""}>
                        <h3 className="font-medium">{news.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{news.description}</p>
                        <p className="text-xs text-muted-foreground">{news.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" /> 
                  Stock Market
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">All Stocks</TabsTrigger>
                    <TabsTrigger value="tech">Technology</TabsTrigger>
                    <TabsTrigger value="healthcare">Healthcare</TabsTrigger>
                    <TabsTrigger value="consumer">Consumer</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="all" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-muted-foreground">Symbol</th>
                            <th className="text-left py-2 font-medium text-muted-foreground">Company</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Price</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Market Cap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.map((stock) => (
                            <tr key={stock.symbol} className="border-b">
                              <td className="py-2 font-medium">{stock.symbol}</td>
                              <td className="py-2 text-sm">{stock.name}</td>
                              <td className="py-2 text-right">${stock.price.toFixed(2)}</td>
                              <td className={`py-2 text-right ${
                                stock.change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                <div className="flex items-center justify-end">
                                  {stock.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                </div>
                              </td>
                              <td className="py-2 text-right">{stock.marketCap}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="tech" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-muted-foreground">Symbol</th>
                            <th className="text-left py-2 font-medium text-muted-foreground">Company</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Price</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Market Cap</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.slice(0, 5).map((stock) => (
                            <tr key={stock.symbol} className="border-b">
                              <td className="py-2 font-medium">{stock.symbol}</td>
                              <td className="py-2 text-sm">{stock.name}</td>
                              <td className="py-2 text-right">${stock.price.toFixed(2)}</td>
                              <td className={`py-2 text-right ${
                                stock.change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                <div className="flex items-center justify-end">
                                  {stock.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                                  {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                </div>
                              </td>
                              <td className="py-2 text-right">{stock.marketCap}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="healthcare" className="mt-4">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium text-muted-foreground">Symbol</th>
                            <th className="text-left py-2 font-medium text-muted-foreground">Company</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Price</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Change</th>
                            <th className="text-right py-2 font-medium text-muted-foreground">Market Cap</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">JNJ</td>
                            <td className="py-2 text-sm">Johnson & Johnson</td>
                            <td className="py-2 text-right">$148.90</td>
                            <td className="py-2 text-right text-green-600">
                              <div className="flex items-center justify-end">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +0.21%
                              </div>
                            </td>
                            <td className="py-2 text-right">358.1B</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="consumer" className="mt-4">
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
