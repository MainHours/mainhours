
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, BarChart, Clock, DollarSign } from 'lucide-react';

const MarketStats = () => {
  const stats = [
    {
      icon: <Activity className="h-4 w-4" />,
      label: 'Market Cap',
      value: '$42.3T',
      change: '+0.4%',
      positive: true
    },
    {
      icon: <BarChart className="h-4 w-4" />,
      label: 'Volume',
      value: '3.2B',
      change: '+12.5%',
      positive: true
    },
    {
      icon: <DollarSign className="h-4 w-4" />,
      label: 'VIX',
      value: '18.45',
      change: '-2.1%',
      positive: false
    },
    {
      icon: <Clock className="h-4 w-4" />,
      label: 'P/E Ratio',
      value: '24.6',
      change: '+0.8%',
      positive: true
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Market Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="p-2 bg-muted rounded-lg">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="font-bold">{stat.value}</p>
                <Badge variant={stat.positive ? "default" : "destructive"} className="text-xs">
                  {stat.change}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketStats;
