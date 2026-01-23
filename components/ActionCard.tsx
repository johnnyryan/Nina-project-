
import React from 'react';
import { RewardAction } from '../types';

interface ActionCardProps {
  action: RewardAction;
  onSelect: (action: RewardAction) => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({ action, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(action)}
      className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-emerald-500 flex flex-col items-center text-center group"
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {action.icon}
      </div>
      <h3 className="text-xl font-bold text-emerald-900 mb-2">{action.title}</h3>
      <p className="text-sm text-gray-600 mb-4 h-10">{action.description}</p>
      <div className="mt-auto bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full font-bold flex items-center gap-1">
        <span className="text-lg">☘️</span>
        {action.unit === 'amount' ? `1 / unit` : `${action.points} Shamrocks`}
      </div>
    </button>
  );
};
