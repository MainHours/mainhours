
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CityWeather } from '@/pages/Climate';
import { Thermometer, Wind, CloudDrizzle, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface CityWeatherCardProps {
  city: CityWeather;
}

const CityWeatherCard = ({ city }: CityWeatherCardProps) => {
  const { t } = useTranslation();
  
  // Helper function to determine background color based on temperature
  const getTemperatureColor = (temp: number) => {
    if (temp < 10) return 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20';
    if (temp < 20) return 'from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20';
    if (temp < 30) return 'from-yellow-50 to-green-50 dark:from-yellow-900/20 dark:to-green-900/20';
    return 'from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20';
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className={`pb-2 bg-gradient-to-r ${getTemperatureColor(city.temperature)}`}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{city.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{city.country}</p>
          </div>
          <div className="text-3xl">{city.icon}</div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">{city.temperature}°C</span>
            <span className="text-sm text-muted-foreground">{city.condition}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-y-2 text-sm">
            <div className="flex items-center gap-1">
              <Thermometer className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">{t('climate.feelsLike')}:</span>
            </div>
            <div className="text-right">{city.feelsLike}°C</div>
            
            <div className="flex items-center gap-1">
              <Wind className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">{t('climate.pressure')}:</span>
            </div>
            <div className="text-right">{city.pressure} hPa</div>
            
            <div className="flex items-center gap-1">
              <CloudDrizzle className="h-4 w-4 text-blue-500" />
              <span className="text-muted-foreground">{t('climate.humidity')}:</span>
            </div>
            <div className="text-right">{city.humidity}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CityWeatherCard;
