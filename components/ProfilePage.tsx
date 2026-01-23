
import React, { useState } from 'react';
import { UserProfile, ShopItem } from '../types';
import { NEIGHBORHOODS, BADGES, SHOP_ITEMS, COLORS } from '../constants';
import { Avatar } from './Avatar';

interface ProfilePageProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onPurchase: (item: ShopItem) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onPurchase }) => {
  const [isEditing, setIsEditing] = useState(!user.neighborhood);
  const [showShop, setShowShop] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    neighborhood: user.neighborhood || '',
    bio: user.bio || '',
    avatar: user.avatar || '👤'
  });

  const handleSave = () => {
    if (!formData.name || !formData.neighborhood) {
      alert("Please provide your name and neighborhood to continue.");
      return;
    }
    onUpdate(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-2xl mx-auto border-t-8" style={{ borderTopColor: COLORS.gold }}>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-emerald-900 mb-2">Community Registration</h2>
          <p className="text-gray-600">Join your local neighborhood initiative and help protect our natural environment.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Neighborhood</label>
            <select
              value={formData.neighborhood}
              onChange={e => setFormData({...formData, neighborhood: e.target.value})}
              className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none"
            >
              <option value="">Select your area...</option>
              {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none h-24"
              placeholder="What motivates you to help Ireland?"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-emerald-800 text-white font-bold rounded-2xl shadow-lg hover:bg-emerald-900 transition-all"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  const userBadges = BADGES.filter(b => user.badges.includes(b.id));

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-40 relative" style={{ backgroundColor: COLORS.emeraldDeep }}>
          <div className="absolute -bottom-16 left-12 bg-white p-2 rounded-[2rem] shadow-2xl">
            <Avatar icon={user.avatar} rank={user.rank} size="xl" className="border-4 border-emerald-100" />
          </div>
          <div className="absolute top-4 right-8 flex gap-3">
            <button 
              onClick={() => setShowShop(!showShop)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full font-bold text-sm backdrop-blur-md flex items-center gap-2"
            >
              {showShop ? 'Close Shop' : '☘️ Shop'}
            </button>
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold text-sm backdrop-blur-sm"
            >
              Edit
            </button>
          </div>
        </div>

        <div className="pt-20 pb-10 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-4xl font-black text-emerald-900">{user.name}</h2>
              <p className="text-emerald-700 font-bold flex items-center gap-2 mt-1">
                📍 {user.neighborhood}
              </p>
            </div>
            <div className="bg-emerald-900 text-white px-6 py-2 rounded-2xl flex items-center gap-3 shadow-md">
              <span className="text-2xl">☘️</span>
              <div className="flex flex-col">
                <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">Shamrocks</span>
                <span className="text-xl font-black leading-none">{user.totalShamrocks.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <p className="mt-6 text-gray-700 italic max-w-2xl text-lg leading-relaxed">
            "{user.bio || 'Contributing to a greener Ireland.'}"
          </p>

          <div className="mt-10">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-200"></span>
              Honorary Badges
              <span className="w-6 h-px bg-emerald-200"></span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {userBadges.length > 0 ? userBadges.map(badge => (
                <div key={badge.id} className="bg-emerald-50 border border-emerald-100 p-4 rounded-3xl flex items-center gap-4 hover:shadow-md transition-all cursor-default">
                  <div className="text-4xl p-2 bg-white rounded-2xl shadow-sm">{badge.icon}</div>
                  <div>
                    <h4 className="font-bold text-emerald-900 leading-tight">{badge.name}</h4>
                    <p className="text-[10px] text-emerald-700 uppercase font-bold tracking-tight">{badge.description}</p>
                  </div>
                </div>
              )) : (
                <p className="text-gray-400 text-sm italic">Complete community actions to earn badges.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {showShop && (
        <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-3xl font-black">Marketplace</h3>
              <p className="text-emerald-300">Redeem your Shamrocks for unique honors and avatars.</p>
            </div>
            <div className="text-2xl font-black bg-emerald-800 px-6 py-2 rounded-2xl">
              ☘️ {user.totalShamrocks.toLocaleString()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SHOP_ITEMS.map(item => {
              const isOwned = (item.type === 'avatar' && user.unlockedAvatars.includes(item.icon)) || (item.type === 'achievement' && user.badges.includes(item.id));
              const canAfford = user.totalShamrocks >= item.cost;
              
              return (
                <div key={item.id} className="bg-emerald-800/50 border border-emerald-700 p-6 rounded-[2rem] flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-xs text-emerald-400 uppercase font-bold tracking-widest">{item.type}</p>
                    </div>
                  </div>
                  {item.earnedOnly ? (
                    <div className={`px-4 py-2 rounded-xl font-bold text-xs ${isOwned ? 'bg-emerald-500 text-white' : 'bg-emerald-700 text-emerald-300'}`}>
                      {isOwned ? 'Earned' : 'Earn via Rank'}
                    </div>
                  ) : (
                    <button
                      disabled={isOwned || !canAfford}
                      onClick={() => onPurchase(item)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all ${
                        isOwned ? 'bg-emerald-700/50 text-emerald-400 cursor-default' :
                        !canAfford ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                        'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                      }`}
                    >
                      {isOwned ? 'Unlocked' : `☘️ ${item.cost}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
