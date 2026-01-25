
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage, ActionType } from '../types';
import { MOCK_USERS } from '../constants';
import { Avatar } from './Avatar';

interface NeighborhoodChatProps {
  user: UserProfile;
  onViewUser: (userId: string) => void;
  onGoalAward: (goal: string) => void;
  onTickGoal: (role: 'captain' | 'assistant') => void;
  onClose: () => void;
  externalMessages?: ChatMessage[];
}

const PROFANITY_WORDS = [
  'fuck', 'shit', 'bitch', 'bullshit', 'crap',
  'feck', 'shite', 'gobshite', 'arse', 'twat', 'wank', 'bollocks'
];

const WEEKLY_GOALS = [
  "Clean up near the local GAA pitch! 🗑️",
  "Tidy the rubbish near the community center! 🧹",
  "Pick up litter by the Grand Canal path! 💧",
  "Clear the plastic from the local park entrance! 🌳",
  "Clean up the area near the old stone bridge! 🪨",
  "Tidy the school zone bus stop area! 🚌",
  "Remove waste from the neighborhood recycling bank! ♻️",
  "Clean up near the local library steps! 📚",
  "Tidy the path leading to the church! ⛪",
  "Clear litter from the main street crossroads! 📍",
  "Sweep the leaves near the historical monument! 🏰",
  "Clear debris from the coastal walkway! 🌊",
  "Remove weeds from the community playground! 🛝"
];

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export const NeighborhoodChat: React.FC<NeighborhoodChatProps> = ({ user, onViewUser, onGoalAward, onTickGoal, onClose, externalMessages = [] }) => {
  const [activeRoom, setActiveRoom] = useState<{type: 'neighborhood' | 'street' | 'group' | 'leadership', name: string}>({
    type: 'neighborhood',
    name: user.neighborhood
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<{ type: 'image' | 'video', file: File, url: string } | null>(null);
  const [showGoalPanel, setShowGoalPanel] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter mock members for the neighborhood
  const roomMembers = MOCK_USERS.filter(u => u.neighborhood === user.neighborhood || u.id === user.id);

  useEffect(() => {
    let initialText = `Welcome to the ${activeRoom.name} community. Captain & Assistant Captain: Tap the chat name to verify cleanups!`;
    let systemIcon = '🛡️';
    
    if (activeRoom.type === 'leadership') {
      initialText = `Welcome to the Leadership Lounge. This is a private channel for the Captain and Assistant Captain of ${user.neighborhood}. Coordinate your missions here!`;
      systemIcon = '🏰';
    }

    setMessages(prev => [
      ...prev.filter(m => m.userId !== 'system'),
      {
        id: '1',
        userId: 'system',
        userName: 'Shamrock Sentry',
        userAvatar: systemIcon,
        text: initialText,
        timestamp: '9:00 AM',
        roomType: activeRoom.type,
        roomName: activeRoom.name
      }
    ]);
  }, [activeRoom, user.neighborhood]);

  useEffect(() => {
    if (externalMessages.length > 0) {
      setMessages(prev => {
        const newMsgs = externalMessages.filter(em => !prev.find(p => p.id === em.id));
        return [...prev, ...newMsgs];
      });
    }
  }, [externalMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filterProfanity = (text: string) => {
    let filtered = text;
    PROFANITY_WORDS.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      filtered = filtered.replace(regex, '☘️☘️☘️');
    });
    return filtered;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      const url = URL.createObjectURL(file);
      setAttachment({ type, file, url });
    }
  };

  const handleSend = (textOverride?: string, isGoal?: boolean) => {
    const content = textOverride || newMessage;
    if (!content.trim() && !attachment) return;
    
    const cleanText = filterProfanity(content);
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomType: activeRoom.type,
      roomName: activeRoom.name,
      isGoal: isGoal,
      isCaptain: user.isCaptain,
      isAssistantCaptain: user.isAssistantCaptain,
      attachment: attachment ? { type: attachment.type, url: attachment.url } : undefined
    };

    setMessages([...messages, msg]);
    if (!textOverride) setNewMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (isGoal) {
      onGoalAward(content.replace("📢 WEEKLY MISSION RECEIVED: ", ""));
    }
  };

  const handleVerifyRequest = (msgId: string, actionId: ActionType) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isVerified: true } : m));
    localStorage.setItem(`verify_confirm_${actionId}`, 'true');
    alert("Action verified! Your neighbor has received their Shamrocks. Proper order!");
  };

  const handleCheckMission = () => {
    const lastGoalDate = user.weeklyGoalSetAt ? new Date(user.weeklyGoalSetAt) : null;
    const now = new Date();
    
    if (lastGoalDate && (now.getTime() - lastGoalDate.getTime()) < ONE_WEEK_MS) {
      const nextDate = new Date(lastGoalDate.getTime() + ONE_WEEK_MS);
      alert(`No new missions yet, Captain! Your next mission will be available after ${nextDate.toLocaleDateString()} at ${nextDate.toLocaleTimeString()}.`);
      return;
    }

    const randomGoal = WEEKLY_GOALS[Math.floor(Math.random() * WEEKLY_GOALS.length)];
    const goalText = `📢 WEEKLY MISSION RECEIVED: ${randomGoal}`;
    handleSend(goalText, true);
  };

  const handleTick = () => {
    if (user.isCaptain) onTickGoal('captain');
    else if (user.isAssistantCaptain) onTickGoal('assistant');
  };

  const rooms = [
    { type: 'neighborhood', name: user.neighborhood, icon: '🏙️' },
    ...(user.street ? [{ type: 'street', name: user.street, icon: '🏠' }] : []),
    ...user.communityGroups.map(g => ({ type: 'group', name: g, icon: '🤝' })),
    ...(user.isCaptain || user.isAssistantCaptain ? [{ type: 'leadership', name: 'Leadership Lounge', icon: '🏰' }] : [])
  ];

  const isLeadershipChat = activeRoom.type === 'leadership';

  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-[3rem] shadow-2xl flex flex-col h-[750px] overflow-hidden border border-emerald-100 relative transition-all duration-500 ${isLeadershipChat ? 'ring-8 ring-amber-400/20' : ''}`}>
      {/* Header Buttons */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button 
          onClick={() => {
            setShowMembers(!showMembers);
            setShowGoalPanel(false);
          }}
          className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg transition-all border border-emerald-100 ${showMembers ? 'bg-emerald-800 text-white' : 'bg-white/90 text-emerald-900 hover:scale-105'}`}
          title="See Who's in Chat"
        >
          <span className="text-lg">👥</span>
          <span className="text-[7px] font-black uppercase leading-none">Members</span>
        </button>
        <button 
          onClick={onClose}
          className="bg-white/90 text-emerald-900 w-12 h-12 rounded-full flex items-center justify-center shadow-lg font-black hover:scale-110 active:scale-95 transition-all border border-emerald-100"
        >
          ✕
        </button>
      </div>

      <button 
        onClick={() => {
          setShowGoalPanel(!showGoalPanel);
          setShowMembers(false);
        }}
        className={`p-5 text-center shadow-lg transition-all border-b group relative overflow-hidden ${
          isLeadershipChat 
            ? 'bg-amber-900 border-amber-700 hover:bg-black' 
            : 'bg-emerald-900 border-emerald-700 hover:bg-emerald-800 active:bg-black'
        }`}
      >
        {isLeadershipChat && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 to-transparent"></div>
          </div>
        )}
        <div className="flex flex-col items-center justify-center relative z-10 pr-24">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-2xl ${isLeadershipChat ? 'animate-pulse' : ''}`}>
              {isLeadershipChat ? '👑' : '🇮🇪'}
            </span>
            <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm">{activeRoom.name}</h2>
          </div>
          {(user.isCaptain || user.isAssistantCaptain) && (
            <span className={`text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top ${isLeadershipChat ? 'text-amber-400' : 'text-emerald-400'}`}>
              {isLeadershipChat ? 'Private Leadership Channel' : 'Tap to Verify Missions 👑'}
            </span>
          )}
        </div>
      </button>

      {/* Goal Verification Panel */}
      {showGoalPanel && (
        <div className="bg-emerald-50 border-b-4 border-emerald-100 p-8 animate-in slide-in-from-top duration-300 z-30">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center text-xl shadow-lg">📋</div>
              <div>
                <h3 className="text-emerald-900 font-black text-xs uppercase tracking-widest">Mission Control</h3>
                <p className="text-[10px] text-emerald-700/70 font-bold">Both leaders must tick off completion!</p>
              </div>
            </div>
            <button onClick={() => setShowGoalPanel(false)} className="bg-white w-8 h-8 rounded-full shadow-sm flex items-center justify-center text-emerald-400 font-bold">✕</button>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-xl border-2 border-emerald-100">
            {user.activeGoal ? (
              <>
                <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Active Objective</span>
                  <p className="text-emerald-900 font-bold text-lg leading-tight italic">"{user.activeGoal}"</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-4 ${user.hasCaptainTickedGoal ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest">Captain</span>
                    <span className="text-2xl">{user.hasCaptainTickedGoal ? '✓' : '⏳'}</span>
                  </div>
                  <div className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-4 ${user.hasAssistantTickedGoal ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg scale-105' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest">Assistant</span>
                    <span className="text-2xl">{user.hasAssistantTickedGoal ? '✓' : '⏳'}</span>
                  </div>
                </div>

                {(user.isCaptain || user.isAssistantCaptain) ? (
                  <button
                    onClick={handleTick}
                    disabled={(user.isCaptain && user.hasCaptainTickedGoal) || (user.isAssistantCaptain && user.hasAssistantTickedGoal)}
                    className="w-full mt-6 py-4 bg-emerald-900 text-white font-black rounded-2xl shadow-xl hover:bg-black disabled:opacity-50 disabled:bg-gray-400 transition-all uppercase text-xs tracking-widest active:scale-95"
                  >
                    Tick Off Completion
                  </button>
                ) : (
                  <div className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase italic">
                    Waiting for leaders to verify the clean up...
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3 opacity-30">✅</div>
                <p className="text-gray-400 text-sm font-bold italic text-center">No active missions. Check back for your weekly task!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Members List Panel */}
      {showMembers && (
        <div className="bg-emerald-800 p-8 animate-in slide-in-from-top duration-300 z-30 shadow-2xl border-b-4 border-emerald-900 max-h-[400px] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <span>👥</span> {activeRoom.name} Members ({roomMembers.length})
            </h3>
            <button onClick={() => setShowMembers(false)} className="text-emerald-300 font-bold text-lg hover:text-white transition-colors">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roomMembers.map(member => (
              <button
                key={member.id}
                onClick={() => member.id !== user.id && onViewUser(member.id)}
                className={`p-3 rounded-2xl flex items-center gap-3 transition-all text-left border-2 ${member.id === user.id ? 'bg-white/10 border-white/20' : 'bg-emerald-900/50 border-transparent hover:border-white/30 hover:bg-emerald-900'}`}
              >
                <Avatar icon={member.avatar} rank={member.rank} size="sm" isCaptain={member.isCaptain} isAssistantCaptain={member.isAssistantCaptain} />
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm leading-tight truncate max-w-[120px]">
                    {member.name} {member.id === user.id ? '(You)' : ''}
                  </span>
                  <div className="flex gap-1 mt-1">
                    {member.isCaptain && <span className="bg-amber-400 text-amber-900 text-[6px] px-1 py-0.5 rounded-full font-black uppercase">Captain</span>}
                    {member.isAssistantCaptain && <span className="bg-gray-400 text-white text-[6px] px-1 py-0.5 rounded-full font-black uppercase">Assistant</span>}
                    <span className="text-emerald-400 text-[7px] font-bold uppercase">☘️ {member.totalShamrocks.toLocaleString()}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {user.isCaptain && !user.activeGoal && (
        <div className="bg-amber-400 p-4 flex justify-between items-center shadow-xl relative z-20 border-b border-amber-500 animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center text-2xl shadow-inner animate-bounce">📦</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 leading-none">Weekly Mission Available!</span>
              <span className="text-[9px] font-bold text-amber-800/80">Issue your team's objective for the week.</span>
            </div>
          </div>
          <button 
            onClick={handleCheckMission}
            className="bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Issue Mission
          </button>
        </div>
      )}

      <div className={`p-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-b transition-colors duration-500 ${isLeadershipChat ? 'bg-amber-950 border-amber-900' : 'bg-emerald-800 border-emerald-700'}`}>
        {rooms.map((room, idx) => (
          <button
            key={idx}
            onClick={() => setActiveRoom({type: room.type as any, name: room.name})}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeRoom.name === room.name 
                ? (room.type === 'leadership' ? 'bg-amber-500 text-white shadow-lg scale-105' : 'bg-emerald-500 text-white shadow-md')
                : (room.type === 'leadership' ? 'text-amber-500/50 hover:bg-amber-900' : 'text-emerald-300 hover:bg-emerald-700')
            }`}
          >
            {room.icon} {room.name}
          </button>
        ))}
      </div>

      <div className={`flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar transition-colors duration-500 ${isLeadershipChat ? 'bg-amber-50/10' : 'bg-emerald-50/20'}`}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom duration-300`}
          >
            <div className={`flex items-center gap-2 mb-1 ${msg.userId === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
              <button 
                disabled={msg.userId === 'system'}
                onClick={() => msg.userId !== user.id && onViewUser(msg.userId)}
                className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${msg.userId === user.id ? (isLeadershipChat ? 'text-amber-700' : 'text-emerald-700') : 'text-stone-500 hover:text-emerald-600'}`}
              >
                {msg.userAvatar} {msg.userName} 
                {msg.isCaptain && <span className="bg-amber-400 text-amber-900 text-[7px] px-1.5 py-0.5 rounded-full">CAPTAIN 👑</span>}
                {msg.isAssistantCaptain && <span className="bg-gray-400 text-white text-[7px] px-1.5 py-0.5 rounded-full">ASST. CAPTAIN 🥈</span>}
              </button>
              <span className="text-[8px] text-stone-400 font-bold">{msg.timestamp}</span>
            </div>
            <div 
              className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm shadow-md transition-all ${
                msg.verificationActionId
                  ? (msg.isVerified ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-900' : 'bg-amber-50 border-2 border-amber-500 text-amber-950')
                  : msg.isGoal 
                    ? 'bg-emerald-900 border-4 border-amber-400 text-white font-black scale-105 shadow-emerald-900/40 text-center'
                    : msg.userId === 'system'
                      ? 'bg-stone-800 text-stone-100 mx-auto italic text-xs'
                      : msg.userId === user.id 
                        ? (isLeadershipChat ? 'bg-amber-800 text-white rounded-tr-none shadow-amber-900/20' : 'bg-emerald-700 text-white rounded-tr-none') 
                        : (isLeadershipChat ? 'bg-white border-2 border-amber-100 text-amber-950 rounded-tl-none' : 'bg-white text-gray-800 rounded-tl-none border border-emerald-50')
              }`}
            >
              {msg.attachment && (
                <div className="mb-3 rounded-2xl overflow-hidden shadow-inner border-2 border-white/20">
                  {msg.attachment.type === 'image' ? (
                    <img src={msg.attachment.url} alt="Shared photo" className="max-w-full h-auto max-h-72 object-cover" />
                  ) : (
                    <video src={msg.attachment.url} controls className="max-w-full h-auto max-h-72" />
                  )}
                </div>
              )}
              {msg.text}
              
              {msg.verificationActionId && !msg.isVerified && msg.userId !== user.id && (
                <button
                  onClick={() => handleVerifyRequest(msg.id, msg.verificationActionId!)}
                  className="w-full mt-3 py-2 bg-emerald-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Verify Now ☘️
                </button>
              )}

              {msg.isGoal && <div className="mt-2 text-[9px] text-amber-300 font-bold uppercase tracking-widest">Tap Chat Name to Tick Off when Done!</div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={`p-6 border-t flex gap-3 shadow-inner transition-colors duration-500 ${isLeadershipChat ? 'bg-amber-50 border-amber-100' : 'bg-white border-emerald-100'}`}>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all shadow-sm ${isLeadershipChat ? 'bg-amber-200 text-amber-800 hover:bg-amber-300' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
          title="Attach Photo or Video"
        >
          📎
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,video/*"
          onChange={handleFileSelect}
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Message the ${activeRoom.name}...`}
          className={`flex-1 border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-sm focus:border-emerald-500 outline-none font-bold transition-all ${isLeadershipChat ? 'bg-white text-amber-950 focus:border-amber-500' : 'bg-emerald-50 text-emerald-900 focus:border-emerald-500'}`}
        />
        <button 
          onClick={() => handleSend()}
          className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all shadow-xl text-white ${isLeadershipChat ? 'bg-amber-900 hover:bg-black' : 'bg-emerald-700 hover:bg-emerald-800'}`}
        >
          {isLeadershipChat ? '👑' : '🇮🇪'}
        </button>
      </div>
    </div>
  );
};
