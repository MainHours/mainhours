
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import SearchBox from '@/components/dashboard/SearchBox';
import NewsCard from '@/components/dashboard/NewsCard';
import StockWidget from '@/components/dashboard/StockWidget';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import { useIsMobile } from '@/hooks/use-mobile';
import { useTranslation } from '@/hooks/useTranslation';

const Index = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="flex-1 flex">
        {!isMobile && (
          <div className="hidden md:block w-64 border-r bg-white">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <SearchBox />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Featured News */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Top Stories</h2>
                  </div>
                  <div className="p-4 space-y-4">
                    <NewsCard
                      title="Breaking: Major Breakthrough in Renewable Energy Technology"
                      description="Scientists have developed revolutionary solar panel technology that can generate electricity during nighttime hours, marking a significant advancement in renewable energy solutions."
                      source="Reuters"
                      category="Technology"
                      imageUrl="https://images.unsplash.com/photo-1509390144018-eeaf65052242?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c29sYXIlMjBwYW5lbHxlbnwwfHwwfHx8MA%3D%3D"
                      time="2 hours ago"
                      isBreaking={true}
                    />
                    <NewsCard
                      title="Global Climate Summit Reaches Historic Agreement"
                      description="World leaders have reached a consensus on ambitious new climate initiatives during the annual Climate Summit, setting unprecedented targets for carbon reduction."
                      source="BBC News"
                      category="Environment"
                      imageUrl="https://images.unsplash.com/photo-1624638760852-62a4efacabfc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2xpbWF0ZSUyMGNoYW5nZXxlbnwwfHwwfHx8MA%3D%3D"
                      time="4 hours ago"
                    />
                    <NewsCard
                      title="Stock Markets Surge Following Economic Data Release"
                      description="Major indices posted significant gains after the release of positive employment figures and economic growth indicators across global markets."
                      source="Financial Times"
                      category="Business"
                      imageUrl="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D"
                      time="6 hours ago"
                    />
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Access</h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <a href="/news" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">📰</div>
                        <div className="font-medium text-gray-700">News</div>
                      </a>
                      <a href="/finance" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">💼</div>
                        <div className="font-medium text-gray-700">Finance</div>
                      </a>
                      <a href="/climate" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">🌤️</div>
                        <div className="font-medium text-gray-700">Weather</div>
                      </a>
                      <a href="/ai" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">🤖</div>
                        <div className="font-medium text-gray-700">AI</div>
                      </a>
                      <a href="/search" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">🔍</div>
                        <div className="font-medium text-gray-700">Search</div>
                      </a>
                      <a href="/trends" className="p-3 border rounded hover:bg-gray-50 transition-colors text-center text-sm">
                        <div className="text-lg mb-1">📈</div>
                        <div className="font-medium text-gray-700">Trends</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Widgets */}
              <div className="space-y-6">
                
                {/* Weather Widget */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Weather</h2>
                  </div>
                  <div className="p-4">
                    <WeatherWidget />
                  </div>
                </div>

                {/* Stock Market */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Markets</h2>
                  </div>
                  <div className="p-4">
                    <StockWidget />
                  </div>
                </div>

                {/* Trending Topics */}
                <div className="bg-white rounded-lg shadow-sm border">
                  <div className="border-b px-4 py-3">
                    <h2 className="text-lg font-semibold text-gray-900">Trending</h2>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-sm">
                      <a href="#" className="text-blue-600 hover:underline">Climate Change Solutions</a>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-blue-600 hover:underline">Tech Innovation</a>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-blue-600 hover:underline">Global Economy</a>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-blue-600 hover:underline">Health Advances</a>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-blue-600 hover:underline">Space Exploration</a>
                    </div>
                  </div>
                </div>

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
