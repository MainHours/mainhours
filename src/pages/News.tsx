
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewsCard from '@/components/dashboard/NewsCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const News = () => {
  const isMobile = useIsMobile();
  
  const featuredNews = {
    title: "Major Breakthrough in Renewable Energy Technology",
    description: "Scientists have developed a new solar panel that can generate electricity at night, potentially solving one of the biggest challenges in renewable energy adoption. This groundbreaking innovation could revolutionize how we power our homes and reduce dependency on fossil fuels.",
    source: "CNN",
    category: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D",
    time: "3 hours ago"
  };
  
  const topNews = [
    {
      title: "Global Leaders Agree on New Climate Initiatives",
      description: "World leaders have reached a consensus on ambitious new climate initiatives during the annual Climate Summit held in Geneva.",
      source: "CNN",
      category: "Politics",
      imageUrl: "https://images.unsplash.com/photo-1624638760852-62a4efacabfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D",
      time: "5 hours ago"
    },
    {
      title: "Tech Company Announces Revolutionary AR Glasses",
      description: "A leading tech company has unveiled its next-generation augmented reality glasses, promising to change how we interact with digital content.",
      source: "CNN",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1478416272538-5f7e51dc5400?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXVnbWVudGVkJTIwcmVhbGl0eXxlbnwwfHwwfHx8MA%3D%3D",
      time: "7 hours ago"
    },
    {
      title: "Economic Growth Exceeds Expectations in Third Quarter",
      description: "The economy grew faster than expected in the third quarter, defying predictions of a slowdown amidst global challenges.",
      source: "CNN",
      category: "Business",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
      time: "9 hours ago"
    },
    {
      title: "Major Sports Championship Ends in Spectacular Fashion",
      description: "The championship game concluded with a surprising upset victory that has sports analysts buzzing about what this means for next season.",
      source: "CNN",
      category: "Sports",
      imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BvcnRzfGVufDB8fDB8fHww",
      time: "10 hours ago"
    }
  ];
  
  const healthNews = [
    {
      title: "New Study Reveals Benefits of Intermittent Fasting",
      description: "Research indicates that intermittent fasting may have significant health benefits beyond weight loss, including improved metabolic health.",
      source: "CNN",
      category: "Health",
      imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aGVhbHRoeSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      time: "6 hours ago"
    },
    {
      title: "Breakthrough in Alzheimer's Treatment Shows Promise",
      description: "A new experimental drug has shown promising results in early clinical trials, potentially offering hope for Alzheimer's patients.",
      source: "CNN",
      category: "Health",
      imageUrl: "https://images.unsplash.com/photo-1576671414121-aa2aee8569cc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaWNhbHxlbnwwfHwwfHx8MA%3D%3D",
      time: "12 hours ago"
    }
  ];
  
  const techNews = [
    {
      title: "AI System Outperforms Doctors in Diagnosing Rare Conditions",
      description: "A new artificial intelligence system has demonstrated superior accuracy in diagnosing rare medical conditions compared to experienced physicians.",
      source: "CNN",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
      time: "4 hours ago"
    },
    {
      title: "Quantum Computing Milestone Achieved by Research Team",
      description: "Scientists have reached a significant milestone in quantum computing, bringing us closer to practical applications of this revolutionary technology.",
      source: "CNN",
      category: "Technology",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVhbnR1bSUyMGNvbXB1dGluZ3xlbnwwfHwwfHx8MA%3D%3D",
      time: "8 hours ago"
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
            <h1 className="text-3xl font-bold mb-8">News Portal</h1>
            
            <Tabs defaultValue="top" className="w-full mb-8">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="top">Top Stories</TabsTrigger>
                  <TabsTrigger value="technology">Technology</TabsTrigger>
                  <TabsTrigger value="health">Health</TabsTrigger>
                  <TabsTrigger value="business">Business</TabsTrigger>
                  <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="top" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-full md:col-span-2">
                    <Card className="overflow-hidden">
                      <div className="relative h-80">
                        <img 
                          src={featuredNews.imageUrl} 
                          alt={featuredNews.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <span className="bg-mainhours-red text-white px-3 py-1 rounded-full text-xs font-medium">
                              {featuredNews.category}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              {featuredNews.source}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {featuredNews.time}
                          </span>
                        </div>
                        <CardTitle className="text-2xl">{featuredNews.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{featuredNews.description}</p>
                        <div className="mt-4">
                          <a href="#" className="text-mainhours-purple hover:underline">
                            Read full article
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="col-span-full md:col-span-1 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Latest Updates</CardTitle>
                        <CardDescription>Breaking news</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {topNews.slice(0, 2).map((news, index) => (
                          <div key={index} className="border-b pb-4">
                            <p className="text-sm text-muted-foreground mb-1">{news.time}</p>
                            <h3 className="font-medium hover:text-mainhours-purple">
                              <a href="#">{news.title}</a>
                            </h3>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mt-8 mb-6">More Top Stories</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topNews.map((news, index) => (
                    <div key={index}>
                      <NewsCard {...news} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="technology" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {techNews.map((news, index) => (
                    <div key={index}>
                      <NewsCard {...news} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="health" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {healthNews.map((news, index) => (
                    <div key={index}>
                      <NewsCard {...news} />
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="business" className="mt-0">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">Business News Coming Soon</h3>
                  <p className="text-muted-foreground">We're working on this section!</p>
                </div>
              </TabsContent>
              
              <TabsContent value="entertainment" className="mt-0">
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium">Entertainment News Coming Soon</h3>
                  <p className="text-muted-foreground">We're working on this section!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default News;
