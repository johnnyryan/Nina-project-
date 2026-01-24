import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';

interface NeighborhoodChatProps {
  user: UserProfile;
  onViewUser: (userId: string) => void;
}

// Added the requested curse words to the filter list
const PROFANITY_WORDS = [
  'fuck', 'shit', 'bitch', 'bullshit', 'crap',
  'feck', 'shite', 'gobshite', 'arse', 'twat', 'wank', 'bollocks'
];

export const NeighborhoodChat: React.FC<NeighborhoodChatProps> = ({ user, onViewUser }) => {
  const [activeRoom, setActiveRoom] = useState<{type: 'neighborhood' | 'street' | 'group', name: string}>({
    type: 'neighborhood',
    name: user.neighborhood
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<{ type: 'image' | 'video', file: File, url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial messages mock per room
  useEffect(() => {
    setMessages([
      {
        id: '1',
        userId: 'system',
        userName: 'Warden',
        userAvatar: '☘️',
        text: `Welcome to the ${activeRoom.name} community. Please keep it professional and respectful!`,
        timestamp: '9:00 AM',
        roomType: activeRoom.type,
        roomName: activeRoom.name
      }
    ]);
  }, [activeRoom]);

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

  const handleSend = () => {
    if (!newMessage.trim() && !attachment) return;
    
    // Profanity Filter
    const cleanText = filterProfanity(newMessage);
    
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomType: activeRoom.type,
      roomName: activeRoom.name,
      attachment: attachment ? { type: attachment.type, url: attachment.url } : undefined
    };

    setMessages([...messages, msg]);
    setNewMessage('');
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const rooms = [
    { type: 'neighborhood', name: user.neighborhood, icon: '🏙️' },
    ...(user.street ? [{ type: 'street', name: user.street, icon: '🏠' }] : []),
    ...user.communityGroups.map(g => ({ type: 'group', name: g, icon: '🤝' }))
  ];

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl flex flex-col h-[650px] overflow-hidden border border-emerald-100">
      {/* Room Selector */}
      <div className="bg-emerald-900 p-2 flex gap-1 overflow-x-auto scrollbar-hide">
        {rooms.map((room, idx) => (
          <button
            key={idx}
            onClick={() => setActiveRoom({type: room.type as any, name: room.name})}
            className={`whitespace-nowrap px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
              activeRoom.name === room.name 
                ? 'bg-emerald-600 text-white' 
                : 'text-emerald-300 hover:bg-emerald-800'
            }`}
          >
            {room.icon} {room.name}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-emerald-50/10">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <button 
                disabled={msg.userId === 'system'}
                onClick={() => msg.userId !== user.id && onViewUser(msg.userId)}
                className={`text-xs font-bold ${msg.userId === user.id ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                {msg.userAvatar} {msg.userName} {msg.userId === user.id && '(You)'}
              </button>
              <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
            </div>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.userId === 'system'
                  ? 'bg-stone-200 text-stone-600 mx-auto italic'
                  : msg.userId === user.id 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 rounded-tl-none border border-emerald-50'
              }`}
            >
              {msg.attachment && (
                <div className="mb-2 rounded-xl overflow-hidden shadow-inner">
                  {msg.attachment.type === 'image' ? (
                    <img src={msg.attachment.url} alt="Shared photo" className="max-w-full h-auto max-h-60 object-cover" />
                  ) : (
                    <video src={msg.attachment.url} controls className="max-w-full h-auto max-h-60" />
                  )}
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Attachment Preview */}
      {attachment && (
        <div className="px-4 py-2 bg-emerald-50 border-t border-emerald-100 flex items-center gap-3">
          <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden border border-emerald-200">
            {attachment.type === 'image' ? (
              <img src={attachment.url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white text-xl">🎥</div>
            )}
            <button 
              onClick={() => { setAttachment(null); if(fileInputRef.current) fileInputRef.current.value = ''; }}
              className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-[10px]"
            >✕</button>
          </div>
          <span className="text-xs font-bold text-emerald-800 truncate max-w-[200px]">{attachment.file.name}</span>
        </div>
      )}

      <div className="p-4 bg-white border-t border-emerald-50 flex gap-2">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-emerald-100 transition-colors"
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
          placeholder={`Chat in ${activeRoom.name}...`}
          className="flex-1 bg-emerald-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
        />
        <button 
          onClick={handleSend}
          className="bg-emerald-600 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-colors shadow-md"
        >
          ☘️
        </button>
      </div>
    </div>
  );
};