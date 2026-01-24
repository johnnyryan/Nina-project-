
import React, { useState, useEffect } from 'react';
import { COLORS } from '../constants';

interface WildlifeGamesProps {
  onEarnPoints: (points: number) => void;
}

const WILDLIFE_POOL = [
  { icon: '🦊', name: 'Red Fox' },
  { icon: '🦌', name: 'Red Deer' },
  { icon: '🐿️', name: 'Red Squirrel' },
  { icon: '🦡', name: 'European Badger' },
  { icon: '🦭', name: 'Grey Seal' },
  { icon: '🦅', name: 'Golden Eagle' },
  { icon: '🦢', name: 'Mute Swan' },
  { icon: '🦦', name: 'Eurasian Otter' }
];

const TRIVIA_QUESTIONS = [
  {
    q: "Which bird is often seen on the Cliffs of Moher and has a colorful beak?",
    a: "Puffin",
    options: ["Puffin", "Seagull", "Gannet", "Robin"],
    fact: "Puffins spend most of their lives at sea but return to the Irish coast to breed in spring."
  },
  {
    q: "What is Ireland's only native reptile?",
    a: "Viviparous Lizard",
    options: ["Slow Worm", "Viviparous Lizard", "Grass Snake", "Adder"],
    fact: "The Viviparous Lizard is also known as the Common Lizard and is protected under Irish law."
  },
  {
    q: "Which large mammal was reintroduced to Killarney National Park?",
    a: "Red Deer",
    options: ["Fallow Deer", "Red Deer", "Roe Deer", "Muntjac Deer"],
    fact: "Red Deer are Ireland's largest land mammals and have been here since the last Ice Age."
  }
];

const SORTER_ITEMS = [
  { name: 'Apple Core', icon: '🍎', bin: 'Compost' },
  { name: 'Plastic Bottle', icon: '🍼', bin: 'Recycle' },
  { name: 'Glass Jar', icon: '🫙', bin: 'Recycle' },
  { name: 'Crisp Packet', icon: '🍿', bin: 'Waste' },
  { name: 'Newspaper', icon: '📰', bin: 'Recycle' },
  { name: 'Banana Peel', icon: '🍌', bin: 'Compost' },
  { name: 'Broken Mirror', icon: '🪞', bin: 'Waste' },
];

const SCRAMBLE_WORDS = [
  { original: 'PUFFIN', scramble: 'NIFPUF', hint: 'Sea bird with a orange beak' },
  { original: 'BADGER', scramble: 'REGDAB', hint: 'Striped nocturnal mammal' },
  { original: 'SALMON', scramble: 'NOMLAS', hint: 'Fish known for leaping upstream' },
  { original: 'CURLEW', scramble: 'WULREC', hint: 'Long-billed wading bird' },
  { original: 'OTTER', scramble: 'RETTO', hint: 'Playful river mammal' },
];

export const WildlifeGames: React.FC<WildlifeGamesProps> = ({ onEarnPoints }) => {
  const [activeGame, setActiveGame] = useState<'menu' | 'memory' | 'trivia' | 'sorter' | 'scramble'>('menu');
  
  // Memory Game State
  const [cards, setCards] = useState<{ id: number, icon: string, flipped: boolean, matched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  
  // Trivia State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [showFact, setShowFact] = useState<string | null>(null);

  // Sorter State
  const [sorterIndex, setSorterIndex] = useState(0);
  const [sorterScore, setSorterScore] = useState(0);

  // Scramble State
  const [scrambleIndex, setScrambleIndex] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<'none' | 'correct' | 'wrong'>('none');

  const startMemoryGame = () => {
    const deck = [...WILDLIFE_POOL, ...WILDLIFE_POOL]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({ id: index, icon: item.icon, flipped: false, matched: false }));
    setCards(deck);
    setFlippedIndices([]);
    setActiveGame('memory');
  };

  const startTrivia = () => {
    setCurrentQIndex(0);
    setTriviaScore(0);
    setShowFact(null);
    setActiveGame('trivia');
  };

  const startSorter = () => {
    setSorterIndex(0);
    setSorterScore(0);
    setActiveGame('sorter');
  };

  const startScramble = () => {
    setScrambleIndex(0);
    setScrambleInput('');
    setScrambleFeedback('none');
    setActiveGame('scramble');
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
            alert("Legendary! You matched all the species! ☘️ +10 Shamrocks!");
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
        }, 1000);
      }
    }
  };

  const handleTriviaAnswer = (option: string) => {
    const question = TRIVIA_QUESTIONS[currentQIndex];
    if (option === question.a) {
      setTriviaScore(prev => prev + 1);
      setShowFact(question.fact);
    } else {
      setShowFact(`Not quite! The answer was ${question.a}. ${question.fact}`);
    }
  };

  const handleSort = (bin: string) => {
    const item = SORTER_ITEMS[sorterIndex];
    if (bin === item.bin) {
      setSorterScore(prev => prev + 1);
    }
    if (sorterIndex < SORTER_ITEMS.length - 1) {
      setSorterIndex(prev => prev + 1);
    } else {
      alert(`Sorting complete! ☘️ +10 Shamrocks!`);
      onEarnPoints(10);
      setActiveGame('menu');
    }
  };

  const handleScrambleSubmit = () => {
    const word = SCRAMBLE_WORDS[scrambleIndex];
    if (scrambleInput.toUpperCase().trim() === word.original) {
      setScrambleFeedback('correct');
      setTimeout(() => {
        if (scrambleIndex < SCRAMBLE_WORDS.length - 1) {
          setScrambleIndex(prev => prev + 1);
          setScrambleInput('');
          setScrambleFeedback('none');
        } else {
          alert(`Master Linguist! You unscrambled all the wildlife! ☘️ +10 Shamrocks!`);
          onEarnPoints(10);
          setActiveGame('menu');
        }
      }, 1000);
    } else {
      setScrambleFeedback('wrong');
      setTimeout(() => setScrambleFeedback('none'), 1000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {activeGame === 'menu' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-emerald-600 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🎴</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Species Match</h3>
            <p className="text-sm text-gray-500 mb-6">Memory game featuring native Irish animals.</p>
            <button onClick={startMemoryGame} className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg hover:bg-emerald-700">Play</button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-orange-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🦉</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Nature Trivia</h3>
            <p className="text-sm text-gray-500 mb-6">Test your knowledge of the Isle's biodiversity.</p>
            <button onClick={startTrivia} className="w-full py-3 bg-orange-50 text-orange-700 font-bold rounded-xl shadow-lg hover:bg-orange-100 border border-orange-200">Play</button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-blue-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">♻️</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Eco-Sorter</h3>
            <p className="text-sm text-gray-500 mb-6">Quickly sort waste into the correct bins.</p>
            <button onClick={startSorter} className="w-full py-3 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600">Play</button>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border-t-8 border-purple-400 text-center hover:translate-y-[-4px] transition-all">
            <div className="text-5xl mb-4">🧩</div>
            <h3 className="text-xl font-black text-emerald-900 mb-2">Wildlife Scramble</h3>
            <p className="text-sm text-gray-500 mb-6">Unscramble the names of native species.</p>
            <button onClick={startScramble} className="w-full py-3 bg-purple-500 text-white font-bold rounded-xl shadow-lg hover:bg-purple-600">Play</button>
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

      {activeGame === 'trivia' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-emerald-900">Nature Trivia</h3>
            <span className="text-orange-500 font-bold text-sm">Q {currentQIndex + 1}/{TRIVIA_QUESTIONS.length}</span>
          </div>
          
          <div className="mb-10">
            <p className="text-lg font-bold text-gray-800 mb-6 leading-relaxed">{TRIVIA_QUESTIONS[currentQIndex].q}</p>
            <div className="grid grid-cols-1 gap-3">
              {TRIVIA_QUESTIONS[currentQIndex].options.map(opt => (
                <button
                  key={opt}
                  disabled={showFact !== null}
                  onClick={() => handleTriviaAnswer(opt)}
                  className={`p-4 rounded-xl font-bold transition-all border-2 text-left ${
                    showFact ? (opt === TRIVIA_QUESTIONS[currentQIndex].a ? 'bg-emerald-100 border-emerald-500 text-emerald-800' : 'bg-gray-50 border-gray-100 text-gray-300') 
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
                if (currentQIndex < TRIVIA_QUESTIONS.length - 1) {
                  setCurrentQIndex(prev => prev + 1);
                  setShowFact(null);
                } else {
                  alert(`Trivia Complete! Score: ${triviaScore}/${TRIVIA_QUESTIONS.length}. ☘️ +10 Shamrocks!`);
                  onEarnPoints(10);
                  setActiveGame('menu');
                }
              }} className="px-8 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-md hover:bg-emerald-700 text-sm">Next</button>
            </div>
          )}
        </div>
      )}

      {activeGame === 'sorter' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-blue-100 text-center">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-blue-900">Eco-Sorter</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-sm">Exit</button>
          </div>
          <div className="mb-12">
            <div className="text-8xl mb-4 animate-bounce">{SORTER_ITEMS[sorterIndex].icon}</div>
            <p className="text-xl font-bold text-gray-700">{SORTER_ITEMS[sorterIndex].name}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => handleSort('Compost')} className="p-6 bg-emerald-100 text-emerald-800 font-black rounded-2xl border-2 border-emerald-300 hover:bg-emerald-200">🍂 Compost</button>
            <button onClick={() => handleSort('Recycle')} className="p-6 bg-blue-100 text-blue-800 font-black rounded-2xl border-2 border-blue-300 hover:bg-blue-200">♻️ Recycle</button>
            <button onClick={() => handleSort('Waste')} className="p-6 bg-stone-100 text-stone-800 font-black rounded-2xl border-2 border-stone-300 hover:bg-stone-200">🗑️ Waste</button>
          </div>
        </div>
      )}

      {activeGame === 'scramble' && (
        <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-purple-100 text-center">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-purple-900">Wildlife Scramble</h3>
            <button onClick={() => setActiveGame('menu')} className="text-gray-400 font-bold text-sm">Exit</button>
          </div>
          <div className="mb-8">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Unscramble this:</p>
            <div className="text-4xl font-black text-purple-600 tracking-tighter mb-4">{SCRAMBLE_WORDS[scrambleIndex].scramble}</div>
            <p className="text-stone-500 italic text-sm">Hint: {SCRAMBLE_WORDS[scrambleIndex].hint}</p>
          </div>
          <div className="space-y-4 max-w-sm mx-auto">
            <input
              type="text"
              value={scrambleInput}
              onChange={(e) => setScrambleInput(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleScrambleSubmit()}
              className={`w-full p-4 text-center text-2xl font-black rounded-2xl border-4 outline-none transition-all ${
                scrambleFeedback === 'correct' ? 'border-emerald-500 bg-emerald-50' : 
                scrambleFeedback === 'wrong' ? 'border-red-500 bg-red-50' : 'border-purple-100 bg-purple-50 focus:border-purple-500'
              }`}
              placeholder="GUESS WORD"
            />
            <button 
              onClick={handleScrambleSubmit}
              className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl shadow-lg hover:bg-purple-700"
            >
              Check Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
