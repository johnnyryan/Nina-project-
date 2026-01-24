
import React, { useState, useEffect } from 'react';
import { UserProfile, RewardAction, AppView, ShopItem, Badge, ActionType, LeaderboardEntry } from './types';
import { REWARD_ACTIONS, MOCK_LEADERBOARD, MOCK_USERS, COLORS, SHOP_ITEMS, BADGES } from './constants';
import { ActionCard } from './components/ActionCard';
import { Leaderboard } from './components/Leaderboard';
import { VerificationModal } from './components/VerificationModal';
import { ProfilePage } from './components/ProfilePage';
import { NeighborhoodChat } from './components/NeighborhoodChat';
import { UserProfileView } from './components/UserProfileView';
import { Avatar } from './components/Avatar';
import { WildlifeGames } from './components/WildlifeGames';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('help-ireland-profile-v5');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.joinedDate && !parsed.joinedDate.includes('-') && !parsed.joinedDate.includes(':')) {
        parsed.joinedDate = new Date().toISOString();
      }
      if (!parsed.completedActionTypes) {
        parsed.completedActionTypes = [];
      }
      return parsed;
    }
    return {
      id: 'me',
      name: '',
      county: '',
      neighborhood: '',
      street: '',
      communityGroups: [],
      bio: '',
      avatar: '👤',
      activeTheme: 'th_default',
      totalShamrocks: 0, // Everyone starts with none
      completedActions: 0,
      completedActionTypes: [],
      joinedDate: new Date().toISOString(),
      badges: [], // Everyone starts with none
      unlockedAvatars: ['👤'],
      unlockedThemes: ['th_default'],
      rank: 0
    };
  });

  const [activeView, setActiveView] = useState<AppView>(
    userProfile.neighborhood ? 'home' : 'profile'
  );
  const [selectedAction, setSelectedAction] = useState<RewardAction | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Filter leaderboard to only show people in the same county
  const countyLeaderboard = MOCK_LEADERBOARD.filter(e => e.county === userProfile.county);

  useEffect(() => {
    const sorted = [...countyLeaderboard, { id: 'me', name: 'You', points: userProfile.totalShamrocks, county: userProfile.county }]
      .sort((a, b) => b.points - a.points);
    const myRank = sorted.findIndex(e => e.id === 'me') + 1;
    
    const newBadges = [...userProfile.badges];
    let newUnlockedAvatars = [...userProfile.unlockedAvatars];

    if (userProfile.totalShamrocks > 0) { // Only calculate ranks and badges if user has started participating
      if (myRank === 1 && !newBadges.includes('rank1')) {
        newBadges.push('rank1');
        if (!newBadges.includes('b8')) newBadges.push('b8');
      }
      if (myRank === 2 && !newBadges.includes('rank2')) {
        newBadges.push('rank2');
      }
      if (myRank === 3 && !newBadges.includes('rank3')) {
        newBadges.push('rank3');
      }
    }

    if (userProfile.completedActions >= 50 && !newBadges.includes('b5')) {
      newBadges.push('b5');
    }
    if (userProfile.completedActions >= 100 && !newBadges.includes('b6')) {
      newBadges.push('b6');
    }
    if (userProfile.totalShamrocks >= 50000 && !newBadges.includes('b7')) {
      newBadges.push('b7');
    }

    // Award badge for completing all types of actions
    const totalActionTypes = Object.keys(ActionType).length;
    if (userProfile.completedActionTypes.length >= totalActionTypes && !newBadges.includes('b_all_actions')) {
      newBadges.push('b_all_actions');
    }

    const joinedDate = new Date(userProfile.joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    if (diffYears >= 1 && !newBadges.includes('b_year1')) {
      newBadges.push('b_year1');
    }
    if (diffYears >= 5 && !newBadges.includes('b_year5')) {
      newBadges.push('b_year5');
    }
    if (diffYears >= 10 && !newBadges.includes('b_year10')) {
      newBadges.push('b_year10');
    }

    newBadges.forEach(badgeId => {
      const badgeObj = BADGES.find(b => b.id === badgeId);
      if (badgeObj && !newUnlockedAvatars.includes(badgeObj.icon)) {
        newUnlockedAvatars.push(badgeObj.icon);
      }
    });

    const badgesChanged = JSON.stringify(newBadges.sort()) !== JSON.stringify([...userProfile.badges].sort());
    const avatarsChanged = JSON.stringify(newUnlockedAvatars.sort()) !== JSON.stringify([...userProfile.unlockedAvatars].sort());

    if (userProfile.rank !== myRank || badgesChanged || avatarsChanged) {
      setUserProfile(prev => ({ 
        ...prev, 
        rank: myRank, 
        badges: newBadges,
        unlockedAvatars: newUnlockedAvatars 
      }));
    }
    
    localStorage.setItem('help-ireland-profile-v5', JSON.stringify(userProfile));
  }, [userProfile.totalShamrocks, userProfile.completedActions, userProfile.rank, userProfile.joinedDate, userProfile.completedActionTypes, userProfile.county]);

  const handleActionComplete = (points: number, actionId: ActionType) => {
    setUserProfile(prev => {
      const newActionTypes = prev.completedActionTypes.includes(actionId) 
        ? prev.completedActionTypes 
        : [...prev.completedActionTypes, actionId];
        
      return {
        ...prev,
        totalShamrocks: prev.totalShamrocks + points,
        completedActions: prev.completedActions + 1,
        completedActionTypes: newActionTypes
      };
    });
    setSelectedAction(null);
    triggerConfetti();
  };

  const handleEarnPoints = (points: number) => {
    setUserProfile(prev => ({
      ...prev,
      totalShamrocks: prev.totalShamrocks + points
    }));
    triggerConfetti();
  };

  const handlePurchase = (item: ShopItem) => {
    if (item.earnedOnly) return;
    if (userProfile.totalShamrocks < item.cost) return;

    setUserProfile(prev => ({
      ...prev,
      totalShamrocks: prev.totalShamrocks - item.cost,
      avatar: item.type === 'avatar' ? item.icon : prev.avatar,
      unlockedAvatars: item.type === 'avatar' ? Array.from(new Set([...prev.unlockedAvatars, item.icon])) : prev.unlockedAvatars,
      activeTheme: item.type === 'theme' ? item.id : prev.activeTheme,
      unlockedThemes: item.type === 'theme' ? Array.from(new Set([...prev.unlockedThemes, item.id])) : prev.unlockedThemes
    }));
    
    alert(`Successfully redeemed for ${item.name}!`);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    if (updates.neighborhood) setActiveView('home');
  };

  const handleViewUser = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (user) setViewingUser(user);
  };

  const handleNeighborVerify = (userId: string, action: RewardAction) => {
    const neighbor = MOCK_USERS.find(u => u.id === userId);
    const firstName = neighbor ? neighbor.name.split(' ')[0] : 'Your neighbor';
    triggerConfetti();
    alert(`Legendary! ${firstName} has just received ☘️ ${action.points} Shamrocks thanks to your verification.`);
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="pt-10 pb-20 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-white transition-colors duration-500" 
        style={{ backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.bg || COLORS.emeraldDeep }}>
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
          <span className="text-[200px]">☘️</span>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex flex-col">
            {userProfile.street && (
              <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/50 mb-2 animate-in fade-in duration-1000">
                created by nina regan ryan
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-white">Help Ireland</h1>
            <div className="flex items-center gap-3">
              <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm border border-white/10">Environmental Initiative</span>
              {userProfile.neighborhood && <span className="text-white/70 text-sm font-medium">Active in {userProfile.neighborhood}</span>}
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 flex items-center gap-5 shadow-inner">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-white/60 tracking-[0.2em] mb-1">Available Rewards</span>
              <div className="flex items-center gap-2 text-3xl font-black">
                <span className="text-emerald-400">☘️</span> {userProfile.totalShamrocks.toLocaleString()}
              </div>
            </div>
            <Avatar icon={userProfile.avatar} rank={userProfile.rank} size="md" className="bg-white" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 -mt-12 relative z-20">
        {!userProfile.neighborhood && activeView !== 'profile' ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl border border-emerald-50">
            <div className="text-6xl mb-6">🇮🇪</div>
            <h2 className="text-3xl font-black text-emerald-900 mb-4">Ready to make an impact?</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Join thousands of people across Ireland working together for a cleaner, greener future.</p>
            <button 
              onClick={() => setActiveView('profile')} 
              className="bg-emerald-800 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-emerald-900 active:scale-95 transition-all"
            >
              Get Started
            </button>
          </div>
        ) : (
          <>
            {activeView === 'home' && (
              <div className="space-y-10">
                {/* How It Works Section */}
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-xl border-b-8 border-emerald-600 animate-in fade-in slide-in-from-top duration-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-2xl">ℹ️</div>
                    <h2 className="text-3xl font-black text-emerald-900 leading-tight">How Help Ireland Works</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">📍</div>
                      <h3 className="font-black text-emerald-900 mb-1">1. Register</h3>
                      <p className="text-xs text-gray-500 font-medium">Join your local neighborhood and street.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">🗑️</div>
                      <h3 className="font-black text-emerald-900 mb-1">2. Take Action</h3>
                      <p className="text-xs text-gray-500 font-medium">Complete an eco-task from the list below.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">📸</div>
                      <h3 className="font-black text-emerald-900 mb-1">3. Verify</h3>
                      <p className="text-xs text-gray-500 font-medium">Use photo or ask a neighbor that's in your chat to witness.</p>
                    </div>
                    <div className="flex flex-col items-center text-center group">
                      <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform shadow-sm">🎁</div>
                      <h3 className="font-black text-emerald-900 mb-1">4. Get Rewards</h3>
                      <p className="text-xs text-gray-500 font-medium">Earn Shamrocks for avatars, themes and glory.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  <div className="lg:col-span-2 space-y-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {REWARD_ACTIONS.map((action) => (
                        <ActionCard key={action.id} action={action} onSelect={setSelectedAction} />
                      ))}
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] border-l-8 shadow-xl" style={{ borderColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.bg || COLORS.emeraldDeep }}>
                      <h3 className="text-2xl font-black text-emerald-900 mb-2">Our Mission</h3>
                      <p className="text-gray-600 leading-relaxed italic">
                        "Help Ireland connects local communities with simple, impactful environmental actions. By working together at a neighborhood level, we can protect our heritage and landscape for generations to come."
                      </p>
                    </div>
                  </div>
                  <div className="space-y-10">
                    <Leaderboard 
                      entries={countyLeaderboard} 
                      currentUserPoints={userProfile.totalShamrocks} 
                      currentUserCounty={userProfile.county}
                      onViewUser={handleViewUser} 
                    />
                    <div className="bg-emerald-900 p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl" 
                      style={{ backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.accent || COLORS.emeraldMid }}>
                      <div className="relative z-10">
                        <h4 className="text-2xl font-black mb-2">Badge System</h4>
                        <p className="text-white/70 text-sm mb-6">Earn exclusive honors for your commitment to the environment.</p>
                        <button 
                          onClick={() => setActiveView('profile')}
                          className="w-full py-4 bg-white text-emerald-900 font-bold rounded-2xl hover:bg-emerald-50 transition-colors shadow-lg"
                        >
                          View My Badges
                        </button>
                      </div>
                      <span className="absolute -bottom-6 -right-6 text-9xl opacity-10 group-hover:scale-125 transition-transform duration-700">🏅</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'chat' && (
              <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom duration-500">
                <NeighborhoodChat user={userProfile} onViewUser={handleViewUser} />
              </div>
            )}

            {activeView === 'games' && (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <WildlifeGames onEarnPoints={handleEarnPoints} />
              </div>
            )}

            {activeView === 'profile' && (
              <ProfilePage 
                user={userProfile} 
                onUpdate={updateProfile} 
                onPurchase={handlePurchase}
              />
            )}
          </>
        )}
      </main>

      {selectedAction && (
        <VerificationModal 
          action={selectedAction} 
          onClose={() => setSelectedAction(null)} 
          onSuccess={handleActionComplete} 
        />
      )}

      {viewingUser && (
        <UserProfileView 
          user={viewingUser} 
          onClose={() => setViewingUser(null)} 
          onVerifyForUser={handleNeighborVerify}
        />
      )}

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-emerald-100 flex items-center p-3 z-50 shadow-2xl rounded-[2.5rem] w-[95%] max-w-xl">
        <button 
          onClick={() => setActiveView('home')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'home' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'home' ? { backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">🌍</span>
          <span className="text-[10px] font-bold uppercase mt-1">Actions</span>
        </button>
        <button 
          onClick={() => setActiveView('chat')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'chat' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'chat' ? { backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">💬</span>
          <span className="text-[10px] font-bold uppercase mt-1">Chat</span>
        </button>
        <button 
          onClick={() => setActiveView('games')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'games' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'games' ? { backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">🦉</span>
          <span className="text-[10px] font-bold uppercase mt-1">Games</span>
        </button>
        <button 
          onClick={() => setActiveView('profile')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'profile' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'profile' ? { backgroundColor: SHOP_ITEMS.find(t => t.id === userProfile.activeTheme)?.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">👤</span>
          <span className="text-[10px] font-bold uppercase mt-1">Profile</span>
        </button>
      </nav>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
          <style>{`@keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
          {[...Array(40)].map((_, i) => (
            <div key={i} className="absolute text-4xl" style={{
              left: `${Math.random() * 100}%`, top: `-40px`,
              animation: `confetti ${2 + Math.random() * 3}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}>
              {['☘️', '🌿', '✨', '💎', '🏅'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
