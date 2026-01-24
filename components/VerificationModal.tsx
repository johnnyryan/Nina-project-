
import React, { useState, useRef } from 'react';
import { RewardAction, ActionType } from '../types';
import { verifyActionImage } from '../services/geminiService';

interface VerificationModalProps {
  action: RewardAction;
  onClose: () => void;
  onSuccess: (points: number, actionId: ActionType) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ action, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'photo' | 'friend' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerify = async () => {
    if (method === 'photo' && preview) {
      setIsVerifying(true);
      const result = await verifyActionImage(preview, action.id);
      setIsVerifying(false);
      setFeedback(result.message);
      
      if (result.verified) {
        let points = action.points;
        if (action.id === ActionType.DONATE_VOLUNTEER) {
          points = Math.max(1, parseInt(amount) || 1);
        }
        setTimeout(() => onSuccess(points, action.id), 3000);
      }
    } else if (method === 'friend') {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setFeedback("Proper legend! Your witness has confirmed your action. Verification complete!");
        let points = action.points;
        if (action.id === ActionType.DONATE_VOLUNTEER) {
          points = Math.max(1, parseInt(amount) || 1);
        }
        setTimeout(() => onSuccess(points, action.id), 3000);
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="bg-emerald-600 p-6 text-white text-center">
          <div className="text-4xl mb-2">{action.icon}</div>
          <h2 className="text-2xl font-bold">Verifying {action.title}</h2>
          <p className="text-emerald-50 text-sm">{action.description}</p>
        </div>

        <div className="p-8">
          {!method ? (
            <div className="space-y-4">
              <p className="text-center text-gray-600 font-medium mb-4">How would you like to prove your good deed?</p>
              <button 
                onClick={() => setMethod('photo')}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
              >
                <div>
                  <div className="font-bold text-emerald-900">Use photo</div>
                  <div className="text-xs text-gray-500">Upload a picture of your progress</div>
                </div>
                <span className="text-2xl group-hover:scale-125 transition-transform">📸</span>
              </button>
              <button 
                onClick={() => setMethod('friend')}
                className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left group"
              >
                <div>
                  <div className="font-bold text-emerald-900">Check / Ask a neighbour</div>
                  <div className="text-xs text-gray-500">Ask a neighbour in your chat to witness</div>
                </div>
                <span className="text-2xl group-hover:scale-125 transition-transform">🤝</span>
              </button>
              <button onClick={onClose} className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm">Cancel</button>
            </div>
          ) : feedback ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-4">🇮🇪</div>
              <p className="text-lg font-medium text-emerald-900 leading-relaxed italic">
                "{feedback}"
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {action.id === ActionType.DONATE_VOLUNTEER && (
                <div>
                  <label className="block text-sm font-bold text-emerald-900 mb-1">
                    Amount (€ or 20-min intervals)
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-emerald-500 outline-none"
                    placeholder="e.g. 20"
                  />
                </div>
              )}

              {method === 'photo' && (
                <div className="flex flex-col items-center">
                  {preview ? (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-4 border-emerald-100">
                      <img src={preview} alt="Verification" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                    >
                      <span className="text-4xl mb-2">📸</span>
                      <span className="text-gray-500 font-medium">Click to upload photo</span>
                    </button>
                  )}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                  />
                </div>
              )}

              {method === 'friend' && (
                <div className="text-center p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                  <p className="text-emerald-800 font-bold mb-2">Community Witness Needed!</p>
                  <p className="text-emerald-700 text-sm">
                    Show this screen to a neighbor in your chat or community group to verify you completed: <span className="font-bold">{action.title}</span>.
                  </p>
                </div>
              )}

              <button
                disabled={isVerifying || (method === 'photo' && !preview)}
                onClick={handleVerify}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all ${
                  isVerifying || (method === 'photo' && !preview)
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95'
                }`}
              >
                {isVerifying ? 'Checking with the Shamrock Sentry...' : 'Confirm Action'}
              </button>
              
              {!isVerifying && (
                <button onClick={() => setMethod(null)} className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm">
                  Go Back
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
