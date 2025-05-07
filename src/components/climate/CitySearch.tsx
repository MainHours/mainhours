
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { CityWeather } from '@/pages/Climate';
import { useTranslation } from '@/hooks/useTranslation';

interface CitySearchProps {
  onSearchResults: (results: CityWeather[]) => void;
}

const CitySearch = ({ onSearchResults }: CitySearchProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Mock cities database for search
  const citiesDatabase: CityWeather[] = [
    {
      id: '7',
      name: 'Berlin',
      country: 'Germany',
      temperature: 17,
      condition: 'Cloudy',
      pressure: 1011,
      feelsLike: 16,
      humidity: 68,
      icon: '☁️'
    },
    {
      id: '8',
      name: 'Rio de Janeiro',
      country: 'Brazil',
      temperature: 30,
      condition: 'Sunny',
      pressure: 1013,
      feelsLike: 32,
      humidity: 70,
      icon: '☀️'
    },
    {
      id: '9',
      name: 'Mumbai',
      country: 'India',
      temperature: 32,
      condition: 'Humid',
      pressure: 1008,
      feelsLike: 36,
      humidity: 85,
      icon: '🌡️'
    },
    {
      id: '10',
      name: 'Beijing',
      country: 'China',
      temperature: 24,
      condition: 'Hazy',
      pressure: 1012,
      feelsLike: 25,
      humidity: 60,
      icon: '🌫️'
    },
    {
      id: '11',
      name: 'Cape Town',
      country: 'South Africa',
      temperature: 22,
      condition: 'Windy',
      pressure: 1015,
      feelsLike: 20,
      humidity: 55,
      icon: '💨'
    }
  ];

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast.error(t('climate.enterCity'));
      return;
    }

    setLoading(true);

    try {
      // In a real app, this would be an API call to a weather service
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));

      const results = citiesDatabase.filter(city => 
        city.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (results.length === 0) {
        // If no exact matches, create a mock result
        const mockResult: CityWeather = {
          id: `search-${Date.now()}`,
          name: searchQuery,
          country: 'Unknown',
          temperature: Math.floor(15 + Math.random() * 20),
          condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 5)],
          pressure: 1000 + Math.floor(Math.random() * 20),
          feelsLike: Math.floor(15 + Math.random() * 20),
          humidity: 40 + Math.floor(Math.random() * 50),
          icon: ['☀️', '☁️', '⛅', '🌧️', '🌤️'][Math.floor(Math.random() * 5)]
        };
        onSearchResults([mockResult]);
        toast.success(t('climate.foundWeather', { city: searchQuery }));
      } else {
        onSearchResults(results);
        toast.success(t('climate.foundCities', { count: results.length }));
      }

      // Update recent searches
      if (!recentSearches.includes(searchQuery)) {
        const updatedSearches = [searchQuery, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentWeatherSearches', JSON.stringify(updatedSearches));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error(t('climate.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    toast.info(t('climate.gettingLocation'));
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setLoading(true);
            
            // In a real app, we would use the coordinates to get weather
            // Simulating API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const mockResult: CityWeather = {
              id: `location-${Date.now()}`,
              name: 'Current Location',
              country: 'Local',
              temperature: Math.floor(15 + Math.random() * 20),
              condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy', 'Clear'][Math.floor(Math.random() * 5)],
              pressure: 1000 + Math.floor(Math.random() * 20),
              feelsLike: Math.floor(15 + Math.random() * 20),
              humidity: 40 + Math.floor(Math.random() * 50),
              icon: ['☀️', '☁️', '⛅', '🌧️', '🌤️'][Math.floor(Math.random() * 5)]
            };
            
            onSearchResults([mockResult]);
            toast.success(t('climate.locationWeather'));
          } catch (error) {
            console.error('Location weather error:', error);
            toast.error(t('climate.locationFailed'));
          } finally {
            setLoading(false);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error(t('climate.locationDenied'));
          setLoading(false);
        }
      );
    } else {
      toast.error(t('climate.locationNotSupported'));
    }
  };

  // Load recent searches from localStorage on component mount
  React.useEffect(() => {
    const savedSearches = localStorage.getItem('recentWeatherSearches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Failed to parse recent searches:', e);
      }
    }
  }, []);

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSearch} className="flex flex-col space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('climate.searchCity')}
                className="pl-8 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full border-white"></span>
                  {t('climate.searching')}
                </span>
              ) : (
                t('climate.search')
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUseCurrentLocation}
              disabled={loading}
            >
              <MapPin className="h-4 w-4 mr-2" />
              {t('climate.useLocation')}
            </Button>
          </div>
          
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">{t('climate.recentSearches')}:</span>
              {recentSearches.map((search, index) => (
                <Button 
                  key={index} 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery(search);
                  }}
                  className="h-7 px-2 py-1"
                >
                  {search}
                </Button>
              ))}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CitySearch;
