
import React from 'react';
import { LeaderboardEntry } from '../types';
import { Avatar } from './Avatar';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserPoints: number;
  currentUserCounty: string;
  onViewUser: (userId: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, currentUserPoints, currentUserCounty, onViewUser }) => {
  const sortedEntries = [...entries, { id: 'me', name: 'You', points: currentUserPoints, county: currentUserCounty, isCurrentUser: true, avatar: '👤' }]
    .sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border-t-8 border-emerald-600 flex flex-col max-h-[600px]">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2 shrink-0">
        🏆 {currentUserCounty || 'Local'} Heroes
      </h2>
      
      <div className="space-y-4 overflow-y-auto pr-2 no-scrollbar flex-1">
        {sortedEntries.map((entry, index) => {
          const rank = index + 1;
          const displayRank = rank <= 3 ? rank : undefined;

          return (
            <button
              key={entry.id}
              onClick={() => !entry.isCurrentUser && onViewUser(entry.id)}
              disabled={entry.isCurrentUser}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left ${
                entry.isCurrentUser 
                  ? 'bg-emerald-50 border-2 border-emerald-500 cursor-default shadow-sm' 
                  : 'hover:bg-emerald-50 hover:shadow-sm cursor-pointer border-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  rank === 1 ? 'bg-yellow-400 text-white' : 
                  rank === 2 ? 'bg-gray-300 text-white' : 
                  rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {rank}
                </span>
                <Avatar icon={entry.avatar || '👤'} rank={displayRank} size="sm" />
                <span className={`font-semibold truncate max-w-[120px] ${entry.isCurrentUser ? 'text-emerald-700' : 'text-gray-700'}`}>
                  {entry.name}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold shrink-0">
                <span>☘️</span>
                {entry.points.toLocaleString()}
              </div>
            </button>
          );
        })}
        {sortedEntries.length === 0 && (
          <p className="text-xs text-center text-gray-400 italic py-4">
            Be the first to climb the {currentUserCounty} ranks!
          </p>
        )}
      </div>
      
      {sortedEntries.length > 5 && (
        <div className="pt-4 text-center border-t border-emerald-50 mt-2 shrink-0">
          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Scroll for more heroes ☘️</p>
        </div>
      )}
    </div>
  );
};
