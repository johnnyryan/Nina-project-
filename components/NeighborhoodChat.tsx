
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';

interface NeighborhoodChatProps {
  user: UserProfile;
  onViewUser: (userId: string) => void;
  onGoalAward: (goal: string) => void;
  onTickGoal: (role: 'captain' | 'assistant') => void;
}

const PROFANITY_WORDS = [
  'fuck', 'shit', 'bitch', 'bullshit', 'crap',
  'feck', 'shite', 'gobshite', 'arse', 'twat', 'wank', 'bollocks'
];

// Irish-specific place-based missions
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
  "Clear litter from the main street crossroads! 📍"
];

export const NeighborhoodChat: React.FC<NeighborhoodChatProps> = ({ user, onViewUser, onGoalAward, onTickGoal }) => {
  const [activeRoom, setActiveRoom] = useState<{type: 'neighborhood' | 'street' | 'group', name: string}>({
    type: 'neighborhood',
    name: user.neighborhood
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<{ type: 'image' | 'video', file: File, url: string } | null>(null);
  const [showGoalPanel, setShowGoalPanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial messages mock per room
  useEffect(() => {
    setMessages([
      {
        id: '1',
        userId: 'system',
        userName: 'Shamrock Sentry',
        userAvatar: '🛡️',
        text: `Welcome to the ${activeRoom.name} community. Captain & Assistant Captain: Tap the chat name to verify cleanups!`,
        timestamp: '9:00 AM',
        roomType: activeRoom.type,
        roomName: activeRoom.name
      }
    ]);
  }, [activeRoom]);

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

  const handleCheckMission = () => {
    const lastGoalDate = user.weeklyGoalSetAt ? new Date(user.weeklyGoalSetAt) : null;
    const now = new Date();
    
    if (lastGoalDate && (now.getTime() - lastGoalDate.getTime()) < 1 * 60 * 1000) {
      alert("No new missions yet, Captain! Check back in a few minutes.");
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
    ...user.communityGroups.map(g => ({ type: 'group', name: g, icon: '🤝' }))
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-[3rem] shadow-2xl flex flex-col h-[750px] overflow-hidden border border-emerald-100 relative">
      {/* Interactive Chat Header: Tapping name opens mission control */}
      <button 
        onClick={() => setShowGoalPanel(!showGoalPanel)}
        className="bg-emerald-900 p-5 text-center shadow-lg transition-all hover:bg-emerald-800 active:bg-black group border-b border-emerald-700"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl animate-pulse">🇮🇪</span>
            <h2 className="text-white font-black uppercase tracking-[0.2em] text-sm">{activeRoom.name}</h2>
          </div>
          {(user.isCaptain || user.isAssistantCaptain) && (
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest animate-in slide-in-from-top">
              Tap to Verify Missions 👑
            </span>
          )}
        </div>
      </button>

      {/* Goal Verification Panel (Only for Captain/Assistant) */}
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
                <p className="text-gray-400 text-sm font-bold italic text-center">No active missions. Check notifications below!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Captain's Mission Notification Banner */}
      {user.isCaptain && !user.activeGoal && (
        <div className="bg-amber-400 p-4 flex justify-between items-center shadow-xl relative z-20 border-b border-amber-500 animate-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 rounded-xl flex items-center justify-center text-2xl shadow-inner animate-bounce">📦</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-900 leading-none">New Mission Available!</span>
              <span className="text-[9px] font-bold text-amber-800/80">Check for a local cleanup task.</span>
            </div>
          </div>
          <button 
            onClick={handleCheckMission}
            className="bg-amber-900 text-amber-50 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Check Mission
          </button>
        </div>
      )}

      {/* Room Selector */}
      <div className="bg-emerald-800 p-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 border-b border-emerald-700">
        {rooms.map((room, idx) => (
          <button
            key={idx}
            onClick={() => setActiveRoom({type: room.type as any, name: room.name})}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeRoom.name === room.name 
                ? 'bg-emerald-500 text-white shadow-md' 
                : 'text-emerald-300 hover:bg-emerald-700'
            }`}
          >
            {room.icon} {room.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-emerald-50/20 no-scrollbar">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom duration-300`}
          >
            <div className={`flex items-center gap-2 mb-1 ${msg.userId === user.id ? 'flex-row-reverse' : 'flex-row'}`}>
              <button 
                disabled={msg.userId === 'system'}
                onClick={() => msg.userId !== user.id && onViewUser(msg.userId)}
                className={`text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${msg.userId === user.id ? 'text-emerald-700' : 'text-stone-500 hover:text-emerald-600'}`}
              >
                {msg.userAvatar} {msg.userName} 
                {msg.isCaptain && <span className="bg-amber-400 text-amber-900 text-[7px] px-1.5 py-0.5 rounded-full">CAPTAIN 👑</span>}
                {msg.isAssistantCaptain && <span className="bg-gray-400 text-white text-[7px] px-1.5 py-0.5 rounded-full">ASST. CAPTAIN 🥈</span>}
              </button>
              <span className="text-[8px] text-stone-400 font-bold">{msg.timestamp}</span>
            </div>
            <div 
              className={`max-w-[85%] p-4 rounded-[1.8rem] text-sm shadow-md transition-all ${
                msg.isGoal 
                  ? 'bg-emerald-900 border-4 border-amber-400 text-white font-black scale-105 shadow-emerald-900/40 text-center'
                  : msg.userId === 'system'
                    ? 'bg-stone-800 text-stone-100 mx-auto italic text-xs'
                    : msg.userId === user.id 
                      ? 'bg-emerald-700 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-emerald-50'
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
              {msg.isGoal && <div className="mt-2 text-[9px] text-amber-300 font-bold uppercase tracking-widest">Tap Chat Name to Tick Off when Done!</div>}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-emerald-100 flex gap-3 shadow-inner">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-emerald-100 text-emerald-700 w-14 h-14 rounded-3xl flex items-center justify-center hover:bg-emerald-200 transition-all shadow-sm"
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
          placeholder={`Message the ${activeRoom.name} team...`}
          className="flex-1 bg-emerald-50 border-2 border-transparent rounded-[1.5rem] px-6 py-4 text-sm focus:border-emerald-500 outline-none font-bold text-emerald-900 transition-all"
        />
        <button 
          onClick={() => handleSend()}
          className="bg-emerald-700 text-white w-14 h-14 rounded-3xl flex items-center justify-center hover:bg-emerald-800 transition-all shadow-xl"
        >
          🇮🇪
        </button>
      </div>
    </div>
  );
};
