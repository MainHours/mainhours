
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface GameResult {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  league: string;
  status: 'live' | 'final' | 'upcoming';
  time?: string;
}

const SportsUpdate = () => {
  const games: GameResult[] = [
    {
      teamA: 'Lakers',
      teamB: 'Warriors',
      scoreA: 105,
      scoreB: 110,
      league: 'NBA',
      status: 'final'
    },
    {
      teamA: 'Chiefs',
      teamB: 'Bills',
      scoreA: 24,
      scoreB: 21,
      league: 'NFL',
      status: 'final'
    },
    {
      teamA: 'Man City',
      teamB: 'Arsenal',
      scoreA: 2,
      scoreB: 2,
      league: 'EPL',
      status: 'live',
      time: '75\''
    },
    {
      teamA: 'Yankees',
      teamB: 'Red Sox',
      scoreA: 0,
      scoreB: 0,
      league: 'MLB',
      status: 'upcoming',
      time: 'Today, 7:05 PM'
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Sports Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {games.map((game, index) => (
            <React.Fragment key={index}>
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{game.league}</p>
                  <div className="flex justify-between">
                    <p className="font-medium">{game.teamA}</p>
                    <p className="font-bold">{game.scoreA}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="font-medium">{game.teamB}</p>
                    <p className="font-bold">{game.scoreB}</p>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  {game.status === 'live' ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <span className="mr-1 h-2 w-2 rounded-full bg-red-600"></span>
                      LIVE {game.time}
                    </span>
                  ) : game.status === 'final' ? (
                    <span className="text-xs text-muted-foreground">Final</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">{game.time}</span>
                  )}
                </div>
              </div>
              {index < games.length - 1 && <Separator className="my-2" />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SportsUpdate;
