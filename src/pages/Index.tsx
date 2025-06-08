
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
            {/* MainHours Header */}
            <div className="text-center py-8 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-lg text-white shadow-lg">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 font-serif">MainHours</h1>
              <p className="text-xl opacity-90 font-light">Your Premier News & Information Portal</p>
            </div>
            
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-200">
              <SearchBox />
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column - Featured News */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold font-serif flex items-center">
                      📰 Today's Top Headlines
                    </h2>
                  </div>
                  <div className="p-6 space-y-6">
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

                {/* News Categories Quick Access */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold font-serif">📊 News Categories</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">💼</div>
                        <div className="font-semibold text-red-700">Business</div>
                      </a>
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">💻</div>
                        <div className="font-semibold text-red-700">Technology</div>
                      </a>
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">🏥</div>
                        <div className="font-semibold text-red-700">Health</div>
                      </a>
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">🔬</div>
                        <div className="font-semibold text-red-700">Science</div>
                      </a>
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">🌍</div>
                        <div className="font-semibold text-red-700">World</div>
                      </a>
                      <a href="/news" className="p-4 border rounded-lg hover:bg-red-50 hover:border-red-200 transition-colors text-center">
                        <div className="text-2xl mb-2">⚖️</div>
                        <div className="font-semibold text-red-700">Politics</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Widgets */}
              <div className="space-y-6">
                
                {/* Weather Widget */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">🌤️ Weather</h2>
                  </div>
                  <div className="p-4">
                    <WeatherWidget />
                  </div>
                </div>

                {/* Stock Market */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">📈 Markets</h2>
                  </div>
                  <div className="p-4">
                    <StockWidget />
                  </div>
                </div>

                {/* News Sources */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-t-lg">
                    <h2 className="text-lg font-bold">📺 Trusted Sources</h2>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img src="/lovable-uploads/700af6d9-ee4a-44d6-827b-a76ffae80ed2.png" alt="NBC" className="h-8" />
                      <span className="font-medium">NBC News</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src="/lovable-uploads/d1f13521-e392-4bc7-abbc-b7e96474c2e0.png" alt="Reuters" className="h-8" />
                      <span className="font-medium">Reuters</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/BBC_Logo_2021.svg/1200px-BBC_Logo_2021.svg.png" alt="BBC" className="h-8" />
                      <span className="font-medium">BBC News</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/CNN.svg/1200px-CNN.svg.png" alt="CNN" className="h-8" />
                      <span className="font-medium">CNN</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Call-to-Action */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-6 text-center shadow-lg">
              <h3 className="text-2xl font-bold mb-2 font-serif">Stay Informed</h3>
              <p className="mb-4 font-light">Get the latest breaking news and in-depth coverage from trusted sources</p>
              <a 
                href="/news" 
                className="inline-block bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Full News Coverage
              </a>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
