
import React, { useState } from 'react';
import { UserProfile, ChatMessage } from '../types';

interface NeighborhoodChatProps {
  user: UserProfile;
  onViewUser: (userId: string) => void;
}

export const NeighborhoodChat: React.FC<NeighborhoodChatProps> = ({ user, onViewUser }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Paddy O’Malley',
      text: 'Just finished cleaning up near St. Patrick’s Cathedral! Who’s next?',
      timestamp: '10:30 AM',
      neighborhood: user.neighborhood
    },
    {
      id: '2',
      userId: '2',
      userName: 'Siobhan Murphy',
      text: 'Grand job Paddy! I’m heading out to the park in 20 mins if anyone wants to join.',
      timestamp: '10:45 AM',
      neighborhood: user.neighborhood
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      neighborhood: user.neighborhood
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl flex flex-col h-[600px] overflow-hidden">
      <div className="bg-emerald-600 p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          💬 {user.neighborhood} Community
        </h2>
        <p className="text-emerald-100 text-xs opacity-80">Connect with your neighbors & verify deeds!</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-emerald-50/30">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex flex-col ${msg.userId === user.id ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <button 
                onClick={() => msg.userId !== user.id && onViewUser(msg.userId)}
                className={`text-xs font-bold ${msg.userId === user.id ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}
              >
                {msg.userName} {msg.userId === user.id && '(You)'}
              </button>
              <span className="text-[10px] text-gray-400">{msg.timestamp}</span>
            </div>
            <div 
              className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.userId === user.id 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 rounded-tl-none border border-emerald-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-emerald-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Say something to the neighborhood..."
          className="flex-1 bg-emerald-50 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
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
