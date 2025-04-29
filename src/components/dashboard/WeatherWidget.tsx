
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Thermometer, Wind, CloudDrizzle, CloudSun } from 'lucide-react';
import { toast } from 'sonner';

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
    icon: "☁️"
  });

  const [forecast, setForecast] = useState<ForecastDay[]>([
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
    { day: "...", temp: 0, condition: "Loading", icon: "..." },
  ]);

  const [loading, setLoading] = useState(true);

  // Helper function to get weather icon
  const getWeatherIcon = (condition: string): string => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) return '🌧️';
    if (conditionLower.includes('cloud')) return '☁️';
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return '☀️';
    if (conditionLower.includes('snow')) return '❄️';
    if (conditionLower.includes('storm') || conditionLower.includes('thunder')) return '⛈️';
    if (conditionLower.includes('fog') || conditionLower.includes('mist')) return '🌫️';
    if (conditionLower.includes('partly')) return '⛅';
    return '☁️';
  };

  // Get day of the week
  const getDayOfWeek = (dateString: string | Date): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

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

  // Fetch weather data
  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        // Get user location
        const { lat, lon } = await getUserLocation();
        
        // Get city name
        const cityName = await getCityName(lat, lon);
        
        // For demo purposes, we'll use a mock API response since we don't have an actual Meteum API key
        // In a real implementation, you would replace this with an actual API call
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get current date
        const today = new Date();
        const currentTemp = Math.round(15 + Math.random() * 10); // Random temp between 15-25°C
        const highTemp = currentTemp + Math.round(Math.random() * 5);
        const lowTemp = currentTemp - Math.round(Math.random() * 5);
        
        // Set current weather
        const currentCondition = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)];
        setCurrentWeather({
          location: cityName,
          temperature: currentTemp,
          condition: currentCondition,
          high: highTemp,
          low: lowTemp,
          humidity: Math.round(40 + Math.random() * 40), // Random humidity between 40-80%
          windSpeed: Math.round(5 + Math.random() * 15), // Random wind speed between 5-20 km/h
          windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
          icon: getWeatherIcon(currentCondition)
        });
        
        // Set forecast for next 5 days
        const forecastData: ForecastDay[] = [];
        for (let i = 0; i < 5; i++) {
          const forecastDate = new Date(today);
          forecastDate.setDate(today.getDate() + i + 1);
          
          const condition = ["Clear", "Partly Cloudy", "Cloudy", "Light Rain"][Math.floor(Math.random() * 4)];
          forecastData.push({
            day: getDayOfWeek(forecastDate),
            temp: Math.round(10 + Math.random() * 15), // Random temp between 10-25°C
            condition: condition,
            icon: getWeatherIcon(condition)
          });
        }
        setForecast(forecastData);
        
        setLoading(false);
        
        toast.success(`Weather updated for ${cityName}`);
        
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
          <Badge>Meteum</Badge>
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
