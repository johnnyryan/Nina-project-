
import React from 'react';
import { LeaderboardEntry } from '../types';
import { Avatar } from './Avatar';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserPoints: number;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserPoints }) => {
  const sortedEntries = [...entries, { id: 'me', name: 'You', points: currentUserPoints, isCurrentUser: true, avatar: '👤' }]
    .sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-t-8 border-emerald-600">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
        🏆 Neighborhood Heroes
      </h2>
      <div className="space-y-4">
        {sortedEntries.map((entry, index) => {
          const rank = index + 1;
          const displayRank = rank <= 3 ? rank : undefined;

          return (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-3 rounded-2xl transition-all ${
                entry.isCurrentUser ? 'bg-emerald-50 border-2 border-emerald-500' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  rank === 1 ? 'bg-yellow-400 text-white' : 
                  rank === 2 ? 'bg-gray-300 text-white' : 
                  rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {rank}
                </span>
                <Avatar icon={entry.avatar || '👤'} rank={displayRank} size="sm" />
                <span className={`font-semibold ${entry.isCurrentUser ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <span>☘️</span>
                {entry.points.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
