
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const WeatherWidget = () => {
  // Mock weather data
  const currentWeather = {
    location: "New York, NY",
    temperature: 72,
    condition: "Partly Cloudy",
    high: 75,
    low: 65,
    humidity: 45,
    windSpeed: 8,
    windDirection: "NE",
  };

  const forecast = [
    { day: "Mon", temp: 72, condition: "Partly Cloudy", icon: "☁️" },
    { day: "Tue", temp: 68, condition: "Rain", icon: "🌧️" },
    { day: "Wed", temp: 75, condition: "Sunny", icon: "☀️" },
    { day: "Thu", temp: 77, condition: "Sunny", icon: "☀️" },
    { day: "Fri", temp: 76, condition: "Partly Cloudy", icon: "⛅" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Weather className="h-5 w-5 mr-2" />
            Weather
          </CardTitle>
          <Badge>Meteum AI</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-5xl mr-4">☁️</div>
            <div>
              <p className="text-2xl font-bold">{currentWeather.temperature}°F</p>
              <p>{currentWeather.condition}</p>
              <p className="text-sm text-muted-foreground">{currentWeather.location}</p>
            </div>
          </div>
          <div className="text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <span className="text-muted-foreground">High:</span>
              <span>{currentWeather.high}°F</span>
              <span className="text-muted-foreground">Low:</span>
              <span>{currentWeather.low}°F</span>
              <span className="text-muted-foreground">Humidity:</span>
              <span>{currentWeather.humidity}%</span>
              <span className="text-muted-foreground">Wind:</span>
              <span>
                {currentWeather.windSpeed} mph {currentWeather.windDirection}
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
                <p className="text-sm">{day.temp}°</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Adding this mock component to fix the missing import error
const Weather = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
  </svg>
);

export default WeatherWidget;
