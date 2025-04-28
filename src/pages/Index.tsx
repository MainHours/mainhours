
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import FeaturedPost from '@/components/dashboard/FeaturedPost';
import AIAssistant from '@/components/dashboard/AIAssistant';
import SearchBox from '@/components/dashboard/SearchBox';
import NewsCard from '@/components/dashboard/NewsCard';
import StockWidget from '@/components/dashboard/StockWidget';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import SportsUpdate from '@/components/dashboard/SportsUpdate';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();

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
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome to MainHours</h1>
            <p className="text-muted-foreground">
              Your all-in-one platform for social networking, news, finance, and more.
            </p>
            
            {/* First row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-full md:col-span-1 lg:col-span-1">
                <SearchBox />
              </div>
              <div className="col-span-full md:col-span-1 lg:col-span-1 h-[200px] md:h-auto">
                <WeatherWidget />
              </div>
              <div className="col-span-full md:col-span-1 lg:col-span-1 h-[200px] md:h-auto">
                <TrendingTopics />
              </div>
            </div>
            
            {/* Second row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-full md:col-span-1 h-[500px] md:h-auto">
                <FeaturedPost
                  username="alex_morgan"
                  avatarUrl="https://i.pravatar.cc/150?img=1"
                  imageUrl="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D"
                  caption="Beautiful day exploring the city! #cityscape #adventure"
                  likes={524}
                  comments={32}
                  timeAgo="2 hours ago"
                />
              </div>
              <div className="col-span-full md:col-span-1">
                <NewsCard
                  title="Major Breakthrough in Renewable Energy Technology"
                  description="Scientists have developed a new solar panel that can generate electricity at night, a major advancement in renewable energy technology."
                  source="CNN"
                  category="Technology"
                  imageUrl="https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D"
                  time="3 hours ago"
                />
                <div className="h-4"></div>
                <NewsCard
                  title="Global Leaders Agree on New Climate Initiatives"
                  description="World leaders have reached a consensus on ambitious new climate initiatives during the annual Climate Summit held in Geneva."
                  source="CNN"
                  category="Politics"
                  imageUrl="https://images.unsplash.com/photo-1624638760852-62a4efacabfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D"
                  time="5 hours ago"
                />
              </div>
              <div className="col-span-full md:col-span-1">
                <div className="grid gap-6">
                  <StockWidget />
                  <SportsUpdate />
                </div>
              </div>
            </div>
            
            {/* Third row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="col-span-full md:col-span-3 h-[400px] md:h-[350px]">
                <AIAssistant />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
