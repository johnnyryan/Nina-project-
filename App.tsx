
import React, { useState, useEffect } from 'react';
import { UserProfile, RewardAction, AppView, ShopItem, Badge, ActionType, LeaderboardEntry, ChatMessage } from './types';
import { REWARD_ACTIONS, MOCK_LEADERBOARD, MOCK_USERS, COLORS, SHOP_ITEMS, BADGES } from './constants';
import { ActionCard } from './components/ActionCard';
import { Leaderboard } from './components/Leaderboard';
import { ChatLeaderboard } from './components/ChatLeaderboard';
import { VerificationModal } from './components/VerificationModal';
import { ProfilePage } from './components/ProfilePage';
import { NeighborhoodChat } from './components/NeighborhoodChat';
import { UserProfileView } from './components/UserProfileView';
import { Avatar } from './components/Avatar';
import { WildlifeGames } from './components/WildlifeGames';
import { AboutPage } from './components/AboutPage';

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
      totalShamrocks: 0, // Users now start with zero shamrock points
      goldenShamrocks: 0,
      isMaster: false,
      isCaptain: false,
      isAssistantCaptain: false,
      hasCaptainTickedGoal: false,
      hasAssistantTickedGoal: false,
      completedActions: 0,
      completedActionTypes: [],
      joinedDate: new Date().toISOString(),
      badges: [],
      unlockedAvatars: ['👤'],
      unlockedThemes: ['th_default'],
      rank: 0
    };
  });

  const [showIntegrityNotice, setShowIntegrityNotice] = useState<boolean>(() => {
    return localStorage.getItem('help-ireland-integrity-v1') !== 'true';
  });

  const [activeView, setActiveView] = useState<AppView>(
    userProfile.neighborhood ? 'home' : 'profile'
  );
  const [selectedAction, setSelectedAction] = useState<RewardAction | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const activeThemeItem = SHOP_ITEMS.find(t => t.id === userProfile.activeTheme) || SHOP_ITEMS.find(t => t.id === 'th_default')!;

  const countyLeaderboard = MOCK_LEADERBOARD.filter(e => e.county === userProfile.county);

  useEffect(() => {
    const sorted = [...countyLeaderboard, { id: 'me', name: 'You', points: userProfile.totalShamrocks, county: userProfile.county }]
      .sort((a, b) => b.points - a.points);
    const myRank = sorted.findIndex(e => e.id === 'me') + 1;
    
    const newBadges = [...userProfile.badges];
    let newUnlockedAvatars = [...userProfile.unlockedAvatars];

    const allAvailableBadgesCount = BADGES.length;
    const purchasableAvatarsCount = SHOP_ITEMS.filter(i => i.type === 'avatar' && !i.earnedOnly).length + 1;
    const purchasableThemesCount = SHOP_ITEMS.filter(i => i.type === 'theme').length;
    
    const hasAllAvatars = newUnlockedAvatars.length >= purchasableAvatarsCount;
    const hasAllThemes = userProfile.unlockedThemes.length >= purchasableThemesCount;
    const hasAllBadges = newBadges.length >= allAvailableBadgesCount;
    
    const isMaster = hasAllAvatars && hasAllThemes && hasAllBadges;

    const neighborhoodNeighbors = MOCK_USERS.filter(u => u.neighborhood === userProfile.neighborhood);
    const neighborCount = neighborhoodNeighbors.length;
    
    const isFirstJoiner = userProfile.neighborhood !== '' && neighborCount === 0;
    const isCaptain = isMaster || isFirstJoiner;
    const isAssistantCaptain = !isCaptain && neighborCount === 1; 

    if (userProfile.totalShamrocks > 0) { 
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

    const totalActionTypes = Object.keys(ActionType).length;
    if (userProfile.completedActionTypes.length >= totalActionTypes && !newBadges.includes('b_all_actions')) {
      newBadges.push('b_all_actions');
    }

    const joinedDate = new Date(userProfile.joinedDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - joinedDate.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

    if (diffYears >= 1 && !newBadges.includes('b_year1')) newBadges.push('b_year1');
    if (diffYears >= 5 && !newBadges.includes('b_year5')) newBadges.push('b_year5');
    if (diffYears >= 10 && !newBadges.includes('b_year10')) newBadges.push('b_year10');

    newBadges.forEach(badgeId => {
      const badgeObj = BADGES.find(b => b.id === badgeId);
      if (badgeObj && !newUnlockedAvatars.includes(badgeObj.icon)) newUnlockedAvatars.push(badgeObj.icon);
    });

    const badgesChanged = JSON.stringify(newBadges.sort()) !== JSON.stringify([...userProfile.badges].sort());
    const avatarsChanged = JSON.stringify(newUnlockedAvatars.sort()) !== JSON.stringify([...userProfile.unlockedAvatars].sort());

    if (userProfile.rank !== myRank || badgesChanged || avatarsChanged || userProfile.isMaster !== isMaster || userProfile.isCaptain !== isCaptain || userProfile.isAssistantCaptain !== isAssistantCaptain) {
      setUserProfile(prev => ({ 
        ...prev, 
        rank: myRank, 
        badges: newBadges,
        unlockedAvatars: newUnlockedAvatars,
        isMaster,
        isCaptain,
        isAssistantCaptain
      }));
    }
    
    localStorage.setItem('help-ireland-profile-v5', JSON.stringify(userProfile));
  }, [userProfile.totalShamrocks, userProfile.completedActions, userProfile.rank, userProfile.joinedDate, userProfile.completedActionTypes, userProfile.county, userProfile.neighborhood, userProfile.unlockedThemes, userProfile.badges, userProfile.unlockedAvatars]);

  const handleIntegrityPledge = () => {
    localStorage.setItem('help-ireland-integrity-v1', 'true');
    setShowIntegrityNotice(false);
  };

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

  const handleIssueGoal = (goal: string) => {
    setUserProfile(prev => ({
      ...prev,
      weeklyGoalSetAt: new Date().toISOString(),
      activeGoal: goal,
      hasCaptainTickedGoal: false,
      hasAssistantTickedGoal: false
    }));
    triggerConfetti();
    alert(`Weekly Goal Issued! 🏆 Team mission: "${goal}"`);
  };

  const handleRequestWitness = (action: RewardAction) => {
    const witnessMsg: ChatMessage = {
      id: `witness_${Date.now()}`,
      userId: userProfile.id,
      userName: userProfile.name,
      userAvatar: userProfile.avatar,
      text: `📢 WITNESS REQUEST: I need a neighbor to verify my ${action.title}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomType: 'neighborhood',
      roomName: userProfile.neighborhood,
      verificationActionId: action.id,
      isVerified: false
    };
    setChatMessages(prev => [...prev, witnessMsg]);
  };

  const handleTickGoal = (role: 'captain' | 'assistant') => {
    setUserProfile(prev => {
      const newState = { ...prev };
      if (role === 'captain') newState.hasCaptainTickedGoal = true;
      if (role === 'assistant') newState.hasAssistantTickedGoal = true;

      if (newState.hasCaptainTickedGoal && newState.hasAssistantTickedGoal) {
        newState.goldenShamrocks += 1000;
        newState.activeGoal = undefined;
        newState.hasCaptainTickedGoal = false;
        newState.hasAssistantTickedGoal = false;
        triggerConfetti();
        alert(`Mission Complete! Both Captain and Assistant Captain have verified the cleanup. +1,000 Golden Shamrocks awarded to the neighborhood! 🏆✨`);
      }
      return newState;
    });
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
      {showIntegrityNotice && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 text-center shadow-2xl border-4 border-emerald-500 animate-in zoom-in duration-300">
            <div className="text-6xl mb-6">☘️🤝</div>
            <h2 className="text-3xl font-black text-emerald-900 mb-4">Integrity Pledge</h2>
            <p className="text-xl text-emerald-800 font-bold italic mb-8 leading-relaxed">
              "Please don't cheat, I hope that you will help not cheat."
            </p>
            <p className="text-gray-500 mb-10 text-sm">
              Help Ireland is built on community trust. Our environment depends on real actions. By continuing, you agree to be honest in your reporting.
            </p>
            <button 
              onClick={handleIntegrityPledge}
              className="w-full py-5 bg-emerald-800 text-white font-black rounded-3xl shadow-xl hover:bg-black transition-all active:scale-95 text-lg uppercase tracking-widest"
            >
              I Pledge to be Honest
            </button>
          </div>
        </div>
      )}

      <header className="pt-10 pb-20 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-white transition-all duration-700" 
        style={{ 
          backgroundImage: `${activeThemeItem.themeConfig?.pattern}, ${activeThemeItem.themeConfig?.bg}`
        }}>
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
          <span className="text-[200px]">{activeThemeItem.icon}</span>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter text-white">Help Ireland</h1>
            <div className="flex items-center gap-3">
              <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 backdrop-blur-sm border border-white/10">Environmental Initiative</span>
              {userProfile.neighborhood && <span className="text-white/70 text-sm font-medium">Active in {userProfile.neighborhood}</span>}
              {(userProfile.isCaptain || userProfile.isAssistantCaptain) && (
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-white/20 animate-pulse">
                   {userProfile.isMaster ? '👑 Shamrock Master' : userProfile.isCaptain ? '👑 Chat Captain' : '🥈 Assistant Captain'}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 flex items-center gap-5 shadow-inner">
              <div className="flex flex-col items-end">
                <span className="text-[10px] uppercase font-bold text-white/60 tracking-[0.2em] mb-1">Shamrocks</span>
                <div className="flex items-center gap-2 text-3xl font-black">
                  <span className="text-emerald-400">☘️</span> {userProfile.totalShamrocks.toLocaleString()}
                </div>
              </div>
              <Avatar icon={userProfile.avatar} rank={userProfile.rank} isCaptain={userProfile.isCaptain} isAssistantCaptain={userProfile.isAssistantCaptain} size="md" className="bg-white" />
            </div>

            {(userProfile.isMaster || userProfile.goldenShamrocks > 0) && (
              <div className="bg-yellow-400/20 p-4 rounded-3xl backdrop-blur-md border border-yellow-400/30 flex items-center gap-5 shadow-inner">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-[0.2em] mb-1">Golden</span>
                  <div className="flex items-center gap-2 text-3xl font-black text-yellow-400">
                    <span className="animate-spin-slow">✨</span> {userProfile.goldenShamrocks.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
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
                {userProfile.activeGoal && (
                  <div className="bg-amber-50 border-4 border-amber-400 p-6 rounded-[2.5rem] shadow-lg animate-in zoom-in duration-500 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="text-5xl">👑</div>
                      <div>
                        <h4 className="text-amber-900 font-black uppercase tracking-widest text-sm mb-1">Active Team Goal</h4>
                        <p className="text-amber-800 text-xl font-bold italic">"{userProfile.activeGoal}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${userProfile.hasCaptainTickedGoal ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-700'}`}>Capt. {userProfile.hasCaptainTickedGoal ? '✓' : '...'}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${userProfile.hasAssistantTickedGoal ? 'bg-emerald-500 text-white' : 'bg-amber-200 text-amber-700'}`}>Asst. {userProfile.hasAssistantTickedGoal ? '✓' : '...'}</span>
                      </div>
                      <div className="bg-amber-400 text-amber-900 px-6 py-2 rounded-2xl font-black text-sm uppercase text-center">Verification Pending</div>
                    </div>
                  </div>
                )}

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
                      <p className="text-xs text-gray-500 font-medium">Use photo or ask a neighbor in chat to witness.</p>
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
                  </div>
                  <div className="space-y-10">
                    <Leaderboard 
                      entries={countyLeaderboard} 
                      currentUserPoints={userProfile.totalShamrocks} 
                      currentUserCounty={userProfile.county}
                      onViewUser={handleViewUser} 
                    />
                    <button 
                      onClick={() => setActiveView('chat-leaderboard')}
                      className="w-full bg-emerald-900 p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl flex flex-col text-left transition-all hover:scale-[1.02]"
                      style={{ 
                        backgroundImage: `${activeThemeItem.themeConfig?.pattern}, ${activeThemeItem.themeConfig?.bg}`
                      }}
                    >
                      <h4 className="text-2xl font-black mb-2">Chat Leaderboard</h4>
                      <p className="text-white/70 text-sm mb-6">See which neighborhood is making the biggest splash in Ireland.</p>
                      <span className="mt-auto px-6 py-2 bg-white text-emerald-900 font-bold rounded-xl text-center">View Global Rankings</span>
                      <span className="absolute -bottom-6 -right-6 text-9xl opacity-10 group-hover:scale-125 transition-transform duration-700">🏆</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeView === 'chat' && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom duration-500">
                <NeighborhoodChat 
                  user={userProfile} 
                  onViewUser={handleViewUser} 
                  onGoalAward={handleIssueGoal}
                  onTickGoal={handleTickGoal}
                  externalMessages={chatMessages}
                  onClose={() => setActiveView('home')}
                />
              </div>
            )}

            {activeView === 'chat-leaderboard' && (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <ChatLeaderboard onBack={() => setActiveView('home')} />
              </div>
            )}

            {activeView === 'games' && (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <WildlifeGames onEarnPoints={handleEarnPoints} onClose={() => setActiveView('home')} />
              </div>
            )}

            {activeView === 'profile' && (
              <ProfilePage 
                user={userProfile} 
                onUpdate={updateProfile} 
                onPurchase={handlePurchase}
                onClose={() => setActiveView('home')}
              />
            )}

            {activeView === 'about' && (
              <AboutPage onClose={() => setActiveView('home')} />
            )}
          </>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-emerald-100 flex items-center p-3 z-50 shadow-2xl rounded-[2.5rem] w-[95%] max-w-2xl overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveView('home')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl min-w-[70px] ${activeView === 'home' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'home' ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">🌍</span>
          <span className="text-[10px] font-bold uppercase mt-1">Actions</span>
        </button>
        <button 
          onClick={() => setActiveView('chat')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl min-w-[70px] ${activeView === 'chat' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'chat' ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">💬</span>
          <span className="text-[10px] font-bold uppercase mt-1">Chat</span>
        </button>
        <button 
          onClick={() => setActiveView('games')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl min-w-[70px] ${activeView === 'games' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'games' ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">🦉</span>
          <span className="text-[10px] font-bold uppercase mt-1">Games</span>
        </button>
        <button 
          onClick={() => setActiveView('about')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl min-w-[70px] ${activeView === 'about' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'about' ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}
        >
          <span className="text-2xl">✨</span>
          <span className="text-[10px] font-bold uppercase mt-1">About</span>
        </button>
        <button 
          onClick={() => setActiveView('profile')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl min-w-[70px] ${activeView === 'profile' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
          style={activeView === 'profile' ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}
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
              {['☘️', '🌿', '✨', '💎', '🏅', '👑'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
      )}
      
      {selectedAction && (
        <VerificationModal 
          action={selectedAction} 
          onClose={() => setSelectedAction(null)} 
          onSuccess={handleActionComplete}
          onRequestWitness={handleRequestWitness}
        />
      )}

      {viewingUser && (
        <UserProfileView 
          user={viewingUser} 
          currentUserNeighborhood={userProfile.neighborhood}
          onClose={() => setViewingUser(null)}
          onVerifyForUser={handleNeighborVerify}
        />
      )}
    </div>
  );
};

export default App;
