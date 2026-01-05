import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Peer, DataConnection } from 'peerjs';
import { SCRABBLE_DATA } from '../data/scrabble.ts';
import { playSuccessSound, playFailureSound } from '../utils/audioEffects.ts';

interface Player {
  id: string;
  name: string;
  score: number;
  isHost: boolean;
}

interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  wordIndex: number;
  phase: 'lobby' | 'battle' | 'ended';
  roomCode: string;
}

const MultiplayerSection: React.FC<{ onAddPoints: (p: number) => void }> = ({ onAddPoints }) => {
  const [roomCode, setRoomCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [peerId, setPeerId] = useState('');
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentPlayerIndex: 0,
    wordIndex: 0,
    phase: 'lobby',
    roomCode: ''
  });
  const [userInput, setUserInput] = useState('');
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const peerRef = useRef<Peer | null>(null);
  const connectionsRef = useRef<Map<string, DataConnection>>(new Map());
  const wordsRef = useRef(SCRABBLE_DATA.flatMap(l => l.words).sort(() => Math.random() - 0.5));

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const broadcast = useCallback((type: string, payload: any) => {
    const msg = { type, payload, senderId: peerRef.current?.id };
    connectionsRef.current.forEach(conn => {
      if (conn.open) {
        try {
          conn.send(msg);
        } catch (e) {
          console.error("Broadcast failed for peer:", conn.peer, e);
        }
      }
    });
  }, []);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    return code;
  };

  const handleData = useCallback((data: any) => {
    const { type, payload } = data;
    switch (type) {
      case 'SYNC_GAME':
        setGameState(payload);
        break;
      case 'LOG':
        setBattleLog(prev => [payload, ...prev].slice(0, 20));
        break;
      case 'AUDIO_CUE':
        speak(payload);
        break;
    }
  }, [speak]);

  const initHost = () => {
    setIsInitializing(true);
    const code = generateRoomCode();
    // Prefixing with LEX to ensure ID availability and stability
    const peer = new Peer(`LEX-${code}`);

    peer.on('open', (id) => {
      setPeerId(id);
      setRoomCode(code);
      setIsInitializing(false);
      const host: Player = { id, name: 'Root Host', score: 0, isHost: true };
      setGameState(prev => ({ ...prev, players: [host], roomCode: code, phase: 'lobby' }));
    });

    peer.on('connection', (conn) => {
      conn.on('open', () => {
        if (connectionsRef.current.size >= 3) {
          conn.send({ type: 'LOG', payload: 'Arena Full.' });
          setTimeout(() => conn.close(), 500);
          return;
        }

        connectionsRef.current.set(conn.peer, conn);
        setGameState(prev => {
          const newPlayer: Player = { id: conn.peer, name: `Unit-${conn.peer.slice(-4)}`, score: 0, isHost: false };
          const newState = { ...prev, players: [...prev.players, newPlayer] };
          broadcast('SYNC_GAME', newState);
          return newState;
        });
      });

      conn.on('data', (d: any) => {
        if (d.type === 'SUBMIT') {
          handleSubmission(d.senderId, d.payload);
        } else {
          handleData(d);
        }
      });

      conn.on('close', () => {
        connectionsRef.current.delete(conn.peer);
        setGameState(prev => ({
          ...prev,
          players: prev.players.filter(p => p.id !== conn.peer)
        }));
      });
    });

    peerRef.current = peer;
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode) return;
    setIsInitializing(true);
    setError(null);

    const peer = new Peer();
    peer.on('open', (id) => {
      setPeerId(id);
      const conn = peer.connect(`LEX-${joinCode.toUpperCase()}`);
      
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);
        setIsInitializing(false);
        setRoomCode(joinCode.toUpperCase());
      });

      conn.on('data', handleData);
      
      conn.on('error', () => {
        setError("Host node offline. Check Room Code.");
        setIsInitializing(false);
        peer.destroy();
      });
    });
    peerRef.current = peer;
  };

  const handleSubmission = (senderId: string, guess: string) => {
    // Only host computes logic and broadcasts
    const isHost = peerRef.current?.id.startsWith('LEX-');
    if (!isHost) return;

    setGameState(prev => {
      const activePlayer = prev.players[prev.currentPlayerIndex];
      if (activePlayer.id !== senderId) return prev;

      const currentWord = wordsRef.current[prev.wordIndex].text;
      const isCorrect = guess.trim().toUpperCase() === currentWord.toUpperCase();
      
      let newPlayers = [...prev.players];
      let newWordIndex = prev.wordIndex;
      let newPhase = prev.phase;
      let logMsg = '';

      if (isCorrect) {
        const pIdx = newPlayers.findIndex(p => p.id === senderId);
        const updatedScore = newPlayers[pIdx].score + 10;
        newPlayers[pIdx] = { ...newPlayers[pIdx], score: updatedScore };
        logMsg = `${newPlayers[pIdx].name}: Correct. (+10 PTS)`;
        
        if (updatedScore >= 300) {
          newPhase = 'ended';
          logMsg = `VICTORY: ${newPlayers[pIdx].name} achieved 300 PTS.`;
        } else {
          newWordIndex++; // Load new word
        }
        playSuccessSound();
      } else {
        logMsg = `${activePlayer.name}: Failure. Word passes to next unit...`;
        playFailureSound();
        // Word Index remains the same for next player
      }

      const nextIndex = (prev.currentPlayerIndex + 1) % newPlayers.length;

      const newState: GameState = {
        ...prev,
        players: newPlayers,
        currentPlayerIndex: nextIndex,
        wordIndex: newWordIndex,
        phase: newPhase
      };

      broadcast('SYNC_GAME', newState);
      broadcast('LOG', logMsg);
      broadcast('AUDIO_CUE', wordsRef.current[newWordIndex].text);

      return newState;
    });
  };

  const startGame = () => {
    if (gameState.players.length < 2) return;
    const newState: GameState = { ...gameState, phase: 'battle', currentPlayerIndex: 0, wordIndex: 0 };
    setGameState(newState);
    broadcast('SYNC_GAME', newState);
    broadcast('LOG', 'Battle Initiated.');
    broadcast('AUDIO_CUE', wordsRef.current[0].text);
  };

  const submitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput) return;
    
    const isHost = peerRef.current?.id.startsWith('LEX-');
    if (isHost) {
      handleSubmission(peerId, userInput);
    } else {
      const hostConn = connectionsRef.current.get(`LEX-${roomCode}`);
      if (hostConn) {
        hostConn.send({ type: 'SUBMIT', payload: userInput, senderId: peerId });
      }
    }
    setUserInput('');
  };

  const isMyTurn = gameState.phase === 'battle' && gameState.players[gameState.currentPlayerIndex]?.id === peerId;
  const activeWord = wordsRef.current[gameState.wordIndex];

  // FIX: Added roomCode check to correctly branch between the initialization screen and the waiting room
  if (gameState.phase === 'lobby' && !roomCode) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200 text-center">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl mb-8 shadow-xl">⚔️</div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Lexicon Royale</h2>
          <p className="text-slate-500 mb-10 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-100 pb-4">Multiplayer Elimination protocol</p>
          
          <div className="space-y-6">
            <button 
              onClick={initHost}
              disabled={isInitializing}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50"
            >
              {isInitializing ? 'CALIBRATING...' : 'Initialize Host Node'}
            </button>
            
            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-slate-100"></div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">or link via Room Code</span>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>

            <form onSubmit={joinRoom} className="flex gap-3">
              <input 
                type="text" 
                maxLength={4}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="XXXX"
                className="w-32 text-center py-4 rounded-2xl border-2 border-slate-100 font-mono font-black text-xl focus:border-indigo-600 outline-none uppercase placeholder:text-slate-100"
              />
              <button 
                type="submit"
                disabled={!joinCode || isInitializing}
                className="flex-1 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg disabled:opacity-50"
              >
                Join Arena
              </button>
            </form>
          </div>
          {error && <p className="mt-6 text-rose-500 text-[10px] font-bold tracking-widest bg-rose-50 py-2 rounded uppercase">{error}</p>}
        </div>
      </div>
    );
  }

  // FIX: Removed invalid 'waiting' phase check and ensured this correctly identifies the waiting lobby state
  if (gameState.phase === 'lobby' && roomCode) {
    const isHost = peerRef.current?.id.startsWith('LEX-');
    return (
      <div className="max-w-xl mx-auto py-12 animate-in zoom-in">
        <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-slate-200 text-center">
          <div className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full inline-block mb-6 uppercase tracking-[0.3em]">Room Access Code</div>
          <div className="text-7xl font-mono font-black text-slate-900 tracking-[0.1em] mb-10">{roomCode}</div>
          
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-10 text-left">
            <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Connected Units</span>
              <span className="text-xs font-black text-indigo-600">{gameState.players.length}/4</span>
            </div>
            <div className="space-y-3">
              {gameState.players.map(p => (
                <div key={p.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-700 text-sm">{p.name} {p.id === peerId && "(Self)"}</span>
                  {p.isHost && <span className="text-[8px] font-black bg-slate-900 text-white px-3 py-1 rounded uppercase">Root</span>}
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <button 
              onClick={startGame}
              disabled={gameState.players.length < 2}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl disabled:opacity-20"
            >
              Initiate Battle Protocol
            </button>
          ) : (
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest animate-pulse italic">Awaiting Host Authorization...</p>
          )}
        </div>
      </div>
    );
  }

  if (gameState.phase === 'ended') {
    const winner = gameState.players.find(p => p.score >= 300);
    return (
      <div className="max-w-xl mx-auto py-20 text-center animate-in zoom-in">
        <div className="bg-white rounded-[3rem] p-16 shadow-2xl border-4 border-indigo-50">
          <div className="text-9xl mb-10">{winner?.id === peerId ? '🎖️' : '⛔'}</div>
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase">{winner?.id === peerId ? 'Dominant Unit' : 'Simulation Terminated'}</h2>
          <p className="text-slate-500 mb-12 text-sm font-medium">{winner?.name} has achieved lexical dominance (300 PTS).</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
          >
            Terminal Reboot
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 py-2">
      {/* Player Roster */}
      <div className="lg:col-span-3 space-y-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Active Roster</div>
        {gameState.players.map((p, idx) => {
          const isActive = gameState.currentPlayerIndex === idx;
          const progress = (p.score / 300) * 100;
          return (
            <div 
              key={p.id} 
              className={`p-5 rounded-[1.5rem] border-2 transition-all duration-500 ${
                isActive ? 'bg-white border-indigo-600 shadow-2xl ring-4 ring-indigo-50 scale-105 z-10' : 
                'bg-white border-slate-200'
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span className={`font-black text-[11px] uppercase tracking-tight ${isActive ? 'text-indigo-600' : 'text-slate-700'}`}>{p.name}</span>
                <span className="text-[10px] font-black text-indigo-600">{p.score} / 300</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isActive ? 'bg-indigo-600' : 'bg-slate-300'}`} 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              {isActive && (
                <div className="mt-3 flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></div>
                  <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">Transmitting Action</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Battle Interface */}
      <div className="lg:col-span-6">
        <div className={`bg-white rounded-[2.5rem] p-12 shadow-2xl border transition-all duration-500 min-h-[600px] flex flex-col items-center justify-center relative overflow-hidden ${isMyTurn ? 'border-indigo-200' : 'border-slate-200'}`}>
          {activeWord && (
            <div className={`text-center transition-all duration-700 ${isMyTurn ? 'opacity-100 scale-100' : 'opacity-20 scale-95 pointer-events-none'}`}>
              <div className="text-9xl mb-12 filter drop-shadow-2xl animate-in zoom-in">{activeWord.emoji}</div>
              <div className="text-2xl font-mono text-indigo-600 font-black mb-12 bg-indigo-50 px-10 py-4 rounded-2xl border border-indigo-100">
                {activeWord.phonetic}
              </div>
              
              <button 
                onClick={() => speak(activeWord.text)}
                className="mb-12 w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              <form onSubmit={submitInput} className="w-full max-w-sm">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={!isMyTurn}
                  placeholder={isMyTurn ? "TRANSMIT DATA..." : "AWAITING UNIT..."}
                  className={`w-full text-center text-4xl font-black py-6 border-b-4 focus:outline-none transition-all uppercase tracking-[0.2em] placeholder:text-slate-100 ${
                    isMyTurn ? 'border-indigo-600 text-slate-900' : 'border-slate-100 text-slate-300'
                  }`}
                  autoFocus
                  autoComplete="off"
                />
                {isMyTurn && (
                  <button type="submit" className="mt-12 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-700 active:scale-95 transition-all">
                    Execute Strike
                  </button>
                )}
              </form>
            </div>
          )}

          {!isMyTurn && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50/10 backdrop-blur-[1px]">
              <div className="flex flex-col items-center gap-4 text-slate-300 animate-pulse">
                <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-widest">Synchronizing Tactical Stream</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Battle Feed */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4">Tactical Log</div>
        <div className="bg-slate-900 rounded-[2.5rem] p-8 flex-1 text-[10px] font-mono text-indigo-400 overflow-y-auto max-h-[600px] border border-slate-800 shadow-2xl ring-1 ring-white/5">
          {battleLog.map((log, i) => (
            <div key={i} className="mb-4 border-l-2 border-indigo-500/30 pl-4 py-1 animate-in slide-in-from-top-2">
              <span className="text-slate-600 block mb-1">[{new Date().toLocaleTimeString([], { hour12: false, second: '2-digit'})}]</span>
              <span className="text-slate-100 leading-relaxed tracking-tight">{log}</span>
            </div>
          ))}
          {battleLog.length === 0 && <p className="text-slate-700 italic text-center py-20">Waiting for system link...</p>}
        </div>
      </div>
    </div>
  );
};

export default MultiplayerSection;