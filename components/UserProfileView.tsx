
import React from 'react';
import { UserProfile, RewardAction } from '../types';
import { REWARD_ACTIONS, BADGES, COLORS } from '../constants';
import { Avatar } from './Avatar';

interface UserProfileViewProps {
  user: UserProfile;
  onClose: () => void;
  onVerifyForUser: (userId: string, action: RewardAction) => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user, onClose, onVerifyForUser }) => {
  const userBadges = BADGES.filter(b => user.badges.includes(b.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300 border border-emerald-100">
        <div className="p-10 relative text-center text-white" style={{ backgroundColor: COLORS.emeraldDeep }}>
          <button onClick={onClose} className="absolute top-6 right-8 text-2xl hover:scale-110 transition-transform">✕</button>
          <Avatar icon={user.avatar} rank={user.rank} size="xl" className="mx-auto mb-4 border-4 border-white/20 shadow-xl" />
          <h2 className="text-4xl font-black mb-1">{user.name}</h2>
          <p className="text-emerald-100 font-bold uppercase tracking-widest text-sm">📍 {user.neighborhood}</p>
        </div>

        <div className="p-10">
          <div className="flex gap-4 mb-8">
            <div className="flex-1 bg-emerald-50 p-4 rounded-3xl text-center border border-emerald-100">
              <div className="text-emerald-700 font-bold text-xs uppercase mb-1">Total Impact</div>
              <div className="text-2xl font-black text-emerald-900">☘️ {user.totalShamrocks}</div>
            </div>
            <div className="flex-1 bg-orange-50 p-4 rounded-3xl text-center border border-orange-100">
              <div className="text-orange-700 font-bold text-xs uppercase mb-1">Badges</div>
              <div className="text-2xl font-black text-orange-900">{userBadges.length}</div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Honors & Achievement</h3>
            <div className="flex flex-wrap gap-2">
              {userBadges.length > 0 ? userBadges.map(b => (
                <div key={b.id} className="bg-emerald-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-bold shadow-sm">
                  <span>{b.icon}</span> {b.name}
                </div>
              )) : (
                <p className="text-gray-400 text-sm italic">No badges earned yet.</p>
              )}
            </div>
          </div>

          <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100">
            <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-2">
              🤝 Community Endorsement
            </h3>
            <p className="text-sm text-emerald-800 mb-4 opacity-80">
              Have you witnessed {user.name} performing an environmental action? Verify their deed here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REWARD_ACTIONS.map(action => (
                <button
                  key={action.id}
                  onClick={() => onVerifyForUser(user.id, action)}
                  className="bg-white hover:bg-emerald-600 hover:text-white transition-all p-4 rounded-2xl flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{action.icon}</span>
                    <span className="font-bold text-xs">{action.title}</span>
                  </div>
                  <div className="text-emerald-600 font-black text-[10px] group-hover:text-white">+{action.points}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
