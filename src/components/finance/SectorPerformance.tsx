
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface Sector {
  name: string;
  change: number;
  color: string;
}

const SectorPerformance = () => {
  const sectors: Sector[] = [
    { name: 'Technology', change: 2.45, color: 'bg-blue-500' },
    { name: 'Healthcare', change: 1.89, color: 'bg-green-500' },
    { name: 'Financial', change: 1.23, color: 'bg-purple-500' },
    { name: 'Consumer Disc.', change: 0.87, color: 'bg-yellow-500' },
    { name: 'Communication', change: 0.45, color: 'bg-pink-500' },
    { name: 'Industrials', change: -0.23, color: 'bg-orange-500' },
    { name: 'Energy', change: -0.89, color: 'bg-red-500' },
    { name: 'Materials', change: -1.34, color: 'bg-gray-500' },
    { name: 'Real Estate', change: -1.67, color: 'bg-indigo-500' },
    { name: 'Utilities', change: -2.01, color: 'bg-teal-500' }
  ];

  const maxAbsChange = Math.max(...sectors.map(s => Math.abs(s.change)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sector Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sectors.map((sector) => (
            <div key={sector.name} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${sector.color}`}></div>
                <span className="text-sm font-medium min-w-0 flex-1">{sector.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-20">
                  <Progress 
                    value={((sector.change + maxAbsChange) / (2 * maxAbsChange)) * 100} 
                    className="h-2"
                  />
                </div>
                <span className={`text-sm font-medium w-16 text-right ${
                  sector.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {sector.change > 0 ? '+' : ''}{sector.change.toFixed(2)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SectorPerformance;
