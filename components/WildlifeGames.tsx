
import React, { useState, useEffect, useMemo } from 'react';
import { COLORS } from '../constants';

interface WildlifeGamesProps {
  onEarnPoints: (points: number) => void;
  onClose: () => void;
}

interface TriviaItem {
  q: string;
  a: string;
  options: string[];
  fact: string;
}

interface GaeilgeItem {
  gaeilge: string;
  english: string;
}

interface SorterItem {
  name: string;
  icon: string;
  bin: string;
}

interface ScrambleItem {
  original: string;
  scramble: string;
  hint: string;
}

interface SanctuaryItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  bioPoints: number;
  description: string;
  synergyWith?: string[]; 
  synergyBonus?: number;
  color: string;
}

const WILDLIFE_POOL = [
  { icon: '🦊', name: 'Red Fox' },
  { icon: '🦌', name: 'Red Deer' },
  { icon: '🐿️', name: 'Red Squirrel' },
  { icon: '🦡', name: 'European Badger' },
  { icon: '🦭', name: 'Grey Seal' },
  { icon: '🦅', name: 'Golden Eagle' },
  { icon: '🦢', name: 'Mute Swan' },
  { icon: '🦦', name: 'Eurasian Otter' },
  { icon: '🦉', name: 'Barn Owl' },
  { icon: '🦇', name: 'Lesser Horseshoe Bat' },
  { icon: '🦔', name: 'Hedgehog' },
  { icon: '🐝', name: 'Irish Bumblebee' }
];

const TRIVIA_POOL: TriviaItem[] = [
  { q: "Which bird is often seen on the Cliffs of Moher and has a colorful beak?", a: "Puffin", options: ["Puffin", "Seagull", "Gannet", "Robin"], fact: "Puffins spend most of their lives at sea but return to the Irish coast to breed in spring." },
  { q: "What is Ireland's only native reptile?", a: "Viviparous Lizard", options: ["Slow Worm", "Viviparous Lizard", "Grass Snake", "Adder"], fact: "The Viviparous Lizard is also known as the Common Lizard and is protected under Irish law." },
  { q: "Which large mammal was reintroduced to Killarney National Park?", a: "Red Deer", options: ["Fallow Deer", "Red Deer", "Roe Deer", "Muntjac Deer"], fact: "Red Deer are Ireland's largest land mammals and have been here since the last Ice Age." },
  { q: "What is the national bird of Ireland?", a: "Lapwing", options: ["Lapwing", "Robin", "Golden Eagle", "Wren"], fact: "The Northern Lapwing was declared the national bird by the Irish Wildlife Trust in 1990." },
  { q: "Which sea creature is famous in Dingle Harbor?", a: "Dolphin", options: ["Whale", "Seal", "Dolphin", "Shark"], fact: "Fungie the Dingle Dolphin was a world-famous resident of the harbor for over 30 years." }
];

const LANDMARK_POOL: TriviaItem[] = [
  { q: "In which county would you find the Giant's Causeway?", a: "Antrim", options: ["Donegal", "Antrim", "Derry", "Down"], fact: "The Giant's Causeway consists of about 40,000 interlocking basalt columns." },
  { q: "The Rock of Cashel is a historic site in which county?", a: "Tipperary", options: ["Cork", "Tipperary", "Kilkenny", "Waterford"], fact: "It was the traditional seat of the kings of Munster." },
  { q: "Which county is home to the stunning Cliffs of Moher?", a: "Clare", options: ["Galway", "Kerry", "Clare", "Mayo"], fact: "The cliffs rise to 214 metres at their highest point." }
];

const GAEILGE_POOL: GaeilgeItem[] = [
  { gaeilge: 'Fáilte', english: 'Welcome' },
  { gaeilge: 'Sláinte', english: 'Health / Cheers' },
  { gaeilge: 'Madra', english: 'Dog' },
  { gaeilge: 'Cat', english: 'Cat' },
  { gaeilge: 'Uisce', english: 'Water' }
];

const SORTER_POOL: SorterItem[] = [
  { name: 'Apple Core', icon: '🍎', bin: 'Compost' },
  { name: 'Plastic Bottle', icon: '🍼', bin: 'Recycle' },
  { name: 'Glass Jar', icon: '🫙', bin: 'Recycle' },
  { name: 'Crisp Packet', icon: '🍿', bin: 'Waste' },
  { name: 'Banana Peel', icon: '🍌', bin: 'Compost' }
];

const SCRAMBLE_POOL: ScrambleItem[] = [
  { original: 'PUFFIN', scramble: 'NIFPUF', hint: 'Sea bird with a orange beak' },
  { original: 'BADGER', scramble: 'REGDAB', hint: 'Striped nocturnal mammal' },
  { original: 'OTTER', scramble: 'RETTO', hint: 'Playful river mammal' }
];

const SANCTUARY_ITEMS: SanctuaryItem[] = [
  { id: 'tree_oak', name: 'Oak Tree', icon: '🌳', cost: 100, bioPoints: 50, description: 'Supports hundreds of species. Loves being near Fungi!', synergyWith: ['mushroom'], synergyBonus: 30, color: 'emerald' },
  { id: 'pond', name: 'Freshwater Pond', icon: '💧', cost: 120, bioPoints: 80, description: 'Vital for water life. Place near Stones for Frogs!', synergyWith: ['stone', 'otter'], synergyBonus: 40, color: 'blue' },
  { id: 'flower', name: 'Wildflowers', icon: '🌸', cost: 30, bioPoints: 20, description: 'Attracts pollinators. Essential near Bees and Butterflies!', synergyWith: ['bee', 'butterfly'], synergyBonus: 50, color: 'pink' },
  { id: 'fox', name: 'Red Fox', icon: '🦊', cost: 150, bioPoints: 100, description: 'Top predator. Keeps the ecosystem balanced. Loves Oak cover.', synergyWith: ['tree_oak'], synergyBonus: 30, color: 'orange' },
  { id: 'otter', name: 'Eurasian Otter', icon: '🦦', cost: 160, bioPoints: 90, description: 'Playful river mammal. Needs clean water.', synergyWith: ['pond'], synergyBonus: 45, color: 'indigo' },
  { id: 'butterfly', name: 'Butterfly', icon: '🦋', cost: 40, bioPoints: 25, description: 'Pollinator. Huge bonus near Wildflowers.', synergyWith: ['flower'], synergyBonus: 60, color: 'cyan' },
  { id: 'bee', name: 'Irish Bee', icon: '🐝', cost: 40, bioPoints: 30, description: 'Crucial for nature. Thrives next to Wildflowers.', synergyWith: ['flower'], synergyBonus: 60, color: 'yellow' },
  { id: 'mushroom', name: 'Fungi', icon: '🍄', cost: 20, bioPoints: 15, description: 'The Wood Wide Web. Helps Trees grow deeper roots.', synergyWith: ['tree_oak'], synergyBonus: 25, color: 'red' },
  { id: 'stone', name: 'Stones', icon: '🪨', cost: 15, bioPoints: 10, description: 'Small shelter. Best placed near water for amphibians.', synergyWith: ['pond'], synergyBonus: 30, color: 'stone' }
];

const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const WildlifeGames: React.FC<WildlifeGamesProps> = ({ onEarnPoints, onClose }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'trivia' | 'landmarks' | 'gaeilge' | 'sorter' | 'scramble' | 'sanctuary'>('menu');
  
  // Memory Game State
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // Trivia/Landmarks State
  const [activeTrivia, setActiveTrivia] = useState<TriviaItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);

  // Gaeilge State
  const [activeGaeilge, setActiveGaeilge] = useState<GaeilgeItem[]>([]);
  const [gaeilgeIndex, setGaeilgeIndex] = useState(0);
  const [gaeilgeFeedback, setGaeilgeFeedback] = useState<string | null>(null);

  // Sorter State
  const [activeSorter, setActiveSorter] = useState<SorterItem[]>([]);
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterFeedback, setSorterFeedback] = useState<string | null>(null);

  // Scramble State
  const [activeScramble, setActiveScramble] = useState<ScrambleItem[]>([]);
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<'none' | 'correct' | 'wrong' | 'show'>('none');

  // Sanctuary Simulator State
  const [sanctuaryGrid, setSanctuaryGrid] = useState<(SanctuaryItem | null)[]>(Array(25).fill(null));
  const [selectedItem, setSelectedItem] = useState<SanctuaryItem | null>(null);
  const [natureCredits, setNatureCredits] = useState(500);
  const [discoveredSynergies, setDiscoveredSynergies] = useState<Set<string>>(new Set());
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  // Game Starters
  const startMemoryGame = () => {
    const selectedSpecies = shuffle(WILDLIFE_POOL).slice(0, 8);
    const deck = shuffle([...selectedSpecies, ...selectedSpecies])
      .map((item, index) => ({ id: index, icon: item.icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setActiveGame('memory');
  };

  const startTrivia = (type: 'trivia' | 'landmarks') => {
    const pool = type === 'trivia' ? TRIVIA_POOL : LANDMARK_POOL;
    setActiveTrivia(shuffle(pool).slice(0, 3));
    setCurrentQIndex(0);
    setShowFact(null);
    setActiveGame(type);
  };

  const startGaeilge = () => {
    setActiveGaeilge(shuffle(GAEILGE_POOL).slice(0, 5));
    setGaeilgeIndex(0);
    setGaeilgeFeedback(null);
    setActiveGame('gaeilge');
  };

  const startSorter = () => {
    setActiveSorter(shuffle(SORTER_POOL).slice(0, 5));
    setSorterIndex(0);
    setSorterFeedback(null);
    setActiveGame('sorter');
  };

  const startScramble = () => {
    setActiveScramble(shuffle(SCRAMBLE_POOL).slice(0, 3));
    setScrambleIndex(0);
    setScrambleInput('');
    setScrambleFeedback('none');
    setActiveGame('scramble');
  };

  // Memory Handlers
  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched || flippedIndices.length === 2) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (cards[first].icon === cards[second].icon) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[first].matched = true;
          matchedCards[second].matched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          if (matchedCards.every(c => c.matched)) {
            alert("Legendary! Memory mastered! ☘️ +10 Shamrocks!");
            onEarnPoints(10);
            setActiveGame('menu');
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[first].flipped = false;
          resetCards[second].flipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  // Sanctuary Simulator Logic
  const calculateScoreDetails = useMemo(() => {
    let base = 0;
    let synergy = 0;
    const activeSynergies: Record<number, boolean> = {};

    sanctuaryGrid.forEach((item, idx) => {
      if (!item) return;
      base += item.bioPoints;

      const neighbors = [
        idx - 5, idx + 5,
        idx % 5 !== 0 ? idx - 1 : -1,
        idx % 5 !== 4 ? idx + 1 : -1
      ];

      neighbors.forEach(nIdx => {
        if (nIdx >= 0 && nIdx < 25) {
          const neighbor = sanctuaryGrid[nIdx];
          if (neighbor && item.synergyWith?.includes(neighbor.id)) {
            synergy += item.synergyBonus || 0;
            activeSynergies[idx] = true;
            activeSynergies[nIdx] = true;
          }
        }
      });
    });

    return { total: base + synergy, base, synergy, activeSynergies };
  }, [sanctuaryGrid]);

  const handlePlace = (index: number) => {
    if (!selectedItem) return;
    let finalCredits = natureCredits;
    if (sanctuaryGrid[index]) finalCredits += sanctuaryGrid[index]!.cost;
    if (finalCredits < selectedItem.cost) return;

    const newGrid = [...sanctuaryGrid];
    newGrid[index] = selectedItem;
    setSanctuaryGrid(newGrid);
    setNatureCredits(finalCredits - selectedItem.cost);
  };

  const getMilestone = (score: number) => {
    if (score >= 2000) return { name: "Ancient Wilds", color: "text-emerald-500", icon: "✨" };
    if (score >= 1200) return { name: "Nature Reserve", color: "text-amber-500", icon: "🌳" };
    if (score >= 600) return { name: "Healthy Grove", color: "text-blue-500", icon: "🌿" };
    return { name: "Budding Sanctuary", color: "text-stone-400", icon: "🌱" };
  };

  const milestone = getMilestone(calculateScoreDetails.total);

  if (activeGame === 'menu') {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 relative text-center">
        <div className="bg-white rounded-[3rem] p-12 shadow-2xl border-t-8 border-emerald-900 overflow-hidden relative group">
          <button onClick={onClose} className="absolute top-6 right-8 text-gray-400 font-bold hover:text-emerald-900">✕</button>
          
          <h2 className="text-5xl font-black text-emerald-900 mb-4 tracking-tighter">Wildlife Hub</h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-10 font-medium">Earn points through strategic simulation and quick-fire games.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {/* Quick Games */}
            <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex flex-col items-center">
              <span className="text-4xl mb-2">🎴</span>
              <h3 className="font-black text-emerald-900 mb-2">Species Match</h3>
              <button onClick={startMemoryGame} className="w-full py-2 bg-emerald-600 text-white font-bold rounded-xl">Play</button>
            </div>
            <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 flex flex-col items-center">
              <span className="text-4xl mb-2">🦉</span>
              <h3 className="font-black text-emerald-900 mb-2">Nature Trivia</h3>
              <button onClick={() => startTrivia('trivia')} className="w-full py-2 bg-orange-500 text-white font-bold rounded-xl">Play</button>
            </div>
            <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex flex-col items-center">
              <span className="text-4xl mb-2">🇮🇪</span>
              <h3 className="font-black text-emerald-900 mb-2">Landmarks</h3>
              <button onClick={() => startTrivia('landmarks')} className="w-full py-2 bg-blue-500 text-white font-bold rounded-xl">Play</button>
            </div>
            <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100 flex flex-col items-center">
              <span className="text-4xl mb-2">♻️</span>
              <h3 className="font-black text-emerald-900 mb-2">Eco-Sorter</h3>
              <button onClick={startSorter} className="w-full py-2 bg-purple-500 text-white font-bold rounded-xl">Play</button>
            </div>
            <div className="bg-pink-50 p-6 rounded-[2rem] border border-pink-100 flex flex-col items-center">
              <span className="text-4xl mb-2">☘️</span>
              <h3 className="font-black text-emerald-900 mb-2">Gaeilge</h3>
              <button onClick={startGaeilge} className="w-full py-2 bg-pink-500 text-white font-bold rounded-xl">Play</button>
            </div>
            <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex flex-col items-center">
              <span className="text-4xl mb-2">🧩</span>
              <h3 className="font-black text-emerald-900 mb-2">Scramble</h3>
              <button onClick={startScramble} className="w-full py-2 bg-amber-500 text-white font-bold rounded-xl">Play</button>
            </div>

            {/* Big Game */}
            <button 
              onClick={() => setActiveGame('sanctuary')}
              className="lg:col-span-3 bg-emerald-900 p-8 rounded-[2.5rem] text-white text-left transition-all hover:scale-[1.01] shadow-xl group flex justify-between items-center"
            >
              <div>
                <div className="text-5xl mb-2">🏞️</div>
                <h3 className="text-2xl font-black mb-1">Sanctuary Simulator</h3>
                <p className="text-emerald-100/60 text-sm">Build habitats with complex synergies.</p>
              </div>
              <div className="bg-white/10 px-6 py-4 rounded-3xl border border-white/20 text-center">
                <div className="text-xs font-bold uppercase">Best Score</div>
                <div className="text-3xl font-black">{calculateScoreDetails.total}</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-4 px-4 h-[90vh] flex flex-col gap-4 animate-in fade-in duration-500">
      {activeGame === 'sanctuary' ? (
        <>
          <div className="bg-white rounded-[2rem] p-4 shadow-xl border border-emerald-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setActiveGame('menu')} className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">←</button>
              <div>
                <h2 className="text-xl font-black text-emerald-900 leading-none">Sanctuary Simulator</h2>
                <div className={`text-[10px] font-black uppercase tracking-widest ${milestone.color} flex items-center gap-1 mt-0.5`}>
                  {milestone.icon} {milestone.name}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
               <div className="bg-emerald-950 text-emerald-50 px-4 py-2 rounded-2xl flex flex-col items-end shadow-inner border border-emerald-800">
                  <span className="text-[8px] font-black uppercase opacity-60">Credits</span>
                  <span className="text-lg font-black leading-none">☘️ {natureCredits}</span>
               </div>
               <div className="bg-amber-400 text-amber-900 px-4 py-2 rounded-2xl flex flex-col items-end shadow-lg border border-amber-500">
                  <span className="text-[8px] font-black uppercase opacity-60">Bio-Score</span>
                  <span className="text-lg font-black leading-none">{calculateScoreDetails.total}</span>
               </div>
            </div>
          </div>
          <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
             <div className="flex-1 bg-emerald-950 rounded-[3rem] p-4 shadow-2xl border-8 border-emerald-900 flex items-center justify-center relative">
               <div className="grid grid-cols-5 gap-2 w-full max-w-lg aspect-square">
                 {sanctuaryGrid.map((item, idx) => (
                   <button
                     key={idx}
                     onClick={() => handlePlace(idx)}
                     onMouseEnter={() => setHoverIdx(idx)}
                     onMouseLeave={() => setHoverIdx(null)}
                     className={`aspect-square rounded-[1.2rem] transition-all flex items-center justify-center relative ${item ? 'bg-white shadow-xl scale-95' : 'bg-emerald-900/30'}`}
                   >
                     {item ? <span className="text-3xl">{item.icon}</span> : selectedItem && hoverIdx === idx && <span className="text-3xl opacity-20">{selectedItem.icon}</span>}
                   </button>
                 ))}
               </div>
             </div>
             <div className="w-64 bg-white rounded-[2.5rem] p-6 shadow-xl border border-emerald-50 flex flex-col shrink-0">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-800 mb-4">Palette</h4>
               <div className="grid grid-cols-3 gap-2 mb-6">
                 {SANCTUARY_ITEMS.map(item => (
                   <button
                     key={item.id}
                     onClick={() => setSelectedItem(item)}
                     className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all border-4 ${selectedItem?.id === item.id ? 'border-emerald-600 bg-emerald-50' : 'border-transparent bg-gray-50'}`}
                   >
                     <span className="text-xl">{item.icon}</span>
                     <span className="text-[8px] font-black text-emerald-800">☘️{item.cost}</span>
                   </button>
                 ))}
               </div>
               {selectedItem && (
                 <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 flex-1">
                   <h5 className="font-black text-emerald-900 text-sm">{selectedItem.name}</h5>
                   <p className="text-[9px] text-gray-500 leading-tight italic mt-1">"{selectedItem.description}"</p>
                 </div>
               )}
               <button 
                 onClick={() => {
                   onEarnPoints(Math.floor(calculateScoreDetails.total / 100));
                   setActiveGame('menu');
                 }}
                 className="w-full mt-6 py-4 bg-emerald-900 text-white font-black rounded-2xl"
               >
                 Submit Score
               </button>
             </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col bg-white rounded-[3rem] p-12 shadow-2xl relative">
          <button onClick={() => setActiveGame('menu')} className="absolute top-8 right-12 text-gray-400 font-bold hover:text-emerald-900">Back to Hub</button>
          
          {activeGame === 'memory' && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-black text-emerald-900 mb-8">Species Match</h2>
              <div className="grid grid-cols-4 gap-4 max-w-sm">
                {cards.map((card, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCardClick(idx)}
                    className={`w-16 h-16 rounded-2xl text-3xl flex items-center justify-center transition-all ${card.flipped || card.matched ? 'bg-emerald-50' : 'bg-emerald-900'}`}
                  >
                    {card.flipped || card.matched ? card.icon : '☘️'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {(activeGame === 'trivia' || activeGame === 'landmarks') && activeTrivia.length > 0 && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-black text-emerald-900 mb-8">{activeGame === 'trivia' ? 'Nature Trivia' : 'Landmarks'}</h2>
              <p className="text-xl font-bold mb-8 text-center max-w-lg">{activeTrivia[currentQIndex].q}</p>
              <div className="grid grid-cols-1 gap-3 w-full max-w-md">
                {activeTrivia[currentQIndex].options.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => {
                      if (opt === activeTrivia[currentQIndex].a) {
                        if (currentQIndex < activeTrivia.length - 1) setCurrentQIndex(prev => prev + 1);
                        else { onEarnPoints(10); setActiveGame('menu'); }
                      } else {
                        alert("Not quite! Try another game.");
                        setActiveGame('menu');
                      }
                    }}
                    className="p-4 bg-emerald-50 border-2 border-emerald-100 rounded-2xl font-bold hover:border-emerald-500"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGame === 'gaeilge' && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-black text-emerald-900 mb-8">Gaeilge Match</h2>
              <div className="text-5xl font-black text-emerald-600 mb-12">{activeGaeilge[gaeilgeIndex].gaeilge}</div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                {activeGaeilge.map(item => (
                  <button
                    key={item.english}
                    onClick={() => {
                      if (item.english === activeGaeilge[gaeilgeIndex].english) {
                        if (gaeilgeIndex < activeGaeilge.length - 1) setGaeilgeIndex(prev => prev + 1);
                        else { onEarnPoints(15); setActiveGame('menu'); }
                      }
                    }}
                    className="p-4 bg-pink-50 border-2 border-pink-100 rounded-2xl font-bold hover:border-pink-500"
                  >
                    {item.english}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeGame === 'sorter' && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-black text-emerald-900 mb-8">Eco-Sorter</h2>
              <div className="text-8xl mb-4">{activeSorter[sorterIndex].icon}</div>
              <p className="text-2xl font-black mb-12">{activeSorter[sorterIndex].name}</p>
              <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                <button onClick={() => { if (activeSorter[sorterIndex].bin === 'Compost') if (sorterIndex < activeSorter.length - 1) setSorterIndex(prev => prev + 1); else { onEarnPoints(10); setActiveGame('menu'); } }} className="p-6 bg-emerald-100 rounded-3xl font-black">🍂 Compost</button>
                <button onClick={() => { if (activeSorter[sorterIndex].bin === 'Recycle') if (sorterIndex < activeSorter.length - 1) setSorterIndex(prev => prev + 1); else { onEarnPoints(10); setActiveGame('menu'); } }} className="p-6 bg-blue-100 rounded-3xl font-black">♻️ Recycle</button>
                <button onClick={() => { if (activeSorter[sorterIndex].bin === 'Waste') if (sorterIndex < activeSorter.length - 1) setSorterIndex(prev => prev + 1); else { onEarnPoints(10); setActiveGame('menu'); } }} className="p-6 bg-stone-100 rounded-3xl font-black">🗑️ Waste</button>
              </div>
            </div>
          )}

          {activeGame === 'scramble' && (
            <div className="flex-1 flex flex-col items-center">
              <h2 className="text-3xl font-black text-emerald-900 mb-8">Wildlife Scramble</h2>
              <div className="text-5xl font-black text-amber-600 mb-4 tracking-widest">{activeScramble[scrambleIndex].scramble}</div>
              <p className="text-stone-400 italic mb-8">Hint: {activeScramble[scrambleIndex].hint}</p>
              <input 
                type="text" 
                value={scrambleInput} 
                onChange={e => setScrambleInput(e.target.value.toUpperCase())}
                className="p-4 text-center text-3xl font-black border-4 border-emerald-100 rounded-3xl outline-none mb-4"
              />
              <button 
                onClick={() => {
                  if (scrambleInput === activeScramble[scrambleIndex].original) {
                    if (scrambleIndex < activeScramble.length - 1) { setScrambleIndex(prev => prev + 1); setScrambleInput(''); }
                    else { onEarnPoints(10); setActiveGame('menu'); }
                  }
                }}
                className="px-12 py-4 bg-amber-500 text-white font-black rounded-3xl shadow-lg"
              >
                Check
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
