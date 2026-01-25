
import React, { useState, useRef, useEffect } from 'react';
import { RewardAction, ActionType } from '../types';
import { verifyActionImage } from '../services/geminiService';

interface VerificationModalProps {
  action: RewardAction;
  onClose: () => void;
  onSuccess: (points: number, actionId: ActionType) => void;
  onRequestWitness: (action: RewardAction) => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ action, onClose, onSuccess, onRequestWitness }) => {
  const [method, setMethod] = useState<'photo' | 'friend' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Poll local storage to simulate "real" confirmation from another neighbor
  useEffect(() => {
    if (method === 'friend' && isVerifying) {
      const interval = setInterval(() => {
        const confirmedId = localStorage.getItem(`verify_confirm_${action.id}`);
        if (confirmedId === 'true') {
          localStorage.removeItem(`verify_confirm_${action.id}`);
          setIsVerifying(false);
          setFeedback("Proper legend! Your witness in the chat has confirmed your action. Verification complete!");
          
          let points = action.points;
          if (action.id === ActionType.DONATE_VOLUNTEER) {
            const minutes = parseInt(amount) || 0;
            // Rule: 10 shamrock points per 20 minutes
            points = Math.floor(minutes / 20) * 10;
          }
          setTimeout(() => onSuccess(points, action.id), 3000);
          clearInterval(interval);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [method, isVerifying, action.id, amount, onSuccess]);

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
          const minutes = parseInt(amount) || 0;
          points = Math.floor(minutes / 20) * 10;
        }
        setTimeout(() => onSuccess(points, action.id), 3000);
      }
    } else if (method === 'friend') {
      setIsVerifying(true);
      // Instead of an immediate timeout, we "Request Witness" which posts to chat
      onRequestWitness(action);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative">
        {/* Global Exit Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white/80 text-emerald-900 w-10 h-10 rounded-full flex items-center justify-center shadow-lg font-black hover:scale-110 active:scale-95 transition-all border border-emerald-100"
          aria-label="Exit verification"
        >
          ✕
        </button>

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
                  <div className="text-xs text-gray-500">A neighbor must confirm this in the chat</div>
                </div>
                <span className="text-2xl group-hover:scale-125 transition-transform">🤝</span>
              </button>
              <button onClick={onClose} className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm font-bold uppercase tracking-widest">Cancel</button>
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
                <div className="animate-in fade-in slide-in-from-top duration-300">
                  <label className="block text-sm font-black text-emerald-900 mb-2 uppercase tracking-widest">
                    How long was your contribution? (Minutes)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full p-4 rounded-2xl border-2 border-emerald-100 focus:border-emerald-500 outline-none font-bold text-lg"
                      placeholder="Enter total minutes"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-400 uppercase">
                      MINS
                    </div>
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 font-bold italic uppercase leading-tight">
                    You earn 10 Shamrocks for every 20 minutes contributed.
                  </p>
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
                  <p className="text-emerald-800 font-bold mb-2">Community Witness Requested!</p>
                  <p className="text-emerald-700 text-sm leading-relaxed">
                    {isVerifying 
                      ? "Waiting for a neighbor in the Neighborhood Chat to verify you completed this action... Keep this window open or check back later!" 
                      : "Confirming will post a witness request to your Neighborhood Chat. A neighbor must click 'Verify' to complete this deed."}
                  </p>
                  {isVerifying && (
                    <div className="mt-4 flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-pulse">Awaiting neighbor...</span>
                    </div>
                  )}
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
                {isVerifying ? (method === 'friend' ? 'Waiting for Witness...' : 'Checking with Sentry...') : 'Confirm Action'}
              </button>
              
              {!isVerifying && (
                <button onClick={() => setMethod(null)} className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm font-bold uppercase">
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
