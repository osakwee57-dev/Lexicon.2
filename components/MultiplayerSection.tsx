
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SCRABBLE_DATA } from '../data/scrabble';
import { playSuccessSound, playFailureSound } from '../utils/audioEffects';
import { trackEvent } from '../utils/analytics';

interface MultiplayerSectionProps {
  onAddPoints: (points: number) => void;
}

interface Player {
  id: string;
  name: string;
  hp: number;
  isHost: boolean;
}

interface DuelWord {
  word: string;
  phonetic: string;
  meaning: string;
  emoji: string;
  difficulty: 'Medium' | 'Hard' | 'Ultra-Hard';
}

const ULTRA_HARD_WORDS: DuelWord[] = [
  { word: 'Pneumonoultramicroscopicsilicovolcanoconiosis', phonetic: '/ˌnjuː.mə.noʊˌʌl.trəˌmaɪ.krəˌskɒ.pɪkˌsɪ.lɪ.koʊ.vɒlˌkeɪ.noʊˌkoʊ.niˈoʊ.sɪs/', meaning: 'Lung disease.', emoji: '🌋', difficulty: 'Ultra-Hard' },
  { word: 'Floccinaucinihilipilification', phonetic: '/ˌflɒk.sɪˌnɔː.sɪˌnaɪ.hɪˌlɪ.pɪ.lɪ.fɪˈkeɪ.ʃən/', meaning: 'Worthlessness.', emoji: '📉', difficulty: 'Ultra-Hard' },
  { word: 'Antidisestablishmentarianism', phonetic: '/ˌæn.tiˌdɪs.ɪsˌtæb.lɪʃ.mənˈtɛə.ri.ə.nɪ.zəm/', meaning: 'Political concept.', emoji: '⛪', difficulty: 'Ultra-Hard' },
  { word: 'Incomprehensibilities', phonetic: '/ˌɪn.kɒm.prɪˌhɛn.səˈbɪ.lɪ.tiz/', meaning: 'Unintelligibility.', emoji: '🧩', difficulty: 'Ultra-Hard' }
];

type GamePhase = 'lobby' | 'waiting' | 'battle' | 'ended';

const MultiplayerSection: React.FC<MultiplayerSectionProps> = ({ onAddPoints }) => {
  const [phase, setPhase] = useState<GamePhase>('lobby');
  const [roomCode, setRoomCode] = useState('');
  const [myId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [players, setPlayers] = useState<Player[]>([]);
  const [wordPool, setWordPool] = useState<DuelWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isWordResolved, setIsWordResolved] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);

  const broadcast = useCallback((type: string, payload: any) => {
    channelRef.current?.postMessage({ type, payload, senderId: myId });
  }, [myId]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    const { type, payload, senderId } = event.data;
    if (senderId === myId) return;

    switch (type) {
      case 'JOIN_REQUEST':
        const host = players.find(p => p.id === myId)?.isHost;
        if (host) {
          if (players.length >= 4) {
            broadcast('JOIN_FAILURE', { targetId: senderId, reason: 'Capacity Reached' });
          } else if (phase !== 'waiting') {
            broadcast('JOIN_FAILURE', { targetId: senderId, reason: 'Session In Progress' });
          } else {
            const newPlayer: Player = { id: senderId, name: `Client ${players.length + 1}`, hp: 100, isHost: false };
            const updatedPlayers = [...players, newPlayer];
            setPlayers(updatedPlayers);
            broadcast('LOBBY_UPDATE', { players: updatedPlayers });
          }
        }
        break;
      case 'JOIN_FAILURE':
        if (payload.targetId === myId) {
          setError(payload.reason);
          setPhase('lobby');
        }
        break;
      case 'LOBBY_UPDATE':
        setPlayers(payload.players);
        break;
      case 'START_GAME':
        setWordPool(payload.pool);
        setPhase('battle');
        setBattleLog(["Session Initialized"]);
        break;
      case 'STRIKE_DEALT':
        setPlayers(prev => prev.map(p => 
          p.id !== senderId ? { ...p, hp: Math.max(0, p.hp - payload.damage) } : p
        ));
        const striker = players.find(p => p.id === senderId)?.name || 'Peer';
        setBattleLog(prev => [`${striker} valid strike: "${payload.word}"`, ...prev]);
        setIsWordResolved(true);
        if (senderId !== myId) speak("Incoming strike");
        break;
      case 'PLAYER_DISCONNECTED':
        setPlayers(prev => prev.filter(p => p.id !== senderId));
        setBattleLog(prev => [`Peer disconnected: ${senderId}`, ...prev]);
        break;
    }
  }, [players, myId, phase, broadcast, speak]);

  useEffect(() => {
    if (roomCode) {
      channelRef.current = new BroadcastChannel(`lexicon_room_v3_${roomCode}`);
      channelRef.current.onmessage = handleMessage;
      const handleUnload = () => broadcast('PLAYER_DISCONNECTED', {});
      window.addEventListener('beforeunload', handleUnload);
      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        channelRef.current?.close();
      };
    }
  }, [roomCode, handleMessage, broadcast]);

  const createRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    trackEvent('create_multiplayer_room', { code });
    setRoomCode(code);
    setPlayers([{ id: myId, name: 'You (Host)', hp: 100, isHost: true }]);
    setPhase('waiting');
    setError(null);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.length === 6) {
      trackEvent('join_multiplayer_room', { code: roomCode });
      setError(null);
      setPhase('waiting');
      setPlayers([{ id: myId, name: 'Connecting...', hp: 100, isHost: false }]);
      setTimeout(() => broadcast('JOIN_REQUEST', {}), 500);
    }
  };

  const startGame = () => {
    if (players.length < 2) return;
    const pool = [...SCRABBLE_DATA.flatMap(l => l.words.map(w => ({ word: w.text, phonetic: w.phonetic, meaning: "Standard", emoji: w.emoji, difficulty: 'Medium' as const }))), ...ULTRA_HARD_WORDS].sort(() => Math.random() - 0.5);
    setWordPool(pool);
    broadcast('START_GAME', { pool });
    setPhase('battle');
  };

  const handleCorrectSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWordResolved || !userInput.trim()) return;
    const currentWord = wordPool[currentIndex];
    if (userInput.trim().toUpperCase() === currentWord.word.toUpperCase()) {
      const damage = currentWord.difficulty === 'Ultra-Hard' ? 40 : 15;
      trackEvent('multiplayer_strike', { word: currentWord.word, damage });
      broadcast('STRIKE_DEALT', { damage, word: currentWord.word });
      setPlayers(prev => prev.map(p => 
        p.id !== myId ? { ...p, hp: Math.max(0, p.hp - damage) } : p
      ));
      setBattleLog(prev => [`Successful strike: ${damage} damage dealt`, ...prev]);
      setIsWordResolved(true);
      onAddPoints(damage);
      playSuccessSound();
      speak("Strike confirmed");
    } else {
      playFailureSound();
      speak("Invalid");
    }
  };

  const nextWord = () => {
    setCurrentIndex(prev => prev + 1);
    setIsWordResolved(false);
    setUserInput('');
  };

  useEffect(() => {
    if (phase === 'battle') {
      const alive = players.filter(p => p.hp > 0);
      if (alive.length <= 1 && players.length > 1) {
        setPhase('ended');
      }
    }
  }, [players, phase]);

  if (phase === 'lobby') {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-in fade-in text-center">
        <div className="bg-white rounded-[1.5rem] p-12 shadow-xl border border-slate-200 ring-1 ring-slate-900/5">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Lexicon Royale</h2>
          <p className="text-slate-500 text-sm mb-12">Synchronous lexical competition for 2-4 participants.</p>
          <div className="flex flex-col gap-8 items-center">
            <button 
              onClick={createRoom}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Initialize Host Session
            </button>
            <div className="flex items-center w-full gap-4">
              <div className="h-px bg-slate-100 flex-1"></div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">or Join Peer</span>
              <div className="h-px bg-slate-100 flex-1"></div>
            </div>
            <form onSubmit={joinRoom} className="w-full flex gap-2">
              <input 
                type="text" 
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="TOKEN"
                className="flex-1 px-6 py-3 rounded-xl border border-slate-200 text-center font-bold text-base focus:border-indigo-600 outline-none uppercase tracking-widest"
              />
              <button 
                type="submit"
                disabled={roomCode.length !== 6}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-20 transition-all"
              >
                Connect
              </button>
            </form>
          </div>
          {error && <p className="mt-6 text-rose-600 text-xs font-bold">{error}</p>}
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    const host = players.find(p => p.id === myId)?.isHost;
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in fade-in">
        <div className="bg-white rounded-[1.5rem] p-10 shadow-xl border border-slate-200 ring-1 ring-slate-900/5">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">Access Token</h3>
          <div className="text-5xl font-bold text-indigo-600 mb-10 tracking-widest">{roomCode}</div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roster Status</span>
              <span className="text-xs font-bold text-slate-400">{players.length}/4</span>
            </div>
            <div className="space-y-2">
              {players.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-200 text-sm shadow-sm">
                  <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">{p.name.charAt(0)}</div>
                  <span className="font-bold text-slate-700">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
          {host ? (
            <button 
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 disabled:opacity-20 transition-all shadow-md"
            >
              Execute Battle
            </button>
          ) : (
            <div className="text-slate-400 text-xs italic py-4 animate-pulse">Awaiting session start by host...</div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'ended') {
    const winner = players.find(p => p.hp > 0);
    const won = winner?.id === myId;
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in">
        <div className={`bg-white rounded-[1.5rem] p-12 shadow-xl border ${won ? 'border-emerald-200' : 'border-rose-200'}`}>
          <div className="text-6xl mb-6">{won ? '🥇' : '🏳️'}</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">{won ? 'Objective Achieved' : 'Session Terminated'}</h2>
          <p className="text-sm text-slate-500 mb-10">
            {winner ? `Participant "${winner.name}" remains operational.` : 'All units eliminated.'}
          </p>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all">
            Exit Session
          </button>
        </div>
      </div>
    );
  }

  const currentWord = wordPool[currentIndex];
  const myPlayer = players.find(p => p.id === myId);
  const otherPlayers = players.filter(p => p.id !== myId);

  return (
    <div className="max-w-6xl mx-auto py-2 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Peers List */}
      <div className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-[1.5rem] p-5 shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-4">Network Status</div>
          <div className="space-y-3">
            {otherPlayers.map(p => (
              <div key={p.id} className={`p-4 rounded-xl border transition-all ${p.hp <= 0 ? 'bg-slate-50 opacity-30 grayscale border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700 text-xs truncate">{p.name}</span>
                  <span className="font-bold text-[10px] text-slate-400">{p.hp}%</span>
                </div>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${p.hp}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Terminal */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-[1.5rem] p-10 shadow-xl border border-slate-200 flex flex-col items-center min-h-[550px] relative overflow-hidden">
          {(myPlayer?.hp || 0) <= 0 && (
            <div className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-sm rounded-[1.5rem] flex items-center justify-center text-white flex-col p-10 text-center">
              <h4 className="text-xl font-bold mb-2">Unit Offline</h4>
              <p className="text-xs text-slate-500 uppercase tracking-[0.2em]">Passive Monitoring Active</p>
            </div>
          )}

          {currentWord && (
            <div className="w-full text-center flex flex-col items-center flex-1">
              <div className="text-8xl mb-10 opacity-90 drop-shadow-md">{currentWord.emoji}</div>
              <div className="text-sm font-mono text-slate-400 font-bold bg-slate-50 px-6 py-3 rounded-xl border border-slate-200 mb-8 shadow-inner">
                {currentWord.phonetic}
              </div>
              <button 
                onClick={() => speak(currentWord.word)}
                className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600 hover:text-indigo-800 transition-colors mb-12 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.657-3.657a1 1 0 011.14-.267zM15.707 6.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 01-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Replay Audio
              </button>
              <form onSubmit={handleCorrectSubmission} className="w-full max-w-sm mt-auto pb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isWordResolved || (myPlayer?.hp || 0) <= 0}
                  placeholder="Input Unit..."
                  className="w-full text-center text-4xl font-bold py-6 border-b-2 border-slate-100 focus:outline-none focus:border-indigo-600 bg-transparent text-slate-900 uppercase tracking-widest placeholder:text-slate-100 transition-all"
                  autoFocus
                  autoComplete="off"
                />
                <div className="mt-12">
                  {isWordResolved ? (
                    <button onClick={nextWord} type="button" className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg animate-pulse">
                      Initialize Next Phase
                    </button>
                  ) : (
                    <button type="submit" disabled={!userInput.trim() || (myPlayer?.hp || 0) <= 0} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 shadow-lg">
                      Transmit Data
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Metadata */}
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 p-6 rounded-[1.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Subject Integrity</span>
            <span className="text-xs font-bold text-indigo-600">{myPlayer?.hp || 0}%</span>
          </div>
          <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
            <div className="h-full bg-indigo-600 transition-all duration-700" style={{ width: `${myPlayer?.hp || 0}%` }} />
          </div>
        </div>
        <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white font-mono text-[9px] h-64 overflow-y-auto shadow-2xl border border-slate-800">
          <div className="text-slate-500 mb-4 uppercase tracking-[0.2em] border-b border-white/5 pb-2">Central Feed</div>
          <div className="space-y-1.5">
            {battleLog.map((log, i) => (
              <div key={i} className="text-slate-300">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}] > {log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerSection;
