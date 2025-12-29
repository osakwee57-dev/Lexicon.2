import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
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
  const [peerId, setPeerId] = useState<string>('');
  const [targetId, setTargetId] = useState<string>('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [wordPool, setWordPool] = useState<DuelWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isWordResolved, setIsWordResolved] = useState(false);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const playersRef = useRef<Player[]>([]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 1.0;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const broadcast = useCallback((type: string, payload: any) => {
    const msg = { type, payload, senderId: peerRef.current?.id };
    connectionsRef.current.forEach(conn => {
      if (conn.open) conn.send(msg);
    });
  }, []);

  const handleData = useCallback((data: any) => {
    const { type, payload, senderId } = data;
    console.log(`[WebRTC] Inbound: ${type}`, payload);

    switch (type) {
      case 'SYNC_STATE':
        setPlayers(payload.players);
        setWordPool(payload.wordPool);
        setPhase(payload.phase);
        setCurrentIndex(payload.currentIndex);
        break;
      case 'LOBBY_UPDATE':
        setPlayers(payload.players);
        break;
      case 'START_GAME':
        setWordPool(payload.pool);
        setPhase('battle');
        setBattleLog(prev => ["System: Combat Phase Initiated", ...prev]);
        break;
      case 'STRIKE_DEALT':
        setPlayers(prev => prev.map(p => 
          p.id !== senderId ? { ...p, hp: Math.max(0, p.hp - payload.damage) } : p
        ));
        const striker = playersRef.current.find(p => p.id === senderId)?.name || 'Remote Unit';
        setBattleLog(prev => [`${striker} valid strike: ${payload.damage} DMG`, ...prev]);
        setIsWordResolved(true);
        if (senderId !== peerRef.current?.id) speak("Incoming attack");
        break;
      case 'NEXT_WORD':
        setCurrentIndex(payload.index);
        setIsWordResolved(false);
        setUserInput('');
        break;
    }
  }, [speak]);

  const initPeer = () => {
    if (peerRef.current) return;
    setIsInitializing(true);
    const peer = new Peer({
      config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }
    });

    peer.on('open', (id) => {
      setPeerId(id);
      setIsInitializing(false);
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);
        const isHost = playersRef.current.some(p => p.id === peer.id && p.isHost);
        
        if (isHost) {
          const newPlayer: Player = { id: conn.peer, name: `Unit-${conn.peer.substr(0,4)}`, hp: 100, isHost: false };
          const updated = [...playersRef.current, newPlayer];
          setPlayers(updated);
          
          // Sync existing state to newcomer
          conn.send({
            type: 'SYNC_STATE',
            payload: {
              players: updated,
              wordPool: wordPool,
              phase: phase,
              currentIndex: currentIndex
            }
          });
          
          // Notify everyone else
          broadcast('LOBBY_UPDATE', { players: updated });
        }
      });

      conn.on('data', handleData);
      conn.on('close', () => {
        connectionsRef.current.delete(conn.peer);
        setPlayers(prev => prev.filter(p => p.id !== conn.peer));
      });
    });

    peerRef.current = peer;
  };

  const createRoom = () => {
    initPeer();
    setPlayers([{ id: 'pending', name: 'You (Host)', hp: 100, isHost: true }]);
    setPhase('waiting');
    trackEvent('webrtc_host_created');
  };

  useEffect(() => {
    if (peerId && players.length > 0 && players[0].id === 'pending') {
      setPlayers(prev => prev.map(p => p.id === 'pending' ? { ...p, id: peerId } : p));
    }
  }, [peerId, players]);

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetId) return;
    initPeer();
    setError(null);
    setIsInitializing(true);

    const checkPeer = () => {
      if (peerRef.current?.id) {
        const conn = peerRef.current.connect(targetId);
        conn.on('open', () => {
          connectionsRef.current.set(conn.peer, conn);
          setPlayers([{ id: peerRef.current!.id, name: 'You', hp: 100, isHost: false }]);
          setPhase('waiting');
          setIsInitializing(false);
        });
        conn.on('data', handleData);
        conn.on('error', (err) => {
          setError("Failed to reach terminal. Check ID.");
          setIsInitializing(false);
        });
      } else {
        setTimeout(checkPeer, 500);
      }
    };
    checkPeer();
  };

  const startGame = () => {
    if (players.length < 2) return;
    const pool = [
      ...SCRABBLE_DATA.flatMap(l => l.words.map(w => ({ 
        word: w.text, phonetic: w.phonetic, meaning: "Unit", emoji: w.emoji, difficulty: 'Medium' as const 
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
      broadcast('STRIKE_DEALT', { damage, word: target });
      
      setPlayers(prev => prev.map(p => 
        p.id !== peerRef.current?.id ? { ...p, hp: Math.max(0, p.hp - damage) } : p
      ));
      
      setBattleLog(prev => [`System: Strike successful. ${damage} damage transmitted.`, ...prev]);
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

  const copyId = () => {
    navigator.clipboard.writeText(peerId);
    setBattleLog(prev => ["Link: Unit ID copied to buffer", ...prev]);
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
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-6">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200 text-center ring-1 ring-slate-900/5">
          <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] mx-auto flex items-center justify-center text-white text-5xl mb-8 shadow-2xl shadow-indigo-200">⚔️</div>
          <h2 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Lexicon Royale</h2>
          <p className="text-slate-500 mb-12 text-sm font-medium">Global real-time Peer-to-Peer vocabulary combat.</p>
          
          <div className="space-y-6">
            <button 
              onClick={createRoom}
              disabled={isInitializing}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {isInitializing ? 'INITIALIZING PEER...' : 'Initialize Host Node'}
            </button>
            
            <div className="flex items-center gap-4 text-slate-300">
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black uppercase tracking-widest">or link to peer</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <form onSubmit={joinRoom} className="flex gap-3">
              <input 
                type="text" 
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                placeholder="TARGET UNIT ID"
                className="flex-1 px-6 py-4 rounded-2xl border-2 border-slate-100 font-mono font-bold text-base focus:border-indigo-600 outline-none uppercase placeholder:text-slate-200"
              />
              <button 
                type="submit"
                disabled={!targetId || isInitializing}
                className="px-8 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95 disabled:opacity-50"
              >
                {isInitializing ? '...' : 'LINK'}
              </button>
            </form>
          </div>
          {error && <p className="mt-8 text-rose-600 text-xs font-bold bg-rose-50 p-4 rounded-xl border border-rose-100 animate-pulse">{error}</p>}
        </div>
      </div>
    );
  }

  if (phase === 'waiting') {
    const isHost = players.find(p => p.id === peerRef.current?.id)?.isHost;
    return (
      <div className="max-w-xl mx-auto py-12 text-center animate-in zoom-in">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200">
          <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full inline-block mb-8 uppercase tracking-[0.2em]">Node Manifest Active</div>
          
          <div className="relative group cursor-pointer mb-12" onClick={copyId}>
             <div className="text-4xl font-mono font-black text-slate-900 tracking-tighter mb-2 break-all">{peerId || 'GENERATING...'}</div>
             <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Click to copy Unit ID</div>
          </div>

          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10 text-left">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Units</span>
              <span className="text-xs font-bold text-indigo-600">{players.length}/4</span>
            </div>
            <div className="space-y-3">
              {players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm animate-in slide-in-from-left-2">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">{p.name.charAt(0)}</div>
                    <span className="font-bold text-slate-700">{p.name} {p.id === peerRef.current?.id && "(You)"}</span>
                  </div>
                  {p.isHost && <span className="text-[9px] font-black text-white bg-slate-900 px-3 py-1 rounded-md uppercase">Host</span>}
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <button 
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-30 transition-all shadow-xl shadow-indigo-200"
            >
              Initiate Combat Sequence
            </button>
          ) : (
            <div className="flex items-center justify-center gap-3 py-4 text-slate-400 font-bold text-xs animate-pulse italic">
              Awaiting host authorization...
            </div>
          )}
        </div>
      </div>
    );
  }

  if (phase === 'ended') {
    const winner = players.find(p => p.hp > 0);
    const won = winner?.id === peerRef.current?.id;
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in">
        <div className={`bg-white rounded-[3rem] p-16 shadow-2xl border-4 ${won ? 'border-emerald-100' : 'border-rose-100'}`}>
          <div className="text-9xl mb-10">{won ? '👑' : '💀'}</div>
          <h2 className="text-4xl font-black text-slate-900 mb-4">{won ? 'Objective Met' : 'System Failure'}</h2>
          <p className="text-slate-500 mb-12 text-lg font-medium">
            {winner ? `Subject "${winner.name}" remains operational.` : 'Mutual annihilation confirmed.'}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-2xl"
          >
            Reset Node
          </button>
        </div>
      </div>
    );
  }

  const currentWord = wordPool[currentIndex];
  const me = players.find(p => p.id === peerRef.current?.id);
  const others = players.filter(p => p.id !== peerRef.current?.id);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-2 animate-in fade-in duration-700">
      {/* Target Monitor */}
      <div className="lg:col-span-3 space-y-6">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-xl sticky top-24">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex justify-between items-center">
            <span>External Nodes</span>
            <div className="flex gap-1">
              {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-emerald-500 rounded-full animate-pulse" style={{animationDelay: `${i*0.2}s`}} />)}
            </div>
          </div>
          <div className="space-y-4">
            {others.map(p => (
              <div key={p.id} className={`p-5 rounded-2xl border-2 transition-all duration-500 ${p.hp <= 0 ? 'bg-slate-50 opacity-40 grayscale border-slate-100' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-slate-700 text-xs truncate max-w-[120px]">{p.name}</span>
                  <span className="font-black text-[10px] text-rose-500">{p.hp}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-700 ease-out" 
                    style={{ width: `${p.hp}%` }} 
                  />
                </div>
              </div>
            ))}
            {others.length === 0 && (
              <div className="py-12 text-center text-slate-300 italic text-xs">No signals detected...</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Tactical Interface */}
      <div className="lg:col-span-6">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200 flex flex-col items-center min-h-[700px] relative overflow-hidden ring-1 ring-slate-900/5">
          {(!me || me.hp <= 0) && (
            <div className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center text-white p-12 text-center animate-in fade-in">
              <div className="text-7xl mb-6">⚠️</div>
              <h4 className="text-3xl font-black mb-4 tracking-tight">Node Integrity: 0%</h4>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.3em] max-w-xs">Data-stream restricted to passive monitoring.</p>
            </div>
          )}

          {currentWord && (
            <div className="w-full text-center flex flex-col items-center flex-1 animate-in zoom-in">
              <div className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.4em] mb-12">Target Assessment: Unit {currentIndex + 1}</div>
              
              <div className="text-9xl mb-12 transform hover:scale-110 transition-transform cursor-default filter drop-shadow-2xl">
                {currentWord.emoji}
              </div>
              
              <div className="inline-flex items-center gap-6 bg-slate-50 border border-slate-100 px-10 py-5 rounded-2xl mb-16 shadow-inner">
                <span className="text-xl font-mono text-indigo-600 font-black tracking-widest">{currentWord.phonetic}</span>
                <button 
                  onClick={() => speak(currentWord.word)}
                  className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm active:scale-90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.657-3.657a1 1 0 011.14-.267zM15.707 6.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 01-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0zM18.536 3.464a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleStrike} className="w-full max-w-md mt-auto pb-10">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isWordResolved || !me || me.hp <= 0}
                  placeholder="TRANSMIT DATA..."
                  className="w-full text-center text-5xl font-black py-10 border-b-4 border-slate-100 focus:outline-none focus:border-indigo-600 bg-transparent text-slate-900 uppercase tracking-[0.2em] placeholder:text-slate-100 transition-all"
                  autoFocus
                  autoComplete="off"
                />
                <div className="mt-12">
                  {isWordResolved ? (
                    <button 
                      onClick={handleNextWord} 
                      type="button" 
                      className="w-full py-6 bg-indigo-600 text-white rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-2xl shadow-indigo-200 animate-pulse"
                    >
                      Cycle Next Phase
                    </button>
                  ) : (
                    <button 
                      type="submit" 
                      disabled={!userInput.trim() || !me || me.hp <= 0} 
                      className="w-full py-6 bg-slate-900 text-white rounded-2xl font-black text-xl hover:bg-slate-800 shadow-2xl disabled:opacity-20"
                    >
                      EXECUTE ATTACK
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Logic Feed */}
      <div className="lg:col-span-3 space-y-8">
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-xl">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Node Integrity</span>
            <span className={`text-sm font-black ${me && me.hp > 40 ? 'text-indigo-600' : 'text-rose-600'}`}>{me?.hp || 0}%</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner p-0.5">
            <div 
              className={`h-full transition-all duration-1000 ease-out rounded-full ${me && me.hp > 40 ? 'bg-indigo-600' : 'bg-rose-600 animate-pulse'}`} 
              style={{ width: `${me?.hp || 0}%` }} 
            />
          </div>
        </div>

        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-[500px] flex flex-col shadow-2xl border border-slate-800 ring-1 ring-white/10">
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] border-b border-white/5 pb-5 mb-5 flex items-center justify-between">
            <span>Combat Metadata</span>
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 font-mono text-[10px] leading-relaxed custom-scrollbar pr-2">
            {battleLog.map((log, i) => (
              <div key={i} className="text-slate-400 border-l-2 border-indigo-500/40 pl-4 py-1 animate-in fade-in slide-in-from-top-2">
                <span className="text-slate-600 mr-2">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                <span className="text-slate-200">{" > "} {log}</span>
              </div>
            ))}
            {battleLog.length === 0 && <div className="text-slate-700 italic py-10 text-center">No tactical data recorded...</div>}
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