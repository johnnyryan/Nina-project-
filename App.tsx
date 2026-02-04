
import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, RewardAction, AppView, ShopItem, Badge, ActionType, LeaderboardEntry, ChatMessage } from './types';
import { REWARD_ACTIONS, COLORS, SHOP_ITEMS, BADGES } from './constants';
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

/**
 * LIVE DATABASE SERVICE
 * Simulates an asynchronous, persistent backend for communities across Ireland.
 */
export const LiveDatabase = {
  getUsers: async (): Promise<UserProfile[]> => {
    const data = localStorage.getItem('help_ireland_db_users');
    return data ? JSON.parse(data) : [];
  },
  saveUser: async (user: UserProfile) => {
    const users = await LiveDatabase.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) users[index] = user;
    else users.push(user);
    localStorage.setItem('help_ireland_db_users', JSON.stringify(users));
  },
  getRoomMessages: async (roomKey: string): Promise<ChatMessage[]> => {
    const data = localStorage.getItem(`help_ireland_db_chat_${roomKey}`);
    return data ? JSON.parse(data) : [];
  },
  pushMessage: async (roomKey: string, msg: ChatMessage) => {
    const messages = await LiveDatabase.getRoomMessages(roomKey);
    messages.push(msg);
    localStorage.setItem(`help_ireland_db_chat_${roomKey}`, JSON.stringify(messages));
  }
};

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('help-ireland-current-session');
    if (saved) return JSON.parse(saved);
    return {
      id: 'hi-' + Math.random().toString(36).substr(2, 9),
      name: '', county: '', neighborhood: '', street: '', communityGroups: [], bio: '', avatar: '👤',
      activeTheme: 'th_default',
      totalShamrocks: 0, goldenShamrocks: 0,
      isMaster: false, isCaptain: false, isAssistantCaptain: false,
      completedActions: 0, completedActionTypes: [],
      joinedDate: new Date().toISOString(),
      badges: [], unlockedAvatars: ['👤'], unlockedThemes: ['th_default'], rank: 0
    };
  });

  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [showIntegrityNotice, setShowIntegrityNotice] = useState<boolean>(() => {
    return localStorage.getItem('help-ireland-integrity-v1') !== 'true';
  });

  const [activeView, setActiveView] = useState<AppView>(userProfile.neighborhood ? 'home' : 'profile');
  const [selectedAction, setSelectedAction] = useState<RewardAction | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // Sync session and "Database"
  useEffect(() => {
    localStorage.setItem('help-ireland-current-session', JSON.stringify(userProfile));
    LiveDatabase.saveUser(userProfile);
    LiveDatabase.getUsers().then(setAllUsers);
  }, [userProfile]);

  const activeThemeItem = SHOP_ITEMS.find(t => t.id === userProfile.activeTheme) || SHOP_ITEMS.find(t => t.id === 'th_default')!;

  const leaderboardData = useMemo(() => {
    const displayUsers = allUsers.length > 0 ? allUsers : [userProfile];
    return displayUsers
      .filter(u => u.county === userProfile.county && u.neighborhood !== '')
      .map(u => ({
        id: u.id, name: u.name, points: u.totalShamrocks, county: u.county, avatar: u.avatar,
        isCurrentUser: u.id === userProfile.id
      }))
      .sort((a, b) => b.points - a.points);
  }, [allUsers, userProfile]);

  useEffect(() => {
    const myRank = leaderboardData.findIndex(e => e.id === userProfile.id) + 1;
    const newBadges = [...userProfile.badges];

    if (userProfile.totalShamrocks > 0) { 
      if (myRank === 1 && !newBadges.includes('rank1')) newBadges.push('rank1');
      if (myRank === 2 && !newBadges.includes('rank2')) newBadges.push('rank2');
    }

    if (newBadges.length !== userProfile.badges.length || userProfile.rank !== myRank) {
      setUserProfile(prev => ({ ...prev, badges: newBadges, rank: myRank }));
    }
  }, [userProfile.totalShamrocks, leaderboardData]);

  const handleIntegrityPledge = () => {
    localStorage.setItem('help-ireland-integrity-v1', 'true');
    setShowIntegrityNotice(false);
  };

  const handleActionComplete = (points: number, actionId: ActionType) => {
    setUserProfile(prev => ({
      ...prev,
      totalShamrocks: prev.totalShamrocks + points,
      completedActions: prev.completedActions + 1,
      completedActionTypes: prev.completedActionTypes.includes(actionId) ? prev.completedActionTypes : [...prev.completedActionTypes, actionId]
    }));
    setSelectedAction(null);
    triggerConfetti();
  };

  const handleEarnPoints = (points: number) => {
    setUserProfile(prev => ({ ...prev, totalShamrocks: prev.totalShamrocks + points }));
    triggerConfetti();
  };

  // Helper to handle user viewing from UI components that pass a userId string
  const handleViewUser = (userId: string) => {
    const found = allUsers.find(u => u.id === userId);
    if (found) {
      setViewingUser(found);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    if (updates.neighborhood) setActiveView('home');
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  return (
    <div className="min-h-screen pb-28 text-emerald-950">
      {showIntegrityNotice && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white rounded-[3rem] max-w-lg w-full p-10 text-center shadow-2xl border-4 border-emerald-500">
            <div className="text-6xl mb-6">☘️🤝</div>
            <h2 className="text-3xl font-black text-emerald-900 mb-4">Integrity Pledge</h2>
            <p className="text-emerald-800 font-bold italic mb-8">"Please don't cheat, I hope that you will help not cheat."</p>
            <button onClick={handleIntegrityPledge} className="w-full py-5 bg-emerald-800 text-white font-black rounded-3xl uppercase tracking-widest">I Pledge to be Honest</button>
          </div>
        </div>
      )}

      <header className="pt-10 pb-20 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-white" 
        style={{ backgroundImage: `${activeThemeItem.themeConfig?.pattern}, ${activeThemeItem.themeConfig?.bg}` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">Help Ireland</h1>
            <div className="flex items-center gap-3">
              <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/80">Real-Time Community DB</span>
              {userProfile.neighborhood && <span className="text-white/70 text-sm font-medium">Active in {userProfile.neighborhood}</span>}
            </div>
          </div>
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 flex items-center gap-5">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-white/60 mb-1">Total Shamrocks</span>
              <div className="flex items-center gap-2 text-3xl font-black">☘️ {userProfile.totalShamrocks.toLocaleString()}</div>
            </div>
            <Avatar icon={userProfile.avatar} rank={userProfile.rank} size="md" className="bg-white" />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 -mt-12 relative z-20">
        {!userProfile.neighborhood && activeView !== 'profile' ? (
          <div className="text-center py-20 bg-white rounded-[3rem] shadow-xl">
            <h2 className="text-3xl font-black text-emerald-900 mb-6 italic">Ready to make an impact?</h2>
            <button onClick={() => setActiveView('profile')} className="bg-emerald-800 text-white px-10 py-4 rounded-2xl font-bold">Register Profile</button>
          </div>
        ) : (
          <>
            {activeView === 'home' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {REWARD_ACTIONS.map(action => <ActionCard key={action.id} action={action} onSelect={setSelectedAction} />)}
                  </div>
                </div>
                <div className="space-y-10">
                  <Leaderboard entries={leaderboardData} currentUserPoints={userProfile.totalShamrocks} currentUserCounty={userProfile.county} onViewUser={handleViewUser} />
                </div>
              </div>
            )}
            {activeView === 'chat' && <NeighborhoodChat user={userProfile} onViewUser={handleViewUser} onClose={() => setActiveView('home')} />}
            {activeView === 'games' && <WildlifeGames onEarnPoints={handleEarnPoints} onClose={() => setActiveView('home')} />}
            {activeView === 'profile' && <ProfilePage user={userProfile} onUpdate={updateProfile} onPurchase={item => { if (userProfile.totalShamrocks >= item.cost) handleEarnPoints(-item.cost); }} onClose={() => setActiveView('home')} />}
            {activeView === 'about' && <AboutPage onClose={() => setActiveView('home')} />}
          </>
        )}
      </main>

      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-emerald-100 flex items-center p-3 z-50 shadow-2xl rounded-[2.5rem] w-[95%] max-w-2xl">
        {[
          { id: 'home', icon: '🌍', label: 'Actions' },
          { id: 'chat', icon: '💬', label: 'Chat' },
          { id: 'games', icon: '🦉', label: 'Games' },
          { id: 'about', icon: '✨', label: 'About' },
          { id: 'profile', icon: '👤', label: 'Profile' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveView(item.id as AppView)} 
            className={`flex flex-col items-center flex-1 transition-all py-2 px-1 rounded-2xl ${activeView === item.id ? 'bg-emerald-800 text-white shadow-lg' : 'text-emerald-950/40 hover:text-emerald-600'}`}
            style={activeView === item.id ? { backgroundColor: activeThemeItem.themeConfig?.accent || '' } : {}}>
            <span className="text-2xl">{item.icon}</span>
            <span className="text-[10px] font-bold uppercase mt-1">{item.label}</span>
          </button>
        ))}
      </nav>

      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
          <style>{`@keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity: 1; } 100% { transform: translateY(100vh) rotate(360deg); opacity: 0; } }`}</style>
          {[...Array(20)].map((_, i) => <div key={i} className="absolute text-4xl" style={{ left: `${Math.random() * 100}%`, top: `-40px`, animation: `confetti ${2 + Math.random() * 3}s linear infinite` }}>☘️</div>)}
        </div>
      )}
      
      {selectedAction && <VerificationModal action={selectedAction} onClose={() => setSelectedAction(null)} onSuccess={handleActionComplete} onRequestWitness={() => {}} />}
      {viewingUser && <UserProfileView user={viewingUser} currentUserNeighborhood={userProfile.neighborhood} onClose={() => setViewingUser(null)} onVerifyForUser={() => {}} />}
    </div>
  );
};

export default App;