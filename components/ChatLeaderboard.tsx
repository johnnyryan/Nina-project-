
import React from 'react';
import { MOCK_CHAT_LEADERBOARD } from '../constants';

interface ChatLeaderboardProps {
  onBack: () => void;
}

export const ChatLeaderboard: React.FC<ChatLeaderboardProps> = ({ onBack }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 relative">
      <div className="absolute top-4 right-4 z-40">
        <button 
          onClick={onBack}
          className="bg-white text-emerald-900 w-12 h-12 rounded-full flex items-center justify-center shadow-xl font-black hover:scale-110 active:scale-95 transition-all border-4 border-emerald-50"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border-t-8 border-emerald-600">
        <div className="flex items-center justify-between mb-10 pr-12">
          <div>
            <h2 className="text-4xl font-black text-emerald-900 mb-2">Neighborhood Rankings</h2>
            <p className="text-gray-500">The collective effort of Ireland's greenest communities.</p>
          </div>
        </div>

        <div className="space-y-4">
          {MOCK_CHAT_LEADERBOARD.map((entry) => (
            <div 
              key={entry.neighborhood}
              className={`flex items-center justify-between p-6 rounded-[2.5rem] border-2 transition-all ${
                entry.rank === 1 
                  ? 'bg-yellow-50 border-yellow-200 scale-[1.02] shadow-lg' 
                  : 'bg-white border-gray-50 hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center gap-6">
                <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${
                  entry.rank === 1 ? 'bg-yellow-400 text-white' : 
                  entry.rank === 2 ? 'bg-gray-300 text-white' : 
                  entry.rank === 3 ? 'bg-orange-400 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {entry.rank}
                </span>
                <div>
                  <h3 className="text-xl font-black text-emerald-900 leading-none mb-1">{entry.neighborhood}</h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      📍 {entry.county}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                      👥 {entry.activeMembers} Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-emerald-800">
                  <span className="text-emerald-400">☘️</span> {entry.totalPoints.toLocaleString()}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Community Points</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-[2.5rem] border-2 border-emerald-100 text-center">
          <p className="text-emerald-800 font-bold mb-2 italic">"Unity is strength... especially when there's rubbish to pick up!"</p>
          <p className="text-xs text-emerald-600 font-medium">Global rankings update every Sunday at midnight.</p>
        </div>
      </div>
    </div>
  );
};
