
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SCRABBLE_DATA } from '../data/scrabble.ts';
import { playSuccessSound, playFailureSound } from '../utils/audioEffects.ts';
import { trackEvent } from '../utils/analytics.ts';

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
  const [myId] = useState(() => {
    const saved = sessionStorage.getItem('lexicon_peer_id');
    if (saved) return saved;
    const id = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('lexicon_peer_id', id);
    return id;
  });
  
  const [players, setPlayers] = useState<Player[]>([]);
  const [wordPool, setWordPool] = useState<DuelWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isWordResolved, setIsWordResolved] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Refs to handle the BroadcastChannel without re-initializing on every state change
  const playersRef = useRef<Player[]>([]);
  const phaseRef = useRef<GamePhase>('lobby');
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => { playersRef.current = players; }, [players]);
  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const broadcast = useCallback((type: string, payload: any) => {
    if (channelRef.current) {
      console.log(`[Multiplayer] Broadcasting ${type}`, payload);
      channelRef.current.postMessage({ type, payload, senderId: myId });
    }
  }, [myId]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleIncomingMessage = useCallback((event: MessageEvent) => {
    const { type, payload, senderId } = event.data;
    if (senderId === myId) return;

    console.log(`[Multiplayer] Received ${type} from ${senderId}`, payload);

    switch (type) {
      case 'JOIN_REQUEST':
        const iAmHost = playersRef.current.find(p => p.id === myId)?.isHost;
        if (iAmHost) {
          if (playersRef.current.length >= 4) {
            broadcast('JOIN_FAILURE', { targetId: senderId, reason: 'Room is full (Max 4)' });
          } else if (phaseRef.current === 'battle') {
            broadcast('JOIN_FAILURE', { targetId: senderId, reason: 'Battle already in progress' });
          } else {
            const newPlayer: Player = { id: senderId, name: `Player ${playersRef.current.length + 1}`, hp: 100, isHost: false };
            const updated = [...playersRef.current, newPlayer];
            setPlayers(updated);
            broadcast('LOBBY_UPDATE', { players: updated });
            setBattleLog(prev => [`${newPlayer.name} connected`, ...prev]);
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
        setBattleLog(["System: Battle Initiated"]);
        break;

      case 'STRIKE_DEALT':
        setPlayers(prev => prev.map(p => 
          p.id !== senderId ? { ...p, hp: Math.max(0, p.hp - payload.damage) } : p
        ));
        const strikerName = playersRef.current.find(p => p.id === senderId)?.name || 'Peer';
        setBattleLog(prev => [`${strikerName} dealt ${payload.damage} damage!`, ...prev]);
        setIsWordResolved(true);
        if (senderId !== myId) speak("Incoming attack");
        break;

      case 'NEXT_WORD':
        setCurrentIndex(payload.index);
        setIsWordResolved(false);
        setUserInput('');
        break;

      case 'PLAYER_DISCONNECTED':
        setPlayers(prev => prev.filter(p => p.id !== senderId));
        setBattleLog(prev => [`User ${senderId.substr(0,4)} disconnected`, ...prev]);
        break;
    }
  }, [myId, broadcast, speak]);

  useEffect(() => {
    if (roomCode && !channelRef.current) {
      const channel = new BroadcastChannel(`lexicon_v2_${roomCode}`);
      channel.onmessage = handleIncomingMessage;
      channelRef.current = channel;

      const handleUnload = () => broadcast('PLAYER_DISCONNECTED', {});
      window.addEventListener('beforeunload', handleUnload);

      return () => {
        window.removeEventListener('beforeunload', handleUnload);
        channel.close();
        channelRef.current = null;
      };
    }
  }, [roomCode, handleIncomingMessage, broadcast]);

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
      setPlayers([{ id: myId, name: 'You', hp: 100, isHost: false }]);
      // Allow a small delay for channel initialization
      setTimeout(() => broadcast('JOIN_REQUEST', {}), 300);
    }
  };

  const handleStartGame = () => {
    if (players.length < 2) return;
    const pool = [
      ...SCRABBLE_DATA.flatMap(l => l.words.map(w => ({ 
        word: w.text, 
        phonetic: w.phonetic, 
        meaning: "Standard", 
        emoji: w.emoji, 
        difficulty: 'Medium' as const 
      }))), 
      ...ULTRA_HARD_WORDS
    ].sort(() => Math.random() - 0.5);
    
    setWordPool(pool);
    broadcast('START_GAME', { pool });
    setPhase('battle');
  };

  const handleStrike = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWordResolved || !userInput.trim() || !wordPool[currentIndex]) return;
    
    const target = wordPool[currentIndex].word.toUpperCase();
    if (userInput.trim().toUpperCase() === target) {
      const damage = wordPool[currentIndex].difficulty === 'Ultra-Hard' ? 40 : 15;
      trackEvent('multiplayer_strike', { word: target, damage });
      
      broadcast('STRIKE_DEALT', { damage, word: target });
      
      // Local state update for immediate feedback
      setPlayers(prev => prev.map(p => 
        p.id !== myId ? { ...p, hp: Math.max(0, p.hp - damage) } : p
      ));
      
      setBattleLog(prev => [`You dealt ${damage} damage!`, ...prev]);
      setIsWordResolved(true);
      onAddPoints(damage);
      playSuccessSound();
      speak("Confirmed");
    } else {
      playFailureSound();
    }
  };

  const handleNextWord = () => {
    const nextIdx = currentIndex + 1;
    setCurrentIndex(nextIdx);
    setIsWordResolved(false);
    setUserInput('');
    broadcast('NEXT_WORD', { index: nextIdx });
  };

  useEffect(() => {
    if (phase === 'battle') {
      const alivePeers = players.filter(p => p.hp > 0);
      const iAmDead = players.find(p => p.id === myId)?.hp === 0;
      
      if (alivePeers.length <= 1 && players.length > 1) {
        setPhase('ended');
      }
    }
  }, [players, phase, myId]);

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
    setBattleLog(prev => ["Room code copied to clipboard", ...prev]);
  };

  if (phase === 'lobby') {
    return (
      <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 text-center">
        <div className="bg-white rounded-[2rem] p-12 shadow-2xl border border-slate-200">
          <div className="mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl mb-6 shadow-xl shadow-indigo-200">⚔️</div>
            <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Lexicon Royale</h2>
            <p className="text-slate-500 text-sm">Competitive real-time vocabulary duel.</p>
          </div>
          
          <div className="grid gap-6">
            <button 
              onClick={createRoom}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 active:scale-95"
            >
              Start New Session
            </button>
            
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">Join Active Unit</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            <form onSubmit={joinRoom} className="flex gap-3">
              <input 
                type="text" 
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE"
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 text-center font-mono font-bold text-xl focus:border-indigo-600 outline-none uppercase tracking-widest placeholder:text-slate-200"
              />
              <button 
                type="submit"
                disabled={roomCode.length !== 6}
                className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg"
              >
                Join
              </button>
            </form>
          </div>
          {error && <p className="mt-8 text-rose-600 text-xs font-bold bg-rose-50 p-3 rounded-lg border border-rose-100">{error}</p>}
          <p className="mt-12 text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">Note: Requires peers on the same local network or device.</p>
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    const isHost = players.find(p => p.id === myId)?.isHost;
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in duration-300">
        <div className="bg-white rounded-[2rem] p-10 shadow-2xl border border-slate-200">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">Waiting for Deployment</div>
          
          <div className="relative group cursor-pointer mb-10" onClick={copyCode}>
            <div className="text-6xl font-black text-indigo-600 tracking-[0.2em] mb-2">{roomCode}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-500 transition-colors">Click to copy code</div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
            <div className="flex justify-between items-center mb-6 px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Manifest</span>
              <span className="px-2 py-0.5 bg-white rounded-md text-xs font-bold text-slate-400 border border-slate-200">{players.length}/4</span>
            </div>
            <div className="grid gap-3">
              {players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-left-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                      {p.name.charAt(0)}
                    </div>
                    <span className="font-bold text-slate-700">{p.name} {p.id === myId && "(You)"}</span>
                  </div>
                  {p.isHost && <span className="text-[9px] font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md uppercase">Host</span>}
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <button 
              onClick={handleStartGame}
              disabled={players.length < 2}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-xl shadow-indigo-200"
            >
              Initiate Battle
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
               <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
               <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">Awaiting Host Authorization...</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'ended') {
    const winner = players.find(p => p.hp > 0);
    const iWon = winner?.id === myId;
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in duration-500">
        <div className={`bg-white rounded-[2.5rem] p-16 shadow-2xl border-4 ${iWon ? 'border-emerald-100' : 'border-slate-100'}`}>
          <div className="text-8xl mb-8">{iWon ? '👑' : '💀'}</div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">{iWon ? 'Victory' : 'Eliminated'}</h2>
          <p className="text-slate-500 mb-12 text-lg">
            {winner ? `Subject "${winner.name}" remains operational.` : 'Mutual destruction protocol active.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl"
          >
            Return to Headquarters
          </button>
        </div>
      </div>
    );
  }

  const currentWord = wordPool[currentIndex];
  const me = players.find(p => p.id === myId);
  const others = players.filter(p => p.id !== myId);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      {/* Peer Monitor */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-xl sticky top-24">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
            <span>Target Roster</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </div>
          <div className="space-y-4">
            {others.map(p => (
              <div key={p.id} className={`p-5 rounded-2xl border-2 transition-all duration-500 ${p.hp <= 0 ? 'bg-slate-50 opacity-40 grayscale border-slate-100' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700 text-xs truncate max-w-[120px]">{p.name}</span>
                  <span className={`font-black text-[10px] ${p.hp > 50 ? 'text-emerald-500' : 'text-rose-500'}`}>{p.hp}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-700 ease-out ${p.hp > 50 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                    style={{ width: `${p.hp}%` }} 
                  />
                </div>
              </div>
            ))}
            {others.length === 0 && (
              <div className="py-10 text-center text-slate-300 italic text-xs">No targets detected</div>
            )}
          </div>
        </div>
      </div>

      {/* Combat Terminal */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200 flex flex-col items-center min-h-[650px] relative overflow-hidden ring-1 ring-slate-900/5">
          {(!me || me.hp <= 0) && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md rounded-[2.5rem] flex items-center justify-center text-white flex-col p-12 text-center animate-in fade-in">
              <div className="text-6xl mb-6">🚫</div>
              <h4 className="text-3xl font-black mb-4 tracking-tight">Core Integrity Failure</h4>
              <p className="text-slate-500 text-sm uppercase tracking-[0.3em] max-w-xs">Spectator mode active. Surveillance only.</p>
            </div>
          )}

          {currentWord && (
            <div className="w-full text-center flex flex-col items-center flex-1 animate-in zoom-in duration-300">
              <div className="text-9xl mb-12 transform hover:scale-110 transition-transform cursor-default filter drop-shadow-2xl">
                {currentWord.emoji}
              </div>
              
              <div className="inline-flex items-center gap-4 bg-slate-50 border border-slate-100 px-8 py-4 rounded-2xl mb-12 shadow-inner">
                <span className="text-sm font-mono text-indigo-600 font-black tracking-widest">{currentWord.phonetic}</span>
                <button 
                  onClick={() => speak(currentWord.word)}
                  className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.657-3.657a1 1 0 011.14-.267zM15.707 6.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 01-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0zM18.536 3.464a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleStrike} className="w-full max-w-md mt-auto pb-8">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isWordResolved || !me || me.hp <= 0}
                  placeholder="INPUT UNIT..."
                  className="w-full text-center text-5xl font-black py-8 border-b-4 border-slate-100 focus:outline-none focus:border-indigo-600 bg-transparent text-slate-900 uppercase tracking-[0.2em] placeholder:text-slate-100 transition-all"
                  autoFocus
                  autoComplete="off"
                />
                <div className="mt-12">
                  {isWordResolved ? (
                    <button 
                      onClick={handleNextWord} 
                      type="button" 
                      className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-200 animate-pulse"
                    >
                      Cycle Next Phase
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={!userInput.trim() || !me || me.hp <= 0} 
                      className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-slate-800 shadow-xl disabled:opacity-30"
                    >
                      Transmit Attack
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Health</span>
            <span className={`text-sm font-black ${me && me.hp > 30 ? 'text-indigo-600' : 'text-rose-600'}`}>{me?.hp || 0}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${me && me.hp > 30 ? 'bg-indigo-600' : 'bg-rose-600 animate-pulse'}`} 
              style={{ width: `${me?.hp || 0}%` }} 
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2rem] p-8 text-white h-[450px] flex flex-col shadow-2xl border border-slate-800">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-4 mb-4 flex items-center justify-between">
            <span>Combat Logs</span>
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[10px] leading-relaxed custom-scrollbar">
            {battleLog.map((log, i) => (
              <div key={i} className="text-slate-400 border-l-2 border-indigo-500/30 pl-3 animate-in fade-in slide-in-from-top-1">
                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                <span className="text-slate-200">{" > "} {log}</span>
              </div>
            ))}
            {battleLog.length === 0 && <div className="text-slate-700 italic">No activity recorded...</div>}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default MultiplayerSection;
