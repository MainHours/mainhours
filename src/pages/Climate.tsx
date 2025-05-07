
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import CitySearch from '@/components/climate/CitySearch';
import CityWeatherCard from '@/components/climate/CityWeatherCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import WeatherForecast from '@/components/climate/WeatherForecast';
import WeatherMap from '@/components/climate/WeatherMap';

// Define the city weather data type
export interface CityWeather {
  id: string;
  name: string;
  country: string;
  temperature: number;
  condition: string;
  pressure: number;
  feelsLike: number;
  humidity: number;
  icon: string;
}

const Climate = () => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<CityWeather[]>([]);
  const [activeTab, setActiveTab] = useState('current');
  
  // Main cities with their weather data (simulated)
  const mainCities: CityWeather[] = [
    {
      id: '1',
      name: 'New York',
      country: 'USA',
      temperature: 22,
      condition: 'Partly Cloudy',
      pressure: 1012,
      feelsLike: 24,
      humidity: 65,
      icon: '⛅'
    },
    {
      id: '2',
      name: 'London',
      country: 'UK',
      temperature: 16,
      condition: 'Rainy',
      pressure: 1008,
      feelsLike: 15,
      humidity: 80,
      icon: '🌧️'
    },
    {
      id: '3',
      name: 'Tokyo',
      country: 'Japan',
      temperature: 28,
      condition: 'Sunny',
      pressure: 1010,
      feelsLike: 30,
      humidity: 55,
      icon: '☀️'
    },
    {
      id: '4',
      name: 'Sydney',
      country: 'Australia',
      temperature: 25,
      condition: 'Clear',
      pressure: 1015,
      feelsLike: 26,
      humidity: 60,
      icon: '☀️'
    },
    {
      id: '5',
      name: 'Paris',
      country: 'France',
      temperature: 19,
      condition: 'Cloudy',
      pressure: 1013,
      feelsLike: 18,
      humidity: 70,
      icon: '☁️'
    },
    {
      id: '6',
      name: 'Dubai',
      country: 'UAE',
      temperature: 36,
      condition: 'Hot',
      pressure: 1009,
      feelsLike: 39,
      humidity: 45,
      icon: '🔥'
    }
  ];

  // Handle search results
  const handleSearchResults = (results: CityWeather[]) => {
    setSearchResults(results);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold">{t('climate.title')}</h1>
        
        <WeatherWidget />

        <CitySearch onSearchResults={handleSearchResults} />
        
        {searchResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{t('climate.searchResults')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((city) => (
                <CityWeatherCard key={city.id} city={city} />
              ))}
            </div>
          </div>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="current">{t('climate.majorCities')}</TabsTrigger>
            <TabsTrigger value="forecast">{t('climate.forecast')}</TabsTrigger>
            <TabsTrigger value="map">{t('climate.map')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{t('climate.majorCities')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mainCities.map((city) => (
                    <CityWeatherCard key={city.id} city={city} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="forecast">
            <WeatherForecast />
          </TabsContent>
          
          <TabsContent value="map">
            <WeatherMap />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Climate;
