
import React, { useState, useMemo } from 'react';
import { UserProfile, ShopItem } from '../types';
import { NEIGHBORHOODS, COUNTIES, BADGES, SHOP_ITEMS, COLORS, COMMUNITY_GROUP_TYPES } from '../constants';
import { Avatar } from './Avatar';

interface ProfilePageProps {
  user: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onPurchase: (item: ShopItem) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdate, onPurchase }) => {
  const [isEditing, setIsEditing] = useState(!user.neighborhood);
  const [showShop, setShowShop] = useState(false);
  const [shopCategory, setShopCategory] = useState<'avatar' | 'theme' | 'achievement'>('avatar');
  
  const [formData, setFormData] = useState({
    name: user.name || '',
    county: user.county || '',
    neighborhood: user.neighborhood || '',
    street: user.street || '',
    communityGroups: user.communityGroups || [],
    bio: user.bio || '',
    avatar: user.avatar || '👤'
  });

  const activeTheme = SHOP_ITEMS.find(t => t.id === user.activeTheme) || SHOP_ITEMS.find(t => t.id === 'th_default')!;

  const handleSave = () => {
    if (!formData.name || !formData.neighborhood || !formData.county || !formData.street) {
      alert("Please provide your name, county, neighborhood, and street name to continue.");
      return;
    }
    onUpdate(formData);
    setIsEditing(false);
  };

  const toggleGroup = (group: string) => {
    const current = formData.communityGroups;
    if (current.includes(group)) {
      setFormData({...formData, communityGroups: current.filter(g => g !== group)});
    } else {
      setFormData({...formData, communityGroups: [...current, group]});
    }
  };

  const formattedJoinedDate = new Date(user.joinedDate).toLocaleDateString('en-IE', { month: 'long', year: 'numeric' });

  const userBadges = useMemo(() => BADGES.filter(b => user.badges.includes(b.id)), [user.badges]);
  const filteredShopItems = SHOP_ITEMS.filter(item => item.type === shopCategory);

  const unlockedThemesData = useMemo(() => {
    return SHOP_ITEMS.filter(item => item.type === 'theme' && user.unlockedThemes.includes(item.id));
  }, [user.unlockedThemes]);

  // Combine unlocked shop avatars and earned badge icons into a unique set
  const availableAvatarIcons = useMemo(() => {
    const icons = new Set(user.unlockedAvatars);
    userBadges.forEach(b => icons.add(b.icon));
    return Array.from(icons);
  }, [user.unlockedAvatars, userBadges]);

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">County</label>
              <select
                value={formData.county}
                onChange={e => setFormData({...formData, county: e.target.value})}
                className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none"
              >
                <option value="">Select county...</option>
                {COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Neighborhood / Town</label>
              <select
                value={formData.neighborhood}
                onChange={e => setFormData({...formData, neighborhood: e.target.value})}
                className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none"
              >
                <option value="">Select town...</option>
                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Street Name</label>
            <input
              type="text"
              value={formData.street}
              onChange={e => setFormData({...formData, street: e.target.value})}
              className="w-full p-3 rounded-xl bg-gray-50 border-2 border-transparent focus:border-emerald-600 outline-none"
              placeholder="e.g. Francis St"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Community Groups</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMUNITY_GROUP_TYPES.map(group => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-2 ${
                    formData.communityGroups.includes(group)
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-white text-emerald-800 border-emerald-100 hover:border-emerald-600'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500">
        <div className="h-40 relative transition-colors duration-500" style={{ backgroundColor: activeTheme.themeConfig?.bg }}>
          <div className="absolute -bottom-16 left-12 bg-white p-2 rounded-[2rem] shadow-2xl">
            <Avatar icon={user.avatar} rank={user.rank} size="xl" isMaster={user.isMaster} isCaptain={user.isCaptain} className="border-4 border-emerald-100" />
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
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-black text-emerald-900">{user.name}</h2>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">Joined {formattedJoinedDate}</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-white font-bold text-sm px-3 py-1 rounded-full" style={{ backgroundColor: activeTheme.themeConfig?.accent }}>📍 {user.neighborhood}, {user.county}</span>
                <span className="text-stone-600 font-bold text-sm bg-stone-100 px-3 py-1 rounded-full">🏠 {user.street}</span>
                {user.communityGroups.map(g => (
                  <span key={g} className="text-orange-700 font-bold text-sm bg-orange-50 px-3 py-1 rounded-full">🤝 {g}</span>
                ))}
              </div>
            </div>
            <div className="text-white px-6 py-2 rounded-2xl flex items-center gap-3 shadow-md" style={{ backgroundColor: activeTheme.themeConfig?.bg }}>
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

          <div className="mt-10">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-200"></span>
              My Avatars
              <span className="w-6 h-px bg-emerald-200"></span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {availableAvatarIcons.map(av => (
                <button
                  key={av}
                  onClick={() => onUpdate({ avatar: av })}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl border-4 transition-all ${
                    user.avatar === av ? 'border-emerald-500 bg-emerald-50 scale-110 shadow-lg' : 'border-gray-100 bg-gray-50 hover:border-emerald-200'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-sm font-bold text-emerald-900 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-emerald-200"></span>
              My Themes
              <span className="w-6 h-px bg-emerald-200"></span>
            </h3>
            <div className="flex flex-wrap gap-4">
              {unlockedThemesData.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => onUpdate({ activeTheme: theme.id })}
                  className={`flex items-center gap-3 px-4 py-2 rounded-2xl border-4 transition-all ${
                    user.activeTheme === theme.id ? 'border-emerald-500 bg-emerald-50 shadow-md scale-105' : 'border-gray-100 bg-gray-50 hover:border-emerald-200'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm" style={{ backgroundColor: theme.themeConfig?.bg }}>
                    {theme.icon}
                  </div>
                  <span className="text-xs font-bold text-emerald-900">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showShop && (
        <div className="rounded-[3rem] p-10 text-white shadow-2xl animate-in slide-in-from-bottom duration-500" style={{ backgroundColor: activeTheme.themeConfig?.bg }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h3 className="text-3xl font-black">Marketplace</h3>
              <p className="text-white/60">Exchange your hard-earned Shamrocks for local prestige.</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-2xl font-black bg-black/20 px-6 py-2 rounded-2xl flex items-center gap-2">
                <span>☘️</span> {user.totalShamrocks.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-8 bg-black/10 p-2 rounded-2xl w-fit">
            <button 
              onClick={() => setShopCategory('avatar')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${shopCategory === 'avatar' ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              Avatars
            </button>
            <button 
              onClick={() => setShopCategory('theme')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${shopCategory === 'theme' ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              Themes
            </button>
            <button 
              onClick={() => setShopCategory('achievement')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${shopCategory === 'achievement' ? 'bg-white/20 text-white shadow-lg' : 'text-white/40 hover:text-white/80'}`}
            >
              Exclusives
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShopItems.map(item => {
              const isOwnedAvatar = item.type === 'avatar' && user.unlockedAvatars.includes(item.icon);
              const isOwnedTheme = item.type === 'theme' && user.unlockedThemes.includes(item.id);
              const isOwnedAchievement = item.type === 'achievement' && user.badges.includes(item.id);
              
              const isOwned = isOwnedAvatar || isOwnedTheme || isOwnedAchievement;
              const canAfford = user.totalShamrocks >= item.cost;
              const isSelected = (item.type === 'theme' && item.id === user.activeTheme) || (item.type === 'avatar' && item.icon === user.avatar);
              
              const handleAction = () => {
                if (isOwned) {
                  if (item.type === 'theme') onUpdate({ activeTheme: item.id });
                  if (item.type === 'avatar') onUpdate({ avatar: item.icon });
                } else if (canAfford) {
                  onPurchase(item);
                }
              };

              return (
                <div key={item.id} className={`bg-black/10 border-2 p-6 rounded-[2.5rem] flex items-center justify-between group transition-all ${
                  isOwned ? 'border-white/20' : canAfford ? 'border-white/10 hover:border-white/30 hover:bg-black/20' : 'border-black/20 opacity-40'
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`text-4xl w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner ${
                      isOwned ? 'bg-white/10' : 'bg-white/10 group-hover:bg-white/20 group-hover:scale-110'
                    }`}>
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-base leading-tight">{item.name}</h4>
                      <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">{item.type}</p>
                    </div>
                  </div>
                  
                  {item.earnedOnly && !isOwned ? (
                    <div className="px-4 py-1 rounded-full font-bold text-[10px] uppercase tracking-tighter bg-black/40 text-white/40">
                      Rank Locked
                    </div>
                  ) : (
                    <button
                      disabled={!isOwned && !canAfford}
                      onClick={handleAction}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition-all whitespace-nowrap ${
                        isSelected ? 'bg-white text-emerald-900 shadow-xl scale-105' :
                        isOwned ? 'bg-emerald-600 text-white hover:bg-emerald-500' :
                        !canAfford ? 'bg-black/40 text-white/20 cursor-not-allowed border border-white/5' :
                        'bg-white text-emerald-900 hover:bg-emerald-50 shadow-lg active:scale-95'
                      }`}
                    >
                      {isSelected ? 'Selected' : isOwned ? 'Use Item' : `☘️ ${item.cost.toLocaleString()}`}
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
