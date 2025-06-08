
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WeatherRequest {
  lat: number;
  lon: number;
  location?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lon, location } = await req.json() as WeatherRequest;
    const tomorrowApiKey = Deno.env.get('TOMORROW_IO_API_KEY');

    if (!tomorrowApiKey) {
      console.error('Tomorrow.io API key not configured');
      return new Response(
        JSON.stringify({ error: 'Weather API not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Fetching weather for coordinates: ${lat}, ${lon}`);

    // Fetch current weather and 5-day forecast from Tomorrow.io
    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(`https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,temperatureApparent,humidity,windSpeed,windDirection,pressureSeaLevel,weatherCode&timesteps=current&units=metric&apikey=${tomorrowApiKey}`),
      fetch(`https://api.tomorrow.io/v4/timelines?location=${lat},${lon}&fields=temperature,temperatureMin,temperatureMax,humidity,windSpeed,weatherCode&timesteps=1d&units=metric&apikey=${tomorrowApiKey}`)
    ]);

    if (!currentResponse.ok || !forecastResponse.ok) {
      console.error('Tomorrow.io API error:', currentResponse.status, forecastResponse.status);
      throw new Error('Failed to fetch weather data');
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    console.log('Weather data fetched successfully');

    // Helper function to get weather icon from weather code
    const getWeatherIcon = (weatherCode: number): string => {
      if (weatherCode >= 1000 && weatherCode <= 1100) return '☀️'; // Clear
      if (weatherCode >= 1101 && weatherCode <= 1102) return '⛅'; // Partly cloudy
      if (weatherCode >= 1001 && weatherCode <= 1001) return '☁️'; // Cloudy
      if (weatherCode >= 4000 && weatherCode <= 4001) return '🌧️'; // Rain
      if (weatherCode >= 5000 && weatherCode <= 5001) return '❄️'; // Snow
      if (weatherCode >= 8000 && weatherCode <= 8000) return '⛈️'; // Thunderstorm
      if (weatherCode >= 2000 && weatherCode <= 2100) return '🌫️'; // Fog
      return '☁️'; // Default
    };

    // Helper function to get weather condition text
    const getWeatherCondition = (weatherCode: number): string => {
      if (weatherCode >= 1000 && weatherCode <= 1100) return 'Clear';
      if (weatherCode >= 1101 && weatherCode <= 1102) return 'Partly Cloudy';
      if (weatherCode >= 1001 && weatherCode <= 1001) return 'Cloudy';
      if (weatherCode >= 4000 && weatherCode <= 4001) return 'Rain';
      if (weatherCode >= 5000 && weatherCode <= 5001) return 'Snow';
      if (weatherCode >= 8000 && weatherCode <= 8000) return 'Thunderstorm';
      if (weatherCode >= 2000 && weatherCode <= 2100) return 'Fog';
      return 'Unknown';
    };

    // Helper function to get wind direction
    const getWindDirection = (degrees: number): string => {
      const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
      return directions[Math.round(degrees / 45) % 8];
    };

    // Process current weather
    const current = currentData.data.timelines[0].intervals[0].values;
    const currentWeather = {
      location: location || 'Current Location',
      temperature: Math.round(current.temperature),
      condition: getWeatherCondition(current.weatherCode),
      high: Math.round(current.temperature + 2), // Estimate high
      low: Math.round(current.temperature - 3), // Estimate low
      humidity: Math.round(current.humidity),
      windSpeed: Math.round(current.windSpeed * 3.6), // Convert m/s to km/h
      windDirection: getWindDirection(current.windDirection),
      icon: getWeatherIcon(current.weatherCode),
      feelsLike: Math.round(current.temperatureApparent),
      pressure: Math.round(current.pressureSeaLevel)
    };

    // Process 5-day forecast
    const forecast = forecastData.data.timelines[0].intervals.slice(1, 6).map((interval: any, index: number) => {
      const date = new Date();
      date.setDate(date.getDate() + index + 1);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      return {
        day,
        temp: Math.round(interval.values.temperature),
        condition: getWeatherCondition(interval.values.weatherCode),
        icon: getWeatherIcon(interval.values.weatherCode),
        high: Math.round(interval.values.temperatureMax || interval.values.temperature + 2),
        low: Math.round(interval.values.temperatureMin || interval.values.temperature - 3)
      };
    });

    return new Response(
      JSON.stringify({
        current: currentWeather,
        forecast: forecast
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in weather-api function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch weather data' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
