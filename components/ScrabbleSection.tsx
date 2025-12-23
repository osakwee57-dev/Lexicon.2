import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SCRABBLE_DATA, Difficulty, ScrabbleLevel, RESERVE_DATA } from '../data/scrabble';
import { ScrabbleWord } from '../types';
import { playSuccessSound, playFailureSound } from '../utils/audioEffects';
import { trackEvent } from '../utils/analytics';

interface ScrabbleSectionProps {
  onAddPoints: (points: number) => void;
}

const ScrabbleSection: React.FC<ScrabbleSectionProps> = ({ onAddPoints }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [subLevel, setSubLevel] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [userLetters, setUserLetters] = useState<string[]>([]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'none' | 'success' | 'fail' | 'reveal'>('none');
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  
  const [sessionWords, setSessionWords] = useState<ScrabbleWord[]>([]);
  const [usedReserveCount, setUsedReserveCount] = useState(0);

  const currentLevel = useMemo(() => {
    if (!difficulty || !subLevel) return null;
    return SCRABBLE_DATA.find(l => l.difficulty === difficulty && l.subLevel === subLevel);
  }, [difficulty, subLevel]);

  useEffect(() => {
    if (currentLevel) {
      setSessionWords([...currentLevel.words]);
      setUsedReserveCount(0);
      setWordIndex(0);
    }
  }, [currentLevel]);

  const currentWord = useMemo(() => {
    if (sessionWords.length === 0) return null;
    return sessionWords[wordIndex];
  }, [sessionWords, wordIndex]);

  const initWord = useCallback((word: ScrabbleWord) => {
    const targetText = word.text.replace(/[^A-Z]/g, '');
    const letters = targetText.split('');
    let shuffled = [...letters].sort(() => Math.random() - 0.5);
    
    if (letters.length > 1) {
      let limit = 0;
      while (shuffled.join('') === targetText && limit < 10) {
        shuffled = [...letters].sort(() => Math.random() - 0.5);
        limit++;
      }
    }
    
    setScrambledLetters(shuffled);
    setUserLetters(new Array(letters.length).fill(''));
    setFeedback('none');
  }, []);

  useEffect(() => {
    if (currentWord) {
      initWord(currentWord);
      setAttempts(0);
    }
  }, [currentWord, initWord]);

  const handleTileClick = (letter: string, index: number) => {
    if (feedback === 'success' || feedback === 'reveal') return;

    const emptyIndex = userLetters.indexOf('');
    if (emptyIndex !== -1) {
      const newUserLetters = [...userLetters];
      newUserLetters[emptyIndex] = letter;
      setUserLetters(newUserLetters);

      const newScrambled = [...scrambledLetters];
      newScrambled.splice(index, 1);
      setScrambledLetters(newScrambled);

      if (emptyIndex === userLetters.length - 1) {
        checkWord(newUserLetters.join(''));
      }
    }
  };

  const handleRemoveLetter = (index: number) => {
    if (feedback === 'success' || feedback === 'reveal') return;
    if (userLetters[index] === '') return;

    const letter = userLetters[index];
    const newUserLetters = [...userLetters];
    newUserLetters[index] = '';
    setUserLetters(newUserLetters);
    setScrambledLetters(prev => [...prev, letter]);
  };

  const handleSkip = () => {
    trackEvent('skip_scrabble_word', { word: currentWord?.text });
    if (feedback === 'success' || feedback === 'reveal' || !difficulty) return;
    
    const newWords = [...sessionWords];
    const skippedWord = newWords.splice(wordIndex, 1)[0];
    
    const reserves = RESERVE_DATA[difficulty];
    if (usedReserveCount < reserves.length) {
      const reserveItem = reserves[usedReserveCount];
      const newReserveWord: ScrabbleWord = {
        id: `reserve-${difficulty}-${usedReserveCount}`,
        text: reserveItem.text.toUpperCase(),
        phonetic: reserveItem.phonetic,
        emoji: '💡'
      };
      
      newWords.splice(wordIndex, 0, newReserveWord);
      setUsedReserveCount(prev => prev + 1);
    }
    
    newWords.push(skippedWord);
    setSessionWords(newWords);
  };

  const checkWord = (guess: string) => {
    if (!currentWord) return;
    const target = currentWord.text.replace(/[^A-Z]/g, '');

    if (guess === target) {
      setFeedback('success');
      playSuccessSound();
      trackEvent('submit_scrabble_success', { word: target, attempts });
      const earned = attempts === 0 ? 10 : attempts === 1 ? 5 : 2;
      onAddPoints(earned);
      setTimeout(() => nextWord(), 1000);
    } else {
      const nextAttempts = attempts + 1;
      playFailureSound();
      trackEvent('submit_scrabble_fail', { word: target, guess, attempts: nextAttempts });
      if (nextAttempts >= 3) {
        setFeedback('reveal');
        setUserLetters(target.split(''));
        setTimeout(() => nextWord(), 2500);
      } else {
        setFeedback('fail');
        setAttempts(nextAttempts);
        setTimeout(() => {
          initWord(currentWord);
        }, 800);
      }
    }
  };

  const nextWord = () => {
    if (wordIndex < sessionWords.length - 1) {
      setWordIndex(prev => prev + 1);
    } else {
      setIsLevelComplete(true);
    }
  };

  const resetGame = () => {
    setDifficulty(null);
    setSubLevel(null);
    setWordIndex(0);
    setIsLevelComplete(false);
    setSessionWords([]);
    setUsedReserveCount(0);
  };

  const startNextSubLevel = () => {
    if (subLevel && subLevel < 10) {
      setSubLevel(subLevel + 1);
      setWordIndex(0);
      setIsLevelComplete(false);
    } else {
      resetGame();
    }
  };

  if (isLevelComplete) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center animate-in zoom-in duration-500">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-200">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Stage Complete</h2>
          <p className="text-slate-500 mb-10 text-sm">Level {subLevel} successfully concluded.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={resetGame} className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm">
              Main Menu
            </button>
            <button onClick={startNextSubLevel} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all text-sm shadow-lg">
              {subLevel && subLevel < 10 ? 'Next Stage' : 'Finish Session'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!difficulty) {
    return (
      <div className="max-w-4xl mx-auto py-6 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10 tracking-tight">Select Difficulty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`p-12 rounded-2xl text-xl font-bold transition-all border shadow-sm ${
                  diff === 'Easy' ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-white' :
                  diff === 'Medium' ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-white' :
                  'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-500 hover:text-rose-600 hover:bg-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (difficulty && !subLevel) {
    return (
      <div className="max-w-4xl mx-auto py-6 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setDifficulty(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-slate-900">{difficulty} – Select Stage</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSubLevel(i + 1)}
                className="aspect-video bg-slate-50 border border-slate-200 rounded-xl flex flex-col items-center justify-center hover:border-indigo-600 hover:bg-white transition-all shadow-sm"
              >
                <span className="text-xl font-bold text-slate-800">{i + 1}</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Stage</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-2 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-10 shadow-sm">
        {/* HUD */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setSubLevel(null)} className="flex items-center gap-1 text-slate-400 font-bold hover:text-slate-900 transition-colors text-sm">
            <span>←</span> Back
          </button>
          <div className="flex flex-col items-center flex-1 mx-8">
            <div className="w-full max-w-xs h-1 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 transition-all duration-500" 
                style={{ width: `${((wordIndex + 1) / (sessionWords.length || 1)) * 100}%` }} 
              />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
              Unit {wordIndex + 1} of {sessionWords.length}
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <button 
              onClick={handleSkip}
              className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-500 rounded-lg font-bold text-[10px] transition-colors border border-slate-200 uppercase tracking-widest"
            >
              Skip
            </button>
          </div>
        </div>

        {currentWord && (
          <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-100 relative overflow-hidden min-h-[500px] flex flex-col items-center justify-center">
            {feedback === 'success' && (
              <div className="absolute inset-0 z-20 bg-emerald-600/95 flex flex-col items-center justify-center text-white animate-in fade-in">
                <h3 className="text-3xl font-bold mb-2">Accurate</h3>
                <p className="text-sm opacity-80 font-medium">Progress recorded</p>
              </div>
            )}
            
            {feedback === 'reveal' && (
              <div className="absolute inset-0 z-20 bg-slate-900/95 flex flex-col items-center justify-center text-white animate-in fade-in">
                <span className="text-xs text-slate-500 font-mono mb-4 tracking-[0.2em]">REVEALING UNIT</span>
                <h3 className="text-5xl font-bold text-white mb-6 tracking-tight">{currentWord.text}</h3>
                <p className="text-xs opacity-50 italic">Observation phase...</p>
              </div>
            )}

            <div className="w-full flex flex-col items-center">
              {/* Minimal Visual */}
              <div className="text-8xl mb-8 opacity-90">
                {currentWord.emoji}
              </div>
              
              {/* Phonetic Support */}
              <div className="mb-10">
                <div className="inline-block px-8 py-3 bg-slate-50 border border-slate-100 rounded-lg text-lg font-mono text-slate-600 font-medium">
                  {currentWord.phonetic}
                </div>
              </div>

              {/* Answer Slots */}
              <div className="flex flex-wrap justify-center gap-2 mb-14">
                {userLetters.map((letter, i) => (
                  <button
                    key={i}
                    onClick={() => handleRemoveLetter(i)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border flex items-center justify-center text-2xl font-bold transition-all ${
                      letter 
                        ? feedback === 'fail' 
                          ? 'bg-rose-50 border-rose-200 text-rose-700 animate-shake' 
                          : 'bg-white border-indigo-500 text-indigo-600 shadow-sm'
                        : 'bg-slate-50 border-slate-100 border-dashed text-transparent'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>

              {/* Letter Tray */}
              <div className="w-full max-w-2xl">
                <div className="flex flex-wrap justify-center gap-2">
                  {scrambledLetters.map((letter, i) => (
                    <button
                      key={`${letter}-${i}`}
                      onClick={() => handleTileClick(letter, i)}
                      className="w-12 h-12 sm:w-14 sm:h-14 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-xl font-bold text-slate-600 shadow-sm hover:border-indigo-600 hover:shadow-md transition-all active:bg-slate-50"
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px); }
          75% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.15s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default ScrabbleSection;