
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';

interface WildlifeGamesProps {
  onEarnPoints: (points: number) => void;
}

// Interfaces for game items to ensure type safety
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
  bioPoints: number;
  description: string;
}

// Expanded pools for randomization
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
  { q: "Which sea creature is famous in Dingle Harbor?", a: "Dolphin", options: ["Whale", "Seal", "Dolphin", "Shark"], fact: "Fungie the Dingle Dolphin was a world-famous resident of the harbor for over 30 years." },
  { q: "Ireland's longest river is the...", a: "Shannon", options: ["Liffey", "Lee", "Shannon", "Barrow"], fact: "The River Shannon is 360km long and flows through or between 11 counties." }
];

const LANDMARK_POOL: TriviaItem[] = [
  { q: "In which county would you find the Giant's Causeway?", a: "Antrim", options: ["Donegal", "Antrim", "Derry", "Down"], fact: "The Giant's Causeway consists of about 40,000 interlocking basalt columns." },
  { q: "The Rock of Cashel is a historic site in which county?", a: "Tipperary", options: ["Cork", "Tipperary", "Kilkenny", "Waterford"], fact: "It was the traditional seat of the kings of Munster." },
  { q: "Which county is home to the stunning Cliffs of Moher?", a: "Clare", options: ["Galway", "Kerry", "Clare", "Mayo"], fact: "The cliffs rise to 214 metres at their highest point." },
  { q: "Newgrange, the ancient passage tomb, is in which county?", a: "Meath", options: ["Meath", "Louth", "Kildare", "Dublin"], fact: "Newgrange is older than Stonehenge and the Great Pyramids of Giza." },
  { q: "The Blarney Stone is located in which county?", a: "Cork", options: ["Cork", "Kerry", "Limerick", "Tipperary"], fact: "Legend says kissing the stone gives you 'the gift of the gab'." },
  { q: "Mount Errigal, the highest peak in its county, is found where?", a: "Donegal", options: ["Donegal", "Sligo", "Mayo", "Galway"], fact: "Errigal is known for the pinkish glow of its quartzite in the setting sun." }
];

const GAEILGE_POOL: GaeilgeItem[] = [
  { gaeilge: 'Fáilte', english: 'Welcome' },
  { gaeilge: 'Sláinte', english: 'Health / Cheers' },
  { gaeilge: 'Madra', english: 'Dog' },
  { gaeilge: 'Cat', english: 'Cat' },
  { gaeilge: 'Uisce', english: 'Water' },
  { gaeilge: 'Bia', english: 'Food' },
  { gaeilge: 'Éire', english: 'Ireland' },
  { gaeilge: 'Glas', english: 'Green' },
  { gaeilge: 'Slan', english: 'Goodbye' },
  { gaeilge: 'Maith', english: 'Good' }
];

const SORTER_POOL: SorterItem[] = [
  { name: 'Apple Core', icon: '🍎', bin: 'Compost' },
  { name: 'Plastic Bottle', icon: '🍼', bin: 'Recycle' },
  { name: 'Glass Jar', icon: '🫙', bin: 'Recycle' },
  { name: 'Crisp Packet', icon: '🍿', bin: 'Waste' },
  { name: 'Newspaper', icon: '📰', bin: 'Recycle' },
  { name: 'Banana Peel', icon: '🍌', bin: 'Compost' },
  { name: 'Broken Mirror', icon: '🪞', bin: 'Waste' },
  { name: 'Cardboard Box', icon: '📦', bin: 'Recycle' },
  { name: 'Pizza Box (Greasy)', icon: '🍕', bin: 'Waste' },
  { name: 'Tea Bag', icon: '☕', bin: 'Compost' }
];

const SCRAMBLE_POOL: ScrambleItem[] = [
  { original: 'PUFFIN', scramble: 'NIFPUF', hint: 'Sea bird with a orange beak' },
  { original: 'BADGER', scramble: 'REGDAB', hint: 'Striped nocturnal mammal' },
  { original: 'SALMON', scramble: 'NOMLAS', hint: 'Fish known for leaping upstream' },
  { original: 'CURLEW', scramble: 'WULREC', hint: 'Long-billed wading bird' },
  { original: 'OTTER', scramble: 'RETTO', hint: 'Playful river mammal' },
  { original: 'SWAN', scramble: 'WANS', hint: 'Large white water bird' },
  { original: 'FOX', scramble: 'XOF', hint: 'Clever orange canine' },
  { original: 'SEAL', scramble: 'ALES', hint: 'Sleek ocean mammal' }
];

const SANCTUARY_ITEMS: SanctuaryItem[] = [
  { id: 'tree_oak', name: 'Oak Tree', icon: '🌳', bioPoints: 50, description: 'Supports hundreds of species.' },
  { id: 'fox', name: 'Red Fox', icon: '🦊', bioPoints: 100, description: 'Top predator for a balanced ecosystem.' },
  { id: 'pond', name: 'Freshwater Pond', icon: '💧', bioPoints: 80, description: 'Vital for amphibians and insects.' },
  { id: 'flower', name: 'Wildflowers', icon: '🌸', bioPoints: 20, description: 'Attracts bees and butterflies.' },
  { id: 'stone', name: 'Ancient Stones', icon: '🪨', bioPoints: 15, description: 'Perfect shelter for lizards.' },
  { id: 'deer', name: 'Red Deer', icon: '🦌', bioPoints: 120, description: 'Majestic forest wanderer.' },
  { id: 'butterfly', name: 'Butterfly', icon: '🦋', bioPoints: 25, description: 'A sign of a healthy garden.' },
  { id: 'mushroom', name: 'Fungi', icon: '🍄', bioPoints: 10, description: 'Breaks down organic matter.' },
  { id: 'clover', name: 'Clover Patch', icon: '🍀', bioPoints: 5, description: 'Small but mighty for the soil.' }
];

const shuffle = <T,>(array: T[]): T[] => [...array].sort(() => Math.random() - 0.5);

export const WildlifeGames: React.FC<WildlifeGamesProps> = ({ onEarnPoints }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'trivia' | 'sorter' | 'scramble' | 'gaeilge' | 'landmarks' | 'sanctuary'>('menu');
  
  // Game States
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [activeTrivia, setActiveTrivia] = useState<TriviaItem[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);
  const [activeGaeilge, setActiveGaeilge] = useState<GaeilgeItem[]>([]);
  const [gaeilgeIndex, setGaeilgeIndex] = useState(0);
  const [gaeilgeFeedback, setGaeilgeFeedback] = useState<string | null>(null);
  const [activeSorter, setActiveSorter] = useState<SorterItem[]>([]);
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterFeedback, setSorterFeedback] = useState<string | null>(null);
  const [activeScramble, setActiveScramble] = useState<ScrambleItem[]>([]);
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<'none' | 'correct' | 'wrong' | 'show'>('none');

  // Sanctuary Game State
  const [sanctuaryGrid, setSanctuaryGrid] = useState<(SanctuaryItem | null)[]>(Array(25).fill(null));
  const [selectedSanctuaryItem, setSelectedSanctuaryItem] = useState<SanctuaryItem | null>(null);

  const startMemoryGame = () => {
    const selectedSpecies = shuffle(WILDLIFE_POOL).slice(0, 8);
    const deck = shuffle([...selectedSpecies, ...selectedSpecies])
      .map((item, index) => ({ id: index, icon: item.icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setActiveGame('memory');
  };

  const startTrivia = (type: 'nature' | 'landmarks') => {
    const pool = type === 'nature' ? TRIVIA_POOL : LANDMARK_POOL;
    setActiveTrivia(shuffle(pool).slice(0, 3));
    setCurrentQIndex(0);
    setShowFact(null);
    setActiveGame(type === 'nature' ? 'trivia' : 'landmarks');
  };

  const startGaeilge = () => {
    setActiveGaeilge(shuffle(GAEILGE_POOL).slice(0, 5));
    setGaeilgeIndex(0);
    setGaeilgeFeedback(null);
    setActiveGame('gaeilge');
  };

  const startSorter = () => {
    setActiveSorter(shuffle(SORTER_POOL).slice(0, 6));
    setSorterIndex(0);
    setSorterFeedback(null);
    setActiveGame('sorter');
  };

  const startScramble = () => {
    setActiveScramble(shuffle(SCRAMBLE_POOL).slice(0, 4));
    setScrambleIndex(0);
    setScrambleInput('');
    setScrambleFeedback('none');
    setActiveGame('scramble');
  };

  const startSanctuary = () => {
    setSanctuaryGrid(Array(25).fill(null));
    setSelectedSanctuaryItem(null);
    setActiveGame('sanctuary');
  };

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

  const handleTriviaAnswer = (option: string) => {
    const question = activeTrivia[currentQIndex];
    if (option === question.a) {
      setShowFact(`Correct! ${question.fact}`);
    } else {
      setShowFact(`Not quite! The correct answer was "${question.a}". ${question.fact}`);
    }
  };

  const handleGaeilgeMatch = (option: string) => {
    const item = activeGaeilge[gaeilgeIndex];
    if (option === item.english) {
      setGaeilgeFeedback(`Correct! "${item.gaeilge}" means "${item.english}".`);
    } else {
      setGaeilgeFeedback(`Actually, "${item.gaeilge}" means "${item.english}". (You chose "${option}")`);
    }
  };

  const handleSort = (bin: string) => {
    const item = activeSorter[sorterIndex];
    if (bin === item.bin) {
      setSorterFeedback(`Spot on! The ${item.name} belongs in the ${item.bin} bin.`);
    } else {
      setSorterFeedback(`Actually, the ${item.name} should go in the ${item.bin} bin.`);
    }
  };

  const handleScrambleSubmit = () => {
    const word = activeScramble[scrambleIndex];
    if (scrambleInput.toUpperCase().trim() === word.original) {
      setScrambleFeedback('correct');
    } else {
      setScrambleFeedback('wrong');
    }
  };

  const handlePlaceSanctuaryItem = (index: number) => {
    if (!selectedSanctuaryItem) return;
    const newGrid = [...sanctuaryGrid];
    newGrid[index] = selectedSanctuaryItem;
    setSanctuaryGrid(newGrid);
  };

  const calculateBiodiversity = () => {
    return sanctuaryGrid.reduce((sum, item) => sum + (item?.bioPoints || 0), 0);
  };

  const handleSubmitSanctuary = () => {
    const score = calculateBiodiversity();
    if (score === 0) {
      alert("Place some items in your sanctuary first!");
      return;
    }
    const reward = Math.floor(score / 50) + 5; // Base reward + scaled reward
    alert(`Stunning Sanctuary! You achieved a Biodiversity Score of ${score}. ☘️ +${reward} Shamrocks!`);
    onEarnPoints(reward);
    setActiveGame('menu');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-emerald-600 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🎴</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Species Match</h3>
            <p className="text-sm text-gray-500 mb-6">Memory game featuring random native Irish animals.</p>
            <button onClick={startMemoryGame} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-orange-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🦉</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Nature Trivia</h3>
            <p className="text-sm text-gray-500 mb-6">Test your knowledge with 3 random nature questions.</p>
            <button onClick={() => startTrivia('nature')} className="w-full py-3 bg-orange-50 text-orange-700 font-bold rounded-xl shadow-lg hover:bg-orange-100 border border-orange-200">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-gold text-center hover:translate-y-[-4px] transition-all" style={{ borderTopColor: COLORS.gold }}>
            <div className="text-5xl mb-4">🇮🇪</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Landmark Quest</h3>
            <p className="text-sm text-gray-500 mb-6">Randomly selected Irish geography challenge.</p>
            <button onClick={() => startTrivia('landmarks')} className="w-full py-3 bg-emerald-100 text-emerald-900 font-bold rounded-xl shadow-lg hover:bg-emerald-200">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-emerald-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🇮🇪</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Gaeilge Match</h3>
            <p className="text-sm text-gray-500 mb-6">Learn 5 random Irish words each time you play.</p>
            <button onClick={startGaeilge} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-blue-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">♻️</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Eco-Sorter</h3>
            <p className="text-sm text-gray-500 mb-6">Sort 6 random waste items into the correct bins.</p>
            <button onClick={startSorter} className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-purple-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🧩</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Wildlife Scramble</h3>
            <p className="text-sm text-gray-500 mb-6">Unscramble 4 random native species names.</p>
            <button onClick={startScramble} className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl shadow-lg hover:bg-purple-600">Play</button>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-emerald-500 text-center hover:translate-y-[-4px] transition-all lg:col-span-3">
            <div className="text-5xl mb-4">🏞️</div>
            <h3 className="text-2xl font-black text-emerald-900 mb-2">Nature Sanctuary Builder</h3>
            <p className="text-sm text-gray-500 mb-6">Design your own Irish nature reserve. Place species to increase biodiversity!</p>
            <button onClick={startSanctuary} className="max-w-xs mx-auto w-full py-4 bg-emerald-900 text-white font-black rounded-2xl shadow-xl hover:bg-black transition-colors">Start Building</button>
          </div>
        </div>
      )}

      {activeGame === 'memory' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-emerald-900">Species Match</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 hover:text-emerald-600 font-bold text-sm">Exit</button>
          </div>
          <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => handleCardClick(idx)}
                className={`aspect-square rounded-xl cursor-pointer transition-all duration-300 transform flex items-center justify-center text-3xl shadow-sm ${
                  card.flipped || card.matched ? 'bg-emerald-50' : 'bg-emerald-800'
                }`}
              >
                {(card.flipped || card.matched) ? card.icon : '☘️'}
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeGame === 'trivia' || activeGame === 'landmarks') && activeTrivia.length > 0 && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-emerald-900">{activeGame === 'trivia' ? 'Nature Trivia' : 'Landmark Quest'}</h3>
            <span className="text-orange-500 font-bold text-sm">Q {currentQIndex + 1}/{activeTrivia.length}</span>
          </div>
          <div className="mb-10">
            <p className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">{activeTrivia[currentQIndex].q}</p>
            <div className="grid grid-cols-1 gap-3">
              {activeTrivia[currentQIndex].options.map(opt => (
                <button
                  key={opt}
                  disabled={showFact !== null}
                  onClick={() => handleTriviaAnswer(opt)}
                  className={`p-4 rounded-xl font-bold transition-all border-2 text-left ${
                    showFact ? (opt === activeTrivia[currentQIndex].a ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800') 
                    : 'bg-white border-emerald-50 text-emerald-900 hover:border-emerald-500 hover:bg-emerald-50'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          {showFact && (
            <div className="bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-100 animate-in fade-in slide-in-from-bottom duration-500">
              <p className="text-emerald-900 text-sm font-medium italic mb-4">"{showFact}"</p>
              <button onClick={() => {
                if (currentQIndex < activeTrivia.length - 1) {
                  setCurrentQIndex(prev => prev + 1);
                  setShowFact(null);
                } else {
                  alert(`Game Complete! ☘️ +10 Shamrocks!`);
                  onEarnPoints(10);
                  setActiveGame('menu');
                }
              }} className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 text-sm">Next Question</button>
            </div>
          )}
        </div>
      )}

      {activeGame === 'gaeilge' && activeGaeilge.length > 0 && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-100 text-center">
          <div className="flex justify-between items-center mb-8 text-left">
            <h3 className="text-2xl font-black text-emerald-900">Gaeilge Match</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-sm">Exit</button>
          </div>
          <div className="mb-12">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-2">Translate this word:</p>
            <div className="text-5xl font-black text-emerald-900 mb-2">{activeGaeilge[gaeilgeIndex].gaeilge}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {shuffle(activeGaeilge).map((item: GaeilgeItem) => (
              <button 
                key={item.english}
                disabled={gaeilgeFeedback !== null}
                onClick={() => handleGaeilgeMatch(item.english)}
                className={`p-4 rounded-2xl font-bold transition-all border-2 text-center ${
                  gaeilgeFeedback ? (item.english === activeGaeilge[gaeilgeIndex].english ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-300')
                  : 'bg-white border-emerald-50 text-emerald-800 hover:border-emerald-500 hover:bg-emerald-50 shadow-sm'
                }`}
              >
                {item.english}
              </button>
            ))}
          </div>
          {gaeilgeFeedback && (
            <div className="mt-8 bg-emerald-50 p-6 rounded-2xl border-2 border-emerald-100 animate-in fade-in slide-in-from-bottom duration-500">
              <p className="text-emerald-900 text-sm font-medium italic mb-4">{gaeilgeFeedback}</p>
              <button onClick={() => {
                if (gaeilgeIndex < activeGaeilge.length - 1) {
                  setGaeilgeIndex(prev => prev + 1);
                  setGaeilgeFeedback(null);
                } else {
                  alert(`Maith thú! Gaeilge Match complete! ☘️ +15 Shamrocks!`);
                  onEarnPoints(15);
                  setActiveGame('menu');
                }
              }} className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 text-sm">Continue</button>
            </div>
          )}
        </div>
      )}

      {activeGame === 'sorter' && activeSorter.length > 0 && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-blue-100 text-center">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-blue-900">Eco-Sorter</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-sm">Exit</button>
          </div>
          <div className="mb-12">
            <div className="text-8xl mb-4 animate-bounce">{activeSorter[sorterIndex].icon}</div>
            <p className="text-xl font-bold text-gray-700">{activeSorter[sorterIndex].name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button disabled={sorterFeedback !== null} onClick={() => handleSort('Compost')} className="p-6 bg-emerald-100 text-emerald-800 font-black rounded-2xl border-2 border-emerald-300 hover:bg-emerald-200 disabled:opacity-50">🍂 Compost</button>
            <button disabled={sorterFeedback !== null} onClick={() => handleSort('Recycle')} className="p-6 bg-blue-100 text-blue-800 font-black rounded-2xl border-2 border-blue-300 hover:bg-blue-200 disabled:opacity-50">♻️ Recycle</button>
            <button disabled={sorterFeedback !== null} onClick={() => handleSort('Waste')} className="p-6 bg-stone-100 text-stone-800 font-black rounded-2xl border-2 border-stone-300 hover:bg-stone-200 disabled:opacity-50">🗑️ Waste</button>
          </div>
          {sorterFeedback && (
            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 animate-in fade-in slide-in-from-bottom duration-500">
              <p className="text-blue-900 text-sm font-medium italic mb-4">{sorterFeedback}</p>
              <button onClick={() => {
                if (sorterIndex < activeSorter.length - 1) {
                  setSorterIndex(prev => prev + 1);
                  setSorterFeedback(null);
                } else {
                  alert(`Sorting complete! ☘️ +10 Shamrocks!`);
                  onEarnPoints(10);
                  setActiveGame('menu');
                }
              }} className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 text-sm">Next Item</button>
            </div>
          )}
        </div>
      )}

      {activeGame === 'scramble' && activeScramble.length > 0 && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-purple-100 text-center">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-purple-900">Wildlife Scramble</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-sm">Exit</button>
          </div>
          <div className="mb-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Unscramble this:</p>
            <div className="text-4xl font-black text-purple-600 tracking-tighter mb-4">
              {scrambleFeedback === 'show' ? activeScramble[scrambleIndex].original : activeScramble[scrambleIndex].scramble}
            </div>
            <p className="text-stone-500 italic text-sm">Hint: {activeScramble[scrambleIndex].hint}</p>
          </div>
          <div className="space-y-4 max-w-sm mx-auto">
            {scrambleFeedback !== 'correct' && scrambleFeedback !== 'show' ? (
              <>
                <input
                  type="text"
                  value={scrambleInput}
                  onChange={(e) => setScrambleInput(e.target.value.toUpperCase())}
                  onKeyPress={(e) => e.key === 'Enter' && handleScrambleSubmit()}
                  className={`w-full p-4 text-center text-2xl font-black rounded-2xl border-4 outline-none transition-all ${
                    scrambleFeedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-purple-100 bg-purple-50 focus:border-purple-500'
                  }`}
                  placeholder="GUESS WORD"
                />
                <div className="flex gap-2">
                  <button onClick={handleScrambleSubmit} className="flex-1 py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:bg-purple-700">Check</button>
                  <button onClick={() => setScrambleFeedback('show')} className="px-4 py-4 bg-gray-100 text-gray-500 font-bold rounded-2xl border border-gray-200 text-xs">Show Answer</button>
                </div>
              </>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom duration-500">
                <p className="text-emerald-600 font-black mb-4">
                  {scrambleFeedback === 'correct' ? 'Proper legend! Correct!' : `The word was ${activeScramble[scrambleIndex].original}.`}
                </p>
                <button onClick={() => {
                  if (scrambleIndex < activeScramble.length - 1) {
                    setScrambleIndex(prev => prev + 1);
                    setScrambleInput('');
                    setScrambleFeedback('none');
                  } else {
                    alert(`Unscrambled! ☘️ +10 Shamrocks!`);
                    onEarnPoints(10);
                    setActiveGame('menu');
                  }
                }} className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg">Next Word</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeGame === 'sanctuary' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-100 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-3xl font-black text-emerald-900">Sanctuary Builder</h3>
              <p className="text-sm text-gray-500">Place items on the grid to create a thriving nature reserve.</p>
            </div>
            <div className="flex flex-col items-end">
              <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl font-black flex items-center gap-2">
                <span>🦋</span> Bio Score: {calculateBiodiversity()}
              </div>
              <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-xs mt-2 hover:text-emerald-600">Exit Game</button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* The Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-5 gap-1 bg-emerald-50 p-2 rounded-3xl border-2 border-emerald-100 shadow-inner max-w-md mx-auto aspect-square">
                {sanctuaryGrid.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlaceSanctuaryItem(idx)}
                    className={`aspect-square rounded-xl transition-all duration-200 flex items-center justify-center text-3xl hover:bg-emerald-200/50 ${
                      item ? 'bg-white shadow-sm' : 'bg-transparent'
                    } ${selectedSanctuaryItem && !item ? 'hover:scale-105 hover:shadow-md border-2 border-dashed border-emerald-200' : 'border-2 border-transparent'}`}
                  >
                    {item?.icon}
                  </button>
                ))}
              </div>
            </div>

            {/* The Inventory */}
            <div className="lg:w-72 bg-emerald-50 rounded-[2.5rem] p-6 border-2 border-emerald-100">
              <h4 className="font-black text-emerald-900 mb-4 text-sm uppercase tracking-widest">Select Item</h4>
              <div className="grid grid-cols-3 gap-2">
                {SANCTUARY_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSanctuaryItem(item)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all border-4 ${
                      selectedSanctuaryItem?.id === item.id 
                        ? 'border-emerald-600 bg-white scale-110 shadow-lg' 
                        : 'border-transparent bg-white/50 hover:bg-white hover:border-emerald-200'
                    }`}
                    title={item.name}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
              {selectedSanctuaryItem && (
                <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm animate-in fade-in zoom-in duration-300">
                  <div className="font-black text-emerald-900 text-sm mb-1">{selectedSanctuaryItem.name}</div>
                  <div className="text-[10px] text-emerald-600 font-bold mb-2 uppercase">+ {selectedSanctuaryItem.bioPoints} Bio Points</div>
                  <p className="text-[10px] text-gray-500 leading-tight">{selectedSanctuaryItem.description}</p>
                </div>
              )}
              <button 
                onClick={handleSubmitSanctuary}
                className="w-full mt-6 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all"
              >
                Submit Sanctuary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
