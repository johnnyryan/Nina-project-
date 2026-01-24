
import React, { useState, useEffect } from 'react';
import { UserProfile, RewardAction, AppView, ShopItem } from './types';
import { REWARD_ACTIONS, MOCK_LEADERBOARD, MOCK_USERS, COLORS, SHOP_ITEMS } from './constants';
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
    const saved = localStorage.getItem('help-ireland-profile-v4');
    return saved ? JSON.parse(saved) : {
      id: 'me',
      name: '',
      neighborhood: '',
      street: '',
      communityGroups: [],
      bio: '',
      avatar: '👤',
      totalShamrocks: 100, // Starting bonus
      completedActions: 0,
      joinedDate: new Date().toLocaleDateString('en-IE', { month: 'long', year: 'numeric' }),
      badges: [],
      unlockedAvatars: ['👤'],
      rank: 0
    };
  });

  const [activeView, setActiveView] = useState<AppView>(
    userProfile.neighborhood ? 'home' : 'profile'
  );
  const [selectedAction, setSelectedAction] = useState<RewardAction | null>(null);
  const [viewingUser, setViewingUser] = useState<UserProfile | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Calculate current rank
    const sorted = [...MOCK_LEADERBOARD, { id: 'me', name: 'You', points: userProfile.totalShamrocks }]
      .sort((a, b) => b.points - a.points);
    const myRank = sorted.findIndex(e => e.id === 'me') + 1;
    
    // Manage rank-based badges
    const newBadges = userProfile.badges.filter(b => !['rank1', 'rank2', 'rank3'].includes(b));
    if (myRank === 1) newBadges.push('rank1');
    if (myRank === 2) newBadges.push('rank2');
    if (myRank === 3) newBadges.push('rank3');

    // Only update if something changed to avoid infinite loops
    if (userProfile.rank !== myRank || newBadges.length !== userProfile.badges.length) {
      setUserProfile(prev => ({ ...prev, rank: myRank, badges: newBadges }));
    }
    
    localStorage.setItem('help-ireland-profile-v4', JSON.stringify(userProfile));
  }, [userProfile.totalShamrocks, userProfile.rank]);

  const handleActionComplete = (points: number) => {
    setUserProfile(prev => ({
      ...prev,
      totalShamrocks: prev.totalShamrocks + points,
      completedActions: prev.completedActions + 1
    }));
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
      unlockedAvatars: item.type === 'avatar' ? [...prev.unlockedAvatars, item.icon] : prev.unlockedAvatars
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
    setViewingUser(null);
    alert(`Deed verified for ${userId === '1' ? 'Patrick' : 'your neighbor'}. Community impact points awarded!`);
    triggerConfetti();
  };

  return (
    <div className="min-h-screen pb-28">
      <header className="pt-10 pb-20 px-8 rounded-b-[4rem] shadow-2xl relative overflow-hidden text-white" style={{ backgroundColor: COLORS.emeraldDeep }}>
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none select-none">
          <span className="text-[200px]">☘️</span>
        </div>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">Help Ireland</h1>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-800/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-emerald-200 backdrop-blur-sm border border-emerald-700">Environmental Initiative</span>
              {userProfile.neighborhood && <span className="text-emerald-100/70 text-sm font-medium">Active in {userProfile.neighborhood}</span>}
            </div>
          </div>
          
          <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10 flex items-center gap-5 shadow-inner">
            <div className="flex flex-col items-end">
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-[0.2em] mb-1">Available Rewards</span>
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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {REWARD_ACTIONS.map((action) => (
                      <ActionCard key={action.id} action={action} onSelect={setSelectedAction} />
                    ))}
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border-l-8 border-emerald-800 shadow-xl">
                    <h3 className="text-2xl font-black text-emerald-900 mb-2">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed italic">
                      "Help Ireland connects local communities with simple, impactful environmental actions. By working together at a neighborhood level, we can protect our heritage and landscape for generations to come."
                    </p>
                  </div>
                </div>
                <div className="space-y-10">
                  <Leaderboard entries={MOCK_LEADERBOARD} currentUserPoints={userProfile.totalShamrocks} onViewUser={handleViewUser} />
                  <div className="bg-emerald-900 p-8 rounded-[3rem] text-white relative overflow-hidden group shadow-2xl">
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black mb-2">Badge System</h4>
                      <p className="text-emerald-200 text-sm mb-6">Earn exclusive honors for your commitment to the environment.</p>
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
        >
          <span className="text-2xl">🌍</span>
          <span className="text-[10px] font-bold uppercase mt-1">Actions</span>
        </button>
        <button 
          onClick={() => setActiveView('chat')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'chat' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
        >
          <span className="text-2xl">💬</span>
          <span className="text-[10px] font-bold uppercase mt-1">Chat</span>
        </button>
        <button 
          onClick={() => setActiveView('games')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'games' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
        >
          <span className="text-2xl">🦉</span>
          <span className="text-[10px] font-bold uppercase mt-1">Games</span>
        </button>
        <button 
          onClick={() => setActiveView('profile')} 
          className={`flex flex-col items-center flex-1 transition-all py-2 rounded-2xl ${activeView === 'profile' ? 'bg-emerald-800 text-white shadow-lg' : 'text-gray-400 hover:text-emerald-600'}`}
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
