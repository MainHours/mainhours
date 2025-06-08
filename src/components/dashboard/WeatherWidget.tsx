
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, CloudDrizzle, CloudSun } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the location type
interface Location {
  lat: number;
  lon: number;
}

// Define the current weather type
interface CurrentWeather {
  location: string;
  temperature: number;
  condition: string;
  high: number;
  low: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  icon: string;
  feelsLike: number;
  pressure: number;
}

// Define the forecast type
interface ForecastDay {
  day: string;
  temp: number;
  condition: string;
  icon: string;
}

const WeatherWidget = () => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather>({
    location: "Loading...",
    temperature: 0,
    condition: "Loading...",
    high: 0,
    low: 0,
    humidity: 0,
    windSpeed: 0,
    windDirection: "N",
    icon: "☁️",
    feelsLike: 0,
    pressure: 0
  });

  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
  ]);

  const [loading, setLoading] = useState(true);

  // Get user's location using browser geolocation
  const getUserLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude
            });
          },
          (error) => {
            console.error('Geolocation error:', error);
            // Default to New York if geolocation fails
            resolve({ lat: 40.7128, lon: -74.0060 });
          }
        );
      } else {
        console.log('Geolocation not supported');
        // Default to New York if geolocation not supported
        resolve({ lat: 40.7128, lon: -74.0060 });
      }
    });
  };

  // Get city name from coordinates using reverse geocoding
  const getCityName = async (lat: number, lon: number): Promise<string> => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
      const data = await response.json();
      return data.city || data.locality || 'Unknown Location';
    } catch (error) {
      console.error('Error getting city name:', error);
      return 'Unknown Location';
    }
  };

  // Fetch weather data from our Supabase edge function
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Get user location
        const { lat, lon } = await getUserLocation();
        
        // Get city name
        const cityName = await getCityName(lat, lon);
        
        console.log(`Fetching weather for ${cityName} at ${lat}, ${lon}`);
        
        // Call our weather API edge function
        const { data, error } = await supabase.functions.invoke('weather-api', {
          body: { lat, lon, location: cityName }
        });
        
        if (error) {
          console.error('Error fetching weather data:', error);
          toast.error('Failed to fetch weather data');
          setLoading(false);
          return;
        }
        
        if (data && data.current && data.forecast) {
          setCurrentWeather(data.current);
          setForecast(data.forecast);
          
          console.log('Weather data loaded successfully');
          toast.success(`Weather updated for ${data.current.location}`);
        } else {
          throw new Error('Invalid weather data received');
        }
        
        setLoading(false);
        
      } catch (error) {
        console.error('Error fetching weather data:', error);
        toast.error('Failed to fetch weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
    
    // Update weather data every 30 minutes
    const intervalId = setInterval(fetchWeatherData, 30 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <CloudSun className="h-5 w-5 mr-2" />
            Weather
          </CardTitle>
          <Badge>Tomorrow.io</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="text-5xl mr-4">{currentWeather.icon}</div>
                <div>
                  <p className="text-2xl font-bold">{currentWeather.temperature}°C</p>
                  <p>{currentWeather.condition}</p>
                  <p className="text-sm text-muted-foreground">{currentWeather.location}</p>
                </div>
              </div>
              <div className="text-sm">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <span className="text-muted-foreground flex items-center">
                    <Thermometer className="h-3 w-3 mr-1" /> High:
                  </span>
                  <span>{currentWeather.high}°C</span>
                  <span className="text-muted-foreground flex items-center">
                    <Thermometer className="h-3 w-3 mr-1" /> Low:
                  </span>
                  <span>{currentWeather.low}°C</span>
                  <span className="text-muted-foreground flex items-center">
                    <CloudDrizzle className="h-3 w-3 mr-1" /> Humidity:
                  </span>
                  <span>{currentWeather.humidity}%</span>
                  <span className="text-muted-foreground flex items-center">
                    <Wind className="h-3 w-3 mr-1" /> Wind:
                  </span>
                  <span>
                    {currentWeather.windSpeed} km/h {currentWeather.windDirection}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between">
                {forecast.map((day) => (
                  <div key={day.day} className="text-center">
                    <p className="font-medium">{day.day}</p>
                    <p className="my-1 text-xl">{day.icon}</p>
                    <p className="text-sm">{day.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
