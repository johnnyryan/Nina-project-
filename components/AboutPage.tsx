
import React from 'react';
import { COLORS } from '../constants';

interface AboutPageProps {
  onClose: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom duration-700 relative">
      <div className="absolute top-4 right-4 z-40">
        <button 
          onClick={onClose}
          className="bg-white text-emerald-900 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl font-black hover:scale-110 active:scale-95 transition-all border-4 border-emerald-50"
        >
          ✕
        </button>
      </div>
      
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-2xl border-b-8 border-emerald-600 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
          <span className="text-[150px]">🇮🇪</span>
        </div>
        
        <div className="relative z-10">
          <div className="inline-block bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            Our Story
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-emerald-900 mb-8 tracking-tighter leading-tight">
            The Heart of <br/><span className="text-emerald-600">Help Ireland</span>
          </h2>
          
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed font-medium">
            <p>
              Help Ireland wasn't created in a boardroom, but from a simple wish to see our beautiful country thrive. 
              It was made by <span className="text-emerald-900 font-black underline decoration-emerald-300 underline-offset-4">Nina Regan Ryan</span>.
            </p>
            
            <div className="bg-emerald-50 p-8 rounded-[2rem] border-l-8 border-emerald-500 italic">
              "I felt like Ireland was getting dirty and I wanted to make it an eco country and for Ireland to be clean and beautiful."
              <br/>
              <span className="not-italic block mt-4 text-sm font-black text-emerald-700 uppercase tracking-widest">— Nina Regan Ryan</span>
            </div>

            <p>
              This app is a tool for every person in every county—from the streets of Dublin to the hills of Donegal—to take ownership of their local environment. 
              By rewarding small acts of kindness to nature with <span className="text-emerald-600 font-bold">Shamrock Points</span>, we turn individual effort into a collective movement.
            </p>

            <p>
              We believe that if we all do our bit, we can preserve the "Forty Shades of Green" for generations to come. 
              Thank you for being part of this journey to keep Ireland clean, beautiful, and green.
            </p>
          </div>

          <div className="mt-12 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-900 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-emerald-900/20">
                ☘️
              </div>
              <div>
                <div className="font-black text-emerald-900">Created by</div>
                <div className="text-gray-500 font-bold">Nina Regan Ryan</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest">Made in 24/1/2026</span>
              <span className="px-4 py-2 bg-gray-100 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-widest">Dublin, Ireland</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 Q 50 0 100 100" fill="none" stroke="white" strokeWidth="0.5" />
             <path d="M0 80 Q 50 -20 100 80" fill="none" stroke="white" strokeWidth="0.5" />
           </svg>
        </div>
        <h3 className="text-2xl font-black mb-4 relative z-10">Our Vision</h3>
        <p className="text-emerald-100/80 leading-relaxed font-medium relative z-10">
          To empower every neighborhood to become a self-sustaining eco-community. 
          Through technology and community spirit, we're building a future where 
          nature and people live in perfect harmony.
        </p>
      </div>
    </div>
  );
};
