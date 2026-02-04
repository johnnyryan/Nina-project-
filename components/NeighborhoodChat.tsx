
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, ChatMessage } from '../types';
import { LiveDatabase } from '../App';

interface NeighborhoodChatProps {
  user: UserProfile;
  onViewUser: (userId: string) => void;
  onClose: () => void;
}

export const NeighborhoodChat: React.FC<NeighborhoodChatProps> = ({ user, onViewUser, onClose }) => {
  const [activeRoom, setActiveRoom] = useState({ type: 'neighborhood', name: user.neighborhood });
  const roomKey = `${activeRoom.type}-${activeRoom.name}`;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    LiveDatabase.getRoomMessages(roomKey).then(stored => {
      if (stored.length === 0) {
        setMessages([{
          id: 'sys-1', userId: 'system', userName: 'Shamrock Sentry', userAvatar: '🛡️',
          text: `Welcome to the ${activeRoom.name} community. Keep it green!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roomType: activeRoom.type as any, roomName: activeRoom.name
        }]);
      } else {
        setMessages(stored);
      }
    });
  }, [roomKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      roomType: activeRoom.type as any,
      roomName: activeRoom.name
    };
    setMessages(prev => [...prev, msg]);
    LiveDatabase.pushMessage(roomKey, msg);
    setNewMessage('');
  };

  const rooms = [
    { type: 'neighborhood', name: user.neighborhood, icon: '🏙️' },
    ...(user.street ? [{ type: 'street', name: user.street, icon: '🏠' }] : [])
  ];

  return (
    <div className="bg-white rounded-[3rem] shadow-2xl flex flex-col h-[650px] overflow-hidden border border-emerald-100">
      <div className="bg-emerald-900 p-6 flex justify-between items-center text-white">
        <h2 className="font-black uppercase tracking-widest text-sm">Community: {activeRoom.name}</h2>
        <button onClick={onClose} className="font-bold">✕</button>
      </div>
      <div className="p-2 flex gap-2 bg-emerald-800 border-b border-emerald-700">
        {rooms.map((room, idx) => (
          <button key={idx} onClick={() => setActiveRoom({type: room.type, name: room.name})}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeRoom.name === room.name ? 'bg-emerald-500 text-white' : 'text-emerald-300'}`}>
            {room.icon} {room.name}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-emerald-50/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}>
            <span className="text-[10px] font-black uppercase text-emerald-900 mb-1">{msg.userName} • {msg.timestamp}</span>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm border shadow-sm ${msg.userId === user.id ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-950'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white border-t flex gap-3">
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder={`Chat in ${activeRoom.name}...`} className="flex-1 bg-emerald-50 rounded-2xl px-5 py-3 text-sm font-bold text-emerald-950 outline-none" />
        <button onClick={handleSend} className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center">☘️</button>
      </div>
    </div>
  );
};
