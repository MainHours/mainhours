
import React from 'react';
import { Layout } from '@/components/layout/Layout';
import TrendingTopics from '@/components/dashboard/TrendingTopics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useTranslation } from '@/hooks/useTranslation';
import { TrendingUp } from 'lucide-react';

const Trends = () => {
  const { t } = useTranslation();
  
  // Sample trend data for visualization
  const trendData = [
    { name: 'Mon', technology: 85, sports: 45, business: 65, environment: 30, science: 50 },
    { name: 'Tue', technology: 90, sports: 55, business: 60, environment: 35, science: 60 },
    { name: 'Wed', technology: 95, sports: 60, business: 70, environment: 45, science: 55 },
    { name: 'Thu', technology: 100, sports: 65, business: 75, environment: 50, science: 70 },
    { name: 'Fri', technology: 110, sports: 70, business: 80, environment: 55, science: 75 },
    { name: 'Sat', technology: 105, sports: 80, business: 70, environment: 60, science: 65 },
    { name: 'Sun', technology: 115, sports: 85, business: 75, environment: 65, science: 80 },
  ];

  const chartConfig: ChartConfig = {
    technology: {
      label: 'Technology',
      theme: {
        light: '#7c3aed',
        dark: '#a78bfa',
      },
    },
    sports: {
      label: 'Sports',
      theme: {
        light: '#f59e0b',
        dark: '#fbbf24',
      },
    },
    business: {
      label: 'Business',
      theme: {
        light: '#10b981',
        dark: '#34d399',
      },
    },
    environment: {
      label: 'Environment',
      theme: {
        light: '#3b82f6',
        dark: '#60a5fa',
      },
    },
    science: {
      label: 'Science',
      theme: {
        light: '#ec4899',
        dark: '#f472b6',
      },
    },
  };

  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TrendingUp className="h-7 w-7" />
          {t('common.trends')}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{t('trends.weeklyActivity')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent 
                            formatter={(value) => [`${value}K`, null]} 
                          />
                        }
                      />
                      <Legend />
                      <Line type="monotone" dataKey="technology" name="Technology" stroke="var(--color-technology)" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="sports" name="Sports" stroke="var(--color-sports)" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="business" name="Business" stroke="var(--color-business)" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="environment" name="Environment" stroke="var(--color-environment)" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                      <Line type="monotone" dataKey="science" name="Science" stroke="var(--color-science)" strokeWidth={2} dot={{ strokeWidth: 2 }} />
                    </LineChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <TrendingTopics />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{t('trends.categoryDistribution')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
              {Object.entries(chartConfig).map(([key, { label, theme }]) => {
                const colorValue = theme?.light || '#000';
                return (
                  <div key={key} className="p-4 rounded-lg border">
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2" 
                      style={{ backgroundColor: colorValue }}
                    />
                    <p className="font-medium">{label}</p>
                    <p className="text-lg font-bold">{Math.floor(Math.random() * 30) + 10}%</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Trends;
