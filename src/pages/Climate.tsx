
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import CitySearch from '@/components/climate/CitySearch';
import CityWeatherCard from '@/components/climate/CityWeatherCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';
import WeatherWidget from '@/components/dashboard/WeatherWidget';
import WeatherForecast from '@/components/climate/WeatherForecast';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, CloudDrizzle, Eye, Gauge, Sun, Moon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface WeatherDetails {
  uvIndex: number;
  visibility: number;
  windGust: number;
  sunrise: string;
  sunset: string;
  moonPhase: string;
  airQuality: number;
}

const Climate = () => {
  const { t } = useTranslation();
  const [searchResults, setSearchResults] = useState<CityWeather[]>([]);
  const [activeTab, setActiveTab] = useState('current');
  const [currentLocation, setCurrentLocation] = useState<string>('New York');
  const [weatherDetails, setWeatherDetails] = useState<WeatherDetails>({
    uvIndex: 6,
    visibility: 10,
    windGust: 15,
    sunrise: '06:30',
    sunset: '19:45',
    moonPhase: 'Waxing Crescent',
    airQuality: 72
  });
  
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

  // Get air quality color and label
  const getAirQualityInfo = (aqi: number) => {
    if (aqi <= 50) return { color: 'bg-green-500', label: 'Good' };
    if (aqi <= 100) return { color: 'bg-yellow-500', label: 'Moderate' };
    if (aqi <= 150) return { color: 'bg-orange-500', label: 'Unhealthy for Sensitive' };
    if (aqi <= 200) return { color: 'bg-red-500', label: 'Unhealthy' };
    return { color: 'bg-purple-500', label: 'Very Unhealthy' };
  };

  const airQualityInfo = getAirQualityInfo(weatherDetails.airQuality);

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{t('climate.title')}</h1>
            <p className="text-muted-foreground">Comprehensive weather information and forecasts</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Powered by Tomorrow.io
          </Badge>
        </div>

        {/* Current Weather Widget */}
        <WeatherWidget />

        {/* Weather Details Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4 text-center">
              <Sun className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm text-orange-800 font-medium">UV Index</p>
              <p className="text-lg font-bold text-orange-900">{weatherDetails.uvIndex}</p>
              <p className="text-xs text-orange-700">High</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4 text-center">
              <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-blue-800 font-medium">Visibility</p>
              <p className="text-lg font-bold text-blue-900">{weatherDetails.visibility} km</p>
              <p className="text-xs text-blue-700">Excellent</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4 text-center">
              <Wind className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-green-800 font-medium">Wind Gust</p>
              <p className="text-lg font-bold text-green-900">{weatherDetails.windGust} km/h</p>
              <p className="text-xs text-green-700">Moderate</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4 text-center">
              <Sun className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm text-yellow-800 font-medium">Sunrise</p>
              <p className="text-lg font-bold text-yellow-900">{weatherDetails.sunrise}</p>
              <p className="text-xs text-yellow-700">AM</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-4 text-center">
              <Moon className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <p className="text-sm text-indigo-800 font-medium">Sunset</p>
              <p className="text-lg font-bold text-indigo-900">{weatherDetails.sunset}</p>
              <p className="text-xs text-indigo-700">PM</p>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200`}>
            <CardContent className="p-4 text-center">
              <Gauge className="h-6 w-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-gray-800 font-medium">Air Quality</p>
              <p className="text-lg font-bold text-gray-900">{weatherDetails.airQuality}</p>
              <div className="flex items-center justify-center mt-1">
                <div className={`w-2 h-2 rounded-full ${airQualityInfo.color} mr-1`}></div>
                <p className="text-xs text-gray-700">{airQualityInfo.label}</p>
              </div>
            </CardContent>
          </Card>
        </div>

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
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="current">{t('climate.majorCities')}</TabsTrigger>
            <TabsTrigger value="forecast">{t('climate.forecast')}</TabsTrigger>
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
        </Tabs>

        {/* Weather Alerts */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center">
              ⚠️ Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                  Heat Advisory
                </Badge>
                <div>
                  <p className="font-medium text-amber-900">High temperatures expected</p>
                  <p className="text-sm text-amber-700">Temperatures may reach 35°C+ today. Stay hydrated and avoid prolonged sun exposure.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Climate;
