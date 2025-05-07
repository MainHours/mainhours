
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { Globe, MapPin, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WeatherMap = () => {
  const { t } = useTranslation();
  const [mapType, setMapType] = React.useState('temperature');
  
  // In a real application, this would be an interactive map using a library like Leaflet or Google Maps
  // For this demo, we're using a placeholder image
  const getMapUrl = () => {
    switch (mapType) {
      case 'temperature':
        return 'https://placehold.co/800x500/f97316/FFFFFF/png?text=Temperature+Map';
      case 'precipitation':
        return 'https://placehold.co/800x500/3b82f6/FFFFFF/png?text=Precipitation+Map';
      case 'wind':
        return 'https://placehold.co/800x500/22c55e/FFFFFF/png?text=Wind+Map';
      case 'cloud':
        return 'https://placehold.co/800x500/94a3b8/FFFFFF/png?text=Cloud+Coverage+Map';
      default:
        return 'https://placehold.co/800x500/f97316/FFFFFF/png?text=Temperature+Map';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-2xl flex items-center">
            <Globe className="h-6 w-6 mr-2" />
            {t('climate.weatherMap')}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={mapType === 'temperature' ? 'default' : 'outline'}
              onClick={() => setMapType('temperature')}
              className="h-8"
            >
              {t('climate.temperature')}
            </Button>
            <Button
              size="sm"
              variant={mapType === 'precipitation' ? 'default' : 'outline'}
              onClick={() => setMapType('precipitation')}
              className="h-8"
            >
              {t('climate.precipitation')}
            </Button>
            <Button
              size="sm"
              variant={mapType === 'wind' ? 'default' : 'outline'}
              onClick={() => setMapType('wind')}
              className="h-8"
            >
              {t('climate.wind')}
            </Button>
            <Button
              size="sm"
              variant={mapType === 'cloud' ? 'default' : 'outline'}
              onClick={() => setMapType('cloud')}
              className="h-8"
            >
              {t('climate.clouds')}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative w-full aspect-[16/9] bg-muted rounded-md overflow-hidden">
          <img 
            src={getMapUrl()} 
            alt={`${mapType} map`} 
            className="w-full h-full object-cover"
          />
          
          {/* Map controls that would be functional in a real implementation */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="h-9 w-9">
              <Layers className="h-5 w-5" />
              <span className="sr-only">Layers</span>
            </Button>
            <Button size="icon" variant="secondary" className="h-9 w-9">
              <MapPin className="h-5 w-5" />
              <span className="sr-only">Current Location</span>
            </Button>
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-md">
            <div className="text-sm">
              <p className="font-medium">{t('climate.mapLegend')}</p>
              <div className="flex items-center justify-between mt-2">
                {mapType === 'temperature' && (
                  <div className="w-full flex items-center">
                    <div className="h-3 flex-1 bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500 rounded"></div>
                    <div className="flex justify-between w-full text-xs mt-1">
                      <span>-10°C</span>
                      <span>0°C</span>
                      <span>10°C</span>
                      <span>20°C</span>
                      <span>30°C</span>
                      <span>40°C</span>
                    </div>
                  </div>
                )}
                
                {mapType === 'precipitation' && (
                  <div className="w-full flex items-center">
                    <div className="h-3 flex-1 bg-gradient-to-r from-transparent via-blue-300 to-blue-700 rounded"></div>
                    <div className="flex justify-between w-full text-xs mt-1">
                      <span>0mm</span>
                      <span>5mm</span>
                      <span>10mm</span>
                      <span>15mm</span>
                      <span>20mm+</span>
                    </div>
                  </div>
                )}
                
                {mapType === 'wind' && (
                  <div className="w-full flex items-center">
                    <div className="h-3 flex-1 bg-gradient-to-r from-green-200 via-green-500 to-green-800 rounded"></div>
                    <div className="flex justify-between w-full text-xs mt-1">
                      <span>0km/h</span>
                      <span>20km/h</span>
                      <span>40km/h</span>
                      <span>60km/h</span>
                      <span>80km/h+</span>
                    </div>
                  </div>
                )}
                
                {mapType === 'cloud' && (
                  <div className="w-full flex items-center">
                    <div className="h-3 flex-1 bg-gradient-to-r from-blue-50 via-gray-300 to-gray-700 rounded"></div>
                    <div className="flex justify-between w-full text-xs mt-1">
                      <span>0%</span>
                      <span>25%</span>
                      <span>50%</span>
                      <span>75%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherMap;
