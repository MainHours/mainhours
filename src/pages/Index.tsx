
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import AIAssistant from '@/components/dashboard/AIAssistant';
import SearchBox from '@/components/dashboard/SearchBox';
import NewsCard from '@/components/dashboard/NewsCard';
import StockWidget from '@/components/dashboard/StockWidget';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import SportsUpdate from '@/components/dashboard/SportsUpdate';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r bg-white/80">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* AOL-style Header */}
            <div className="text-center py-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-lg text-white shadow-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome to MainHours</h1>
              <p className="text-xl opacity-90">Your Gateway to Everything Online</p>
            </div>
            
            {/* Search Bar - Prominent like AOL */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-blue-200">
              <SearchBox />
            </div>
            
            {/* Main Content Grid - AOL Portal Style */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - News & Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">📰 Today's Headlines</h2>
                  </div>
                  <div className="p-4 space-y-4">
                    <NewsCard
                      title="Major Breakthrough in Renewable Energy Technology"
                      description="Scientists have developed a new solar panel that can generate electricity at night, a major advancement in renewable energy technology."
                      source="CNN"
                      category="Technology"
                      imageUrl="https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D"
                      time="3 hours ago"
                    />
                    <NewsCard
                      title="Global Leaders Agree on New Climate Initiatives"
                      description="World leaders have reached a consensus on ambitious new climate initiatives during the annual Climate Summit held in Geneva."
                      source="Reuters"
                      category="Politics"
                      imageUrl="https://images.unsplash.com/photo-1624638760852-62a4efacabfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D"
                      time="5 hours ago"
                    />
                  </div>
                </div>

                {/* AI Assistant Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">🤖 AI Assistant</h2>
                  </div>
                  <div className="p-4 h-[350px]">
                    <AIAssistant />
                  </div>
                </div>
              </div>
              
              {/* Right Column - Widgets & Quick Info */}
              <div className="space-y-6">
                
                {/* Weather Widget */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">🌤️ Weather</h2>
                  </div>
                  <div className="p-4">
                    <WeatherWidget />
                  </div>
                </div>

                {/* Stock Market */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">📈 Markets</h2>
                  </div>
                  <div className="p-4">
                    <StockWidget />
                  </div>
                </div>

                {/* Sports */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">🏈 Sports</h2>
                  </div>
                  <div className="p-4">
                    <SportsUpdate />
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-4 py-2 rounded-t-lg">
                    <h2 className="text-lg font-bold">🔥 Trending</h2>
                  </div>
                  <div className="p-4">
                    <TrendingTopics />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Banner - AOL Style */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Explore More</h3>
              <p className="mb-4">Discover news, entertainment, sports, and much more!</p>
              <div className="flex justify-center space-x-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded">News</span>
                <span className="bg-white/20 px-3 py-1 rounded">Sports</span>
                <span className="bg-white/20 px-3 py-1 rounded">Weather</span>
                <span className="bg-white/20 px-3 py-1 rounded">Finance</span>
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
