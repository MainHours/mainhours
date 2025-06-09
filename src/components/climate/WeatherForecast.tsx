
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CloudSun, Droplets, Wind, Thermometer } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WeatherForecast = () => {
  const { t } = useTranslation();
  const [location, setLocation] = React.useState("New York");
  const [forecastType, setForecastType] = React.useState("daily");
  const [loading, setLoading] = React.useState(false);
  const [dailyData, setDailyData] = React.useState([
    { day: 'Mon', temp: 21, humidity: 65, wind: 12, high: 24, low: 18, precipitation: 20 },
    { day: 'Tue', temp: 22, humidity: 62, wind: 14, high: 25, low: 19, precipitation: 10 },
    { day: 'Wed', temp: 20, humidity: 68, wind: 10, high: 23, low: 17, precipitation: 60 },
    { day: 'Thu', temp: 25, humidity: 55, wind: 8, high: 28, low: 22, precipitation: 5 },
    { day: 'Fri', temp: 23, humidity: 60, wind: 11, high: 26, low: 20, precipitation: 15 },
    { day: 'Sat', temp: 22, humidity: 63, wind: 13, high: 25, low: 19, precipitation: 30 },
    { day: 'Sun', temp: 24, humidity: 58, wind: 9, high: 27, low: 21, precipitation: 0 },
  ]);

  const [hourlyData, setHourlyData] = React.useState([
    { hour: '00:00', temp: 18, humidity: 70, wind: 8, precipitation: 0 },
    { hour: '03:00', temp: 17, humidity: 72, wind: 7, precipitation: 5 },
    { hour: '06:00', temp: 16, humidity: 75, wind: 6, precipitation: 10 },
    { hour: '09:00', temp: 19, humidity: 68, wind: 8, precipitation: 0 },
    { hour: '12:00', temp: 22, humidity: 60, wind: 10, precipitation: 0 },
    { hour: '15:00', temp: 24, humidity: 55, wind: 12, precipitation: 0 },
    { hour: '18:00', temp: 21, humidity: 62, wind: 10, precipitation: 20 },
    { hour: '21:00', temp: 19, humidity: 68, wind: 9, precipitation: 30 },
  ]);

  // Different locations for the demo
  const locations = [
    "New York",
    "London", 
    "Tokyo", 
    "Sydney",
    "Paris",
    "Berlin"
  ];

  // Chart configuration
  const chartConfig = {
    temperature: {
      label: "Temperature",
      theme: {
        light: "#f97316",
        dark: "#fb923c"
      }
    },
    humidity: {
      label: "Humidity",
      theme: {
        light: "#3b82f6",
        dark: "#60a5fa"
      }
    },
    wind: {
      label: "Wind",
      theme: {
        light: "#22c55e",
        dark: "#4ade80"
      }
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl flex items-center">
            <CloudSun className="h-6 w-6 mr-2" />
            {t('climate.forecast')}
          </CardTitle>
          
          <div className="flex space-x-2">
            <select 
              className="bg-background border rounded px-3 py-1 text-sm"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading}
            >
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            
            <Tabs value={forecastType} onValueChange={setForecastType} className="w-[200px]">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="daily">{t('climate.daily')}</TabsTrigger>
                <TabsTrigger value="hourly">{t('climate.hourly')}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin h-6 w-6 border-2 border-primary rounded-full border-t-transparent" />
          </div>
        )}
        
        {!loading && (
          <div className="space-y-6">
            {/* Temperature Chart */}
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={forecastType === 'daily' ? dailyData : hourlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey={forecastType === 'daily' ? 'day' : 'hour'} 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={false}
                      tickFormatter={(value) => `${value}°C`}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded p-3 shadow-lg">
                              <p className="font-medium mb-2">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded" 
                                    style={{ backgroundColor: entry.color }}
                                  />
                                  {entry.name}: {entry.value}
                                  {entry.dataKey === 'temp' ? '°C' : 
                                   entry.dataKey === 'humidity' ? '%' : 
                                   entry.dataKey === 'wind' ? ' km/h' : 
                                   entry.dataKey === 'precipitation' ? '%' : ''}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="temp"
                      stroke="#f97316"
                      strokeWidth={3}
                      dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    {forecastType === 'daily' && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="high"
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="low"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

            {/* Weather Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(forecastType === 'daily' ? dailyData : hourlyData).slice(0, 4).map((item, index) => (
                <Card key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <p className="font-medium text-blue-900 mb-1">
                      {forecastType === 'daily' ? item.day : item.hour}
                    </p>
                    <div className="text-3xl my-2">
                      {item.temp > 22 ? '☀️' : item.temp > 18 ? '⛅' : '☁️'}
                    </div>
                    <p className="text-xl font-bold text-blue-900 mb-2">{item.temp}°C</p>
                    {forecastType === 'daily' && 'high' in item && (
                      <p className="text-xs text-blue-700 mb-1">
                        H: {item.high}° L: {item.low}°
                      </p>
                    )}
                    <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
                      <div className="flex items-center justify-center">
                        <Droplets className="h-3 w-3 mr-1" />
                        {item.humidity}%
                      </div>
                      <div className="flex items-center justify-center">
                        <Wind className="h-3 w-3 mr-1" />
                        {item.wind}km/h
                      </div>
                      {'precipitation' in item && (
                        <div className="col-span-2 flex items-center justify-center mt-1">
                          <span className="text-blue-500">💧 {item.precipitation}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
