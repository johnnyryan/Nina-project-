
import React, { useState } from 'react';
import { UserProfile, RewardAction } from '../types';
import { REWARD_ACTIONS, BADGES, COLORS } from '../constants';
import { Avatar } from './Avatar';

interface UserProfileViewProps {
  user: UserProfile;
  onClose: () => void;
  onVerifyForUser: (userId: string, action: RewardAction) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onClose, onVerifyForUser }) => {
  const [verifiedActions, setVerifiedActions] = useState<Set<string>>(new Set());
  const userBadges = BADGES.filter(b => user.badges.includes(b.id));

  const handleToggleVerify = (action: RewardAction) => {
    if (verifiedActions.has(action.id)) return; // Don't verify twice in same session
    
    const newVerified = new Set(verifiedActions);
    newVerified.add(action.id);
    setVerifiedActions(newVerified);
    
    // Call the parent to handle the "giving shamrocks" logic
    onVerifyForUser(user.id, action);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-emerald-100 flex flex-col max-h-[90vh]">
        <div className="p-10 relative text-center text-white shrink-0" style={{ backgroundColor: COLORS.emeraldDeep }}>
          <button onClick={onClose} className="absolute top-6 right-8 text-2xl hover:scale-110 transition-transform">✕</button>
          <Avatar icon={user.avatar} rank={user.rank} size="xl" className="mx-auto mb-4 border-4 border-white/20 shadow-xl" />
          <h2 className="text-4xl font-black mb-1">{user.name}</h2>
          <p className="text-emerald-100 font-bold uppercase tracking-widest text-sm">📍 {user.neighborhood}, {user.county}</p>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-emerald-50 p-4 rounded-3xl text-center border border-emerald-100">
              <div className="text-emerald-700 font-bold text-xs uppercase mb-1">Impact Score</div>
              <div className="text-2xl font-black text-emerald-900">☘️ {user.totalShamrocks.toLocaleString()}</div>
            </div>
            <div className="flex-1 bg-orange-50 p-4 rounded-3xl text-center border border-orange-100">
              <div className="text-orange-700 font-bold text-xs uppercase mb-1">Badges</div>
              <div className="text-2xl font-black text-orange-900">{userBadges.length}</div>
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[10px] font-bold text-emerald-900 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-200"></span>
              Honorary Badges
              <span className="w-6 h-px bg-emerald-200"></span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {userBadges.length > 0 ? userBadges.map(badge => (
                <div key={badge.id} className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center gap-3 hover:shadow-sm transition-all cursor-default">
                  <div className="text-2xl p-2 bg-white rounded-xl shadow-sm shrink-0">{badge.icon}</div>
                  <div>
                    <h4 className="font-bold text-emerald-900 leading-tight text-sm">{badge.name}</h4>
                    <p className="text-[9px] text-emerald-700 uppercase font-bold tracking-tight">{badge.description}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm italic col-span-2 text-center py-4">No community badges earned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border-2 border-emerald-100 p-8 shadow-inner bg-gradient-to-b from-emerald-50/50 to-white">
            <h3 className="font-black text-emerald-900 flex items-center gap-2 mb-2 text-xl">
              🤝 Community Witness
            </h3>
            <p className="text-sm text-emerald-800/70 mb-6 font-medium leading-relaxed">
              Help your neighbors grow their impact! Tick off any environmental actions you witnessed {user.name.split(' ')[0]} performing today.
            </p>
            
            <div className="space-y-3">
              {REWARD_ACTIONS.map(action => {
                const isVerified = verifiedActions.has(action.id);
                return (
                  <button
                    key={action.id}
                    disabled={isVerified}
                    onClick={() => handleToggleVerify(action)}
                    className={`w-full p-5 rounded-2xl flex items-center justify-between transition-all group ${
                      isVerified 
                        ? 'bg-emerald-100 border-2 border-emerald-500 cursor-default opacity-80' 
                        : 'bg-white border-2 border-gray-100 hover:border-emerald-500 hover:shadow-md active:scale-[0.98]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                        isVerified ? 'bg-emerald-500 text-white' : 'bg-gray-100 group-hover:bg-emerald-50'
                      }`}>
                        {isVerified ? '✓' : action.icon}
                      </div>
                      <div className="text-left">
                        <div className={`font-black text-sm ${isVerified ? 'text-emerald-900' : 'text-gray-800'}`}>
                          {action.title}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
                          Worth ☘️ {action.points}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      isVerified 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'bg-white border-gray-200 group-hover:border-emerald-500'
                    }`}>
                      {isVerified && <span className="text-sm font-bold animate-in zoom-in duration-300">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
