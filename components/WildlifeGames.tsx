
import React, { useState, useMemo, useEffect } from 'react';

interface WildlifeGamesProps {
  onEarnPoints: (points: number) => void;
  onClose: () => void;
}

const GAEILGE_POOL = [
  { gaeilge: 'Fáilte', english: 'Welcome' },
  { gaeilge: 'Sláinte', english: 'Health / Cheers' },
  { gaeilge: 'Madra', english: 'Dog' },
  { gaeilge: 'Cat', english: 'Cat' },
  { gaeilge: 'Uisce', english: 'Water' },
  { gaeilge: 'Sionnach', english: 'Fox' },
  { gaeilge: 'Crann', english: 'Tree' },
  { gaeilge: 'Abhainn', english: 'River' },
  { gaeilge: 'Bó', english: 'Cow' },
  { gaeilge: 'Grian', english: 'Sun' }
];

type WasteCategory = 'Recycling' | 'Compost' | 'General Waste';
interface EcoItem { name: string; category: WasteCategory; icon: string; }

const ECO_ITEMS: EcoItem[] = [
  { name: 'Plastic Bottle', category: 'Recycling', icon: '🧴' },
  { name: 'Apple Core', category: 'Compost', icon: '🍎' },
  { name: 'Paper Towel', category: 'General Waste', icon: '🧻' },
  { name: 'Soda Can', category: 'Recycling', icon: '🥫' },
  { name: 'Banana Peel', category: 'Compost', icon: '🍌' }
];

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const WildlifeGames: React.FC<WildlifeGamesProps> = ({ onEarnPoints, onClose }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'gaeilge' | 'sorter'>('menu');
  const [index, setIndex] = useState(0);
  const [sessionItems, setSessionItems] = useState<any[]>([]);

  const startGaeilge = () => {
    setSessionItems(shuffle(GAEILGE_POOL).slice(0, 8));
    setIndex(0);
    setActiveGame('gaeilge');
  };

  const startSorter = () => {
    setSessionItems(shuffle(ECO_ITEMS));
    setIndex(0);
    setActiveGame('sorter');
  };

  // SHUFFLED OPTIONS FOR GAEILGE
  const currentOptions = useMemo(() => {
    if (activeGame !== 'gaeilge' || !sessionItems[index]) return [];
    const correct = sessionItems[index].english;
    const others = GAEILGE_POOL.filter(x => x.english !== correct).map(x => x.english);
    return shuffle([correct, ...shuffle(others).slice(0, 3)]);
  }, [activeGame, index, sessionItems]);

  const handleChoice = (choice: string) => {
    const isCorrect = choice === sessionItems[index].english;
    if (isCorrect) {
      if (index < sessionItems.length - 1) setIndex(index + 1);
      else {
        alert("Well done! You've completed the challenge. +30 Shamrocks!");
        onEarnPoints(30);
        setActiveGame('menu');
      }
    } else {
      alert("Oops! The correct answer was: " + sessionItems[index].english);
      setActiveGame('menu');
    }
  };

  const handleSort = (cat: WasteCategory) => {
    if (cat === sessionItems[index].category) {
      if (index < sessionItems.length - 1) setIndex(index + 1);
      else {
        alert("Perfect sorting! Ireland is cleaner. +40 Shamrocks!");
        onEarnPoints(40);
        setActiveGame('menu');
      }
    } else {
      alert("Actually, that belongs in " + sessionItems[index].category);
      setActiveGame('menu');
    }
  };

  if (activeGame === 'menu') {
    return (
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-2xl mx-auto border-t-8 border-emerald-900">
        <h2 className="text-4xl font-black text-emerald-900 mb-4">Wildlife Hub</h2>
        <p className="text-emerald-900/60 mb-10">Test your Irish spirit and skill.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button onClick={startGaeilge} className="p-8 bg-emerald-50 border-2 border-emerald-100 rounded-[2rem] hover:border-emerald-600 transition-all">
            <span className="text-4xl block mb-2">🇮🇪</span>
            <h3 className="font-black text-emerald-950">Gaeilge Match</h3>
          </button>
          <button onClick={startSorter} className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[2rem] hover:border-blue-600 transition-all">
            <span className="text-4xl block mb-2">♻️</span>
            <h3 className="font-black text-emerald-950">Eco Sorter</h3>
          </button>
        </div>
        <button onClick={onClose} className="mt-10 font-black text-emerald-950/40 uppercase text-xs tracking-widest">Exit Hub</button>
      </div>
    );
  }

  if (activeGame === 'sorter') {
    return (
      <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-2xl mx-auto border-t-8 border-blue-600">
        <h2 className="text-2xl font-black text-emerald-950 mb-10">Eco Sorter ({index + 1}/{sessionItems.length})</h2>
        <div className="text-7xl mb-6 animate-bounce">{sessionItems[index].icon}</div>
        <h3 className="text-2xl font-black text-emerald-950 mb-10">{sessionItems[index].name}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(['Recycling', 'Compost', 'General Waste'] as WasteCategory[]).map(cat => (
            <button key={cat} onClick={() => handleSort(cat)} className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl font-black text-emerald-950 hover:border-emerald-600">
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] p-12 shadow-2xl text-center max-w-2xl mx-auto border-t-8 border-emerald-900">
      <h2 className="text-2xl font-black text-emerald-950 mb-10">Gaeilge Match ({index + 1}/{sessionItems.length})</h2>
      <div className="text-6xl font-black text-emerald-700 mb-12">{sessionItems[index].gaeilge}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentOptions.map((opt, i) => (
          <button key={i} onClick={() => handleChoice(opt)} className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl font-black text-emerald-950 hover:border-emerald-600">
            {opt}
          </button>
        ))}
      </div>
      <button onClick={() => setActiveGame('menu')} className="mt-10 text-emerald-900/40 font-black uppercase text-xs tracking-widest">Quit</button>
    </div>
  );
};
