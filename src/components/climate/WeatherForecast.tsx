
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from '@/hooks/useTranslation';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { CloudSun, Droplets, Wind } from 'lucide-react';

const WeatherForecast = () => {
  const { t } = useTranslation();
  const [location, setLocation] = React.useState("New York");
  const [forecastType, setForecastType] = React.useState("daily");

  // Mock forecast data
  const dailyData = [
    { day: 'Mon', temp: 21, humidity: 65, wind: 12 },
    { day: 'Tue', temp: 22, humidity: 62, wind: 14 },
    { day: 'Wed', temp: 20, humidity: 68, wind: 10 },
    { day: 'Thu', temp: 25, humidity: 55, wind: 8 },
    { day: 'Fri', temp: 23, humidity: 60, wind: 11 },
    { day: 'Sat', temp: 22, humidity: 63, wind: 13 },
    { day: 'Sun', temp: 24, humidity: 58, wind: 9 },
  ];

  const hourlyData = [
    { hour: '00:00', temp: 18, humidity: 70, wind: 8 },
    { hour: '03:00', temp: 17, humidity: 72, wind: 7 },
    { hour: '06:00', temp: 16, humidity: 75, wind: 6 },
    { hour: '09:00', temp: 19, humidity: 68, wind: 8 },
    { hour: '12:00', temp: 22, humidity: 60, wind: 10 },
    { hour: '15:00', temp: 24, humidity: 55, wind: 12 },
    { hour: '18:00', temp: 21, humidity: 62, wind: 10 },
    { hour: '21:00', temp: 19, humidity: 68, wind: 9 },
  ];

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
        <div className="space-y-6">
          <div className="h-[300px]">
            <ChartContainer
              config={chartConfig}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={forecastType === 'daily' ? dailyData : hourlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey={forecastType === 'daily' ? 'day' : 'hour'} 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis 
                    yAxisId="temp"
                    domain={[10, 30]}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}°C`}
                  />
                  <YAxis 
                    yAxisId="humidity"
                    orientation="right"
                    domain={[0, 100]}
                    hide
                  />
                  <YAxis 
                    yAxisId="wind"
                    orientation="right"
                    domain={[0, 20]}
                    hide
                  />
                  <ChartTooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border rounded p-3">
                            <p className="font-medium mb-1">{label}</p>
                            <p className="text-sm flex items-center gap-1 mb-1">
                              <Thermometer className="h-4 w-4 text-orange-500" />
                              {t('climate.temperature')}: {payload[0].value}°C
                            </p>
                            <p className="text-sm flex items-center gap-1 mb-1">
                              <Droplets className="h-4 w-4 text-blue-500" />
                              {t('climate.humidity')}: {payload[1].value}%
                            </p>
                            <p className="text-sm flex items-center gap-1">
                              <Wind className="h-4 w-4 text-green-500" />
                              {t('climate.wind')}: {payload[2].value} km/h
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name="Temperature"
                    fill="url(#colorTemp)"
                    stroke="var(--color-temperature)"
                    yAxisId="temp"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity"
                    fill="url(#colorHumidity)"
                    stroke="var(--color-humidity)"
                    yAxisId="humidity"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="wind"
                    name="Wind"
                    fill="url(#colorWind)"
                    stroke="var(--color-wind)"
                    yAxisId="wind"
                    fillOpacity={0.3}
                  />
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(forecastType === 'daily' ? dailyData : hourlyData).slice(0, 4).map((item, index) => (
              <Card key={index} className="bg-background/50">
                <CardContent className="p-4 text-center">
                  <p className="font-medium">{forecastType === 'daily' ? item.day : item.hour}</p>
                  <div className="text-2xl my-1">
                    {item.temp > 22 ? '☀️' : item.temp > 18 ? '⛅' : '☁️'}
                  </div>
                  <p className="text-lg font-semibold">{item.temp}°C</p>
                  <div className="text-xs text-muted-foreground mt-2 flex justify-between">
                    <span>{item.humidity}%</span>
                    <span>{item.wind} km/h</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
