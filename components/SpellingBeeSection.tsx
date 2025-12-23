import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { SCRABBLE_DATA, Difficulty, RESERVE_DATA } from '../data/scrabble.ts';
import { ScrabbleWord, Progress } from '../types.ts';
import { playSuccessSound, playFailureSound } from '../utils/audioEffects.ts';
import { trackEvent } from '../utils/analytics.ts';

interface SpellingBeeSectionProps {
  onAddPoints: (points: number) => void;
  progress: Progress;
  onLevelComplete: (difficulty: string, subLevel: number) => void;
}

interface GameStats {
  score: number;
  skips: number;
  startTime: number;
  endTime: number | null;
  totalWords: number;
  attemptsCount: number;
}

const SpellingBeeSection: React.FC<SpellingBeeSectionProps> = ({ onAddPoints, progress, onLevelComplete }) => {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [subLevel, setSubLevel] = useState<number | null>(null);
  const [isGameActive, setIsGameActive] = useState(false);
  const [queue, setQueue] = useState<ScrabbleWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [usedReserveCount, setUsedReserveCount] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong' | 'reveal'>('none');
  const [stats, setStats] = useState<GameStats | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const speak = useCallback((text: string) => {
    trackEvent('play_audio_spelling', { text });
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      setHasPlayedAudio(true);
    }
  }, []);

  const startGame = (diff: Difficulty, level: number) => {
    trackEvent('start_spelling_bee', { difficulty: diff, level });
    setDifficulty(diff);
    setSubLevel(level);
    const words = SCRABBLE_DATA.find(l => l.difficulty === diff && l.subLevel === level)?.words || [];
    setQueue([...words]);
    setCurrentIndex(0);
    setUsedReserveCount(0);
    setAttempts(0);
    setUserInput('');
    setHasPlayedAudio(false);
    setFeedback('none');
    setIsGameActive(true);
    setStats({
      score: 0,
      skips: 0,
      startTime: Date.now(),
      endTime: null,
      totalWords: 10,
      attemptsCount: 0
    });
  };

  const handleSkip = () => {
    trackEvent('skip_spelling_word', { word: queue[currentIndex]?.text });
    if (!hasPlayedAudio || feedback !== 'none' || !difficulty) return;
    
    const newQueue = [...queue];
    const skippedWord = newQueue.splice(currentIndex, 1)[0];
    
    const reserves = RESERVE_DATA[difficulty];
    if (usedReserveCount < reserves.length) {
      const reserveItem = reserves[usedReserveCount];
      const newReserveWord: ScrabbleWord = {
        id: `reserve-${difficulty}-${usedReserveCount}`,
        text: reserveItem.text.toUpperCase(),
        phonetic: reserveItem.phonetic,
        emoji: '💡'
      };
      
      newQueue.splice(currentIndex, 0, newReserveWord);
      setUsedReserveCount(prev => prev + 1);
    }
    
    newQueue.push(skippedWord);
    setQueue(newQueue);
    setStats(s => s ? { ...s, skips: s.skips + 1 } : null);
    
    setHasPlayedAudio(false);
    setUserInput('');
    setAttempts(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPlayedAudio || feedback !== 'none' || !userInput.trim()) return;

    const target = queue[currentIndex].text.toUpperCase();
    const isCorrect = userInput.trim().toUpperCase() === target;

    setStats(s => s ? { ...s, attemptsCount: s.attemptsCount + 1 } : null);

    if (isCorrect) {
      trackEvent('submit_spelling_success', { word: target, attempts });
      setFeedback('correct');
      playSuccessSound();
      const points = attempts === 0 ? 10 : attempts === 1 ? 7 : 5;
      setStats(s => s ? { ...s, score: s.score + points } : null);
      onAddPoints(points);
      setTimeout(moveToNextWord, 1200);
    } else {
      const nextAttempts = attempts + 1;
      trackEvent('submit_spelling_fail', { word: target, guess: userInput, attempts: nextAttempts });
      playFailureSound();
      if (nextAttempts >= 3) {
        setFeedback('reveal');
        setTimeout(moveToNextWord, 2500);
      } else {
        setFeedback('wrong');
        setAttempts(nextAttempts);
        setTimeout(() => setFeedback('none'), 1000);
      }
    }
  };

  const moveToNextWord = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAttempts(0);
      setUserInput('');
      setHasPlayedAudio(false);
      setFeedback('none');
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setStats(s => s ? { ...s, endTime: Date.now() } : null);
      if (difficulty && subLevel) {
        onLevelComplete(difficulty, subLevel);
      }
    }
  };

  const resetToSelection = () => {
    setDifficulty(null);
    setSubLevel(null);
    setIsGameActive(false);
    setStats(null);
    setQueue([]);
    setUsedReserveCount(0);
  };

  if (!difficulty) {
    return (
      <div className="max-w-4xl mx-auto py-4 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Orthographic Assessment</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">Evaluate your spelling precision through structured auditory cues.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(['Easy', 'Medium', 'Hard'] as Difficulty[]).map(level => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`p-12 rounded-2xl text-xl font-bold transition-all border shadow-sm ${
                  level === 'Easy' ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-600 hover:bg-white' :
                  level === 'Medium' ? 'bg-slate-50 border-slate-200 text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-white' :
                  'bg-slate-50 border-slate-200 text-slate-700 hover:border-rose-500 hover:text-rose-600 hover:bg-white'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (difficulty && !isGameActive) {
    const unlockedLevel = progress[difficulty] || 1;
    return (
      <div className="max-w-4xl mx-auto py-4 animate-in fade-in">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
          <div className="flex items-center gap-4 mb-10">
            <button onClick={() => setDifficulty(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-2xl font-bold text-slate-900">{difficulty} Level Selection</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Array.from({ length: 10 }).map((_, i) => {
              const levelNum = i + 1;
              const isLocked = levelNum > unlockedLevel;
              return (
                <button
                  key={i}
                  disabled={isLocked}
                  onClick={() => startGame(difficulty, levelNum)}
                  className={`aspect-video border rounded-xl flex flex-col items-center justify-center transition-all shadow-sm ${
                    isLocked 
                      ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-50' 
                      : 'bg-white border-slate-200 hover:border-indigo-600 hover:bg-slate-50'
                  }`}
                >
                  {isLocked ? (
                    <span className="text-xs font-bold text-slate-300">LOCKED</span>
                  ) : (
                    <>
                      <span className="text-xl font-bold text-slate-800">{levelNum}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Stage</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (stats?.endTime) {
    const duration = Math.floor((stats.endTime - stats.startTime) / 1000);
    const accuracy = Math.round((stats.totalWords / stats.attemptsCount) * 100) || 0;
    
    return (
      <div className="max-w-xl mx-auto py-12 animate-in zoom-in">
        <div className="bg-white rounded-[2rem] p-12 shadow-xl border border-slate-200 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Performance Summary</h2>
          
          <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-xl overflow-hidden border border-slate-100 mb-10">
            <div className="bg-white p-6">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Score</div>
              <div className="text-2xl font-bold text-indigo-600">+{stats.score}</div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Duration</div>
              <div className="text-2xl font-bold text-slate-800">{duration}s</div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skips</div>
              <div className="text-2xl font-bold text-slate-800">{stats.skips}</div>
            </div>
            <div className="bg-white p-6">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-emerald-600">{accuracy}%</div>
            </div>
          </div>

          <button 
            onClick={resetToSelection}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-base hover:bg-slate-800 transition-all shadow-lg"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  const currentWord = queue[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <button onClick={resetToSelection} className="text-slate-400 font-bold hover:text-slate-600 text-xs uppercase tracking-widest">Abandon</button>
          <div className="flex flex-col items-center flex-1 mx-12">
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-slate-900 transition-all duration-700" 
                style={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Assessment Unit {currentIndex + 1} / {queue.length}</span>
          </div>
          <div className="text-indigo-600 font-bold text-sm">
            {stats?.score} PTS
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-12 border border-slate-100 relative overflow-hidden text-center min-h-[500px] flex flex-col items-center justify-center">
          {feedback === 'correct' && (
            <div className="absolute inset-0 z-20 bg-emerald-600/95 flex flex-col items-center justify-center text-white animate-in fade-in">
              <h3 className="text-3xl font-bold">Validated</h3>
            </div>
          )}

          {feedback === 'reveal' && (
            <div className="absolute inset-0 z-20 bg-slate-900/98 flex flex-col items-center justify-center text-white animate-in fade-in">
              <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mb-4">Correct Orthography</span>
              <h3 className="text-5xl font-bold text-white mb-8 tracking-tight">{currentWord.text}</h3>
              <p className="text-slate-500 text-xs italic">Updating memory buffers...</p>
            </div>
          )}

          <div className="w-full flex flex-col items-center">
            <div className="text-8xl mb-8 opacity-90">{currentWord.emoji}</div>
            <div className="text-sm font-mono text-slate-400 bg-white px-6 py-2 rounded-lg border border-slate-200 mb-10">
              {currentWord.phonetic}
            </div>

            <div className="flex gap-3 mb-12">
              <button 
                onClick={() => speak(currentWord.text)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.657-3.657a1 1 0 011.14-.267zM15.707 6.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 01-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0zM18.536 3.464a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Reproduce Audio
              </button>
              
              <button 
                disabled={!hasPlayedAudio || feedback !== 'none'}
                onClick={handleSkip}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border ${
                  !hasPlayedAudio ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                Skip Unit
              </button>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm relative">
              <input
                ref={inputRef}
                disabled={!hasPlayedAudio || feedback !== 'none'}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={hasPlayedAudio ? "Input Unit..." : "Awaiting Audio..."}
                autoFocus
                autoComplete="off"
                spellCheck="false"
                className={`w-full text-center text-3xl font-bold py-4 border-b-2 focus:outline-none transition-all placeholder:text-slate-200 uppercase tracking-wide ${
                  feedback === 'wrong' ? 'border-rose-500 text-rose-600 animate-shake' : 
                  !hasPlayedAudio ? 'border-slate-100 text-slate-300 bg-slate-50/50' : 'border-slate-200 text-slate-900 focus:border-indigo-600 bg-white'
                }`}
              />
              
              <div className="flex justify-center gap-1.5 mt-6">
                {[1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${attempts >= i ? 'bg-rose-500' : 'bg-slate-100'}`} 
                  />
                ))}
              </div>
              
              <button 
                type="submit"
                disabled={!hasPlayedAudio || feedback !== 'none' || !userInput.trim()}
                className="mt-8 px-10 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-20 transition-all shadow-md"
              >
                Verify Unit
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.1s ease-in-out 2;
        }
      `}</style>
    </div>
  );
};

export default SpellingBeeSection;
