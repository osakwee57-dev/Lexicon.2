import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import SoundSection from './components/SoundSection';
import ScrabbleSection from './components/ScrabbleSection';
import SpellingBeeSection from './components/SpellingBeeSection';
import MultiplayerSection from './components/MultiplayerSection';
import { AppState } from './types';
import { trackPageView } from './utils/analytics';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('lexicon_state_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
    return { 
      currentSection: 'home', 
      points: 0,
      scrabbleProgress: { Easy: 1, Medium: 1, Hard: 1 },
      spellingBeeProgress: { Easy: 1, Medium: 1, Hard: 1 }
    };
  });

  useEffect(() => {
    localStorage.setItem('lexicon_state_v3', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    trackPageView(state.currentSection);
  }, [state.currentSection]);

  const navigateTo = (section: AppState['currentSection']) => {
    setState(prev => ({ ...prev, currentSection: section }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const updateBeeProgress = (difficulty: string, subLevel: number) => {
    setState(prev => {
      const currentMax = prev.spellingBeeProgress[difficulty] || 1;
      if (subLevel >= currentMax && subLevel < 10) {
        return {
          ...prev,
          spellingBeeProgress: {
            ...prev.spellingBeeProgress,
            [difficulty]: subLevel + 1
          }
        };
      }
      return prev;
    });
  };

  const renderContent = () => {
    switch (state.currentSection) {
      case 'home':
        return (
          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Professional Hero */}
            <div className="text-center space-y-6 pt-8 pb-4">
              <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                Version 2.0 • AI-Powered Learning
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                Master English <span className="text-indigo-600">Nuance.</span>
              </h2>
              <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
                A structured environment for perfecting pronunciation, expanding vocabulary, and sharpening spelling.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div 
                onClick={() => navigateTo('sounds')}
                className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-6 text-indigo-600 group-hover:scale-110 transition-transform">🗣️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sound Explorer</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Deep-dive into phonetics and oral mechanics.</p>
                <div className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                  Launch Module <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigateTo('scrabble')}
                className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mb-6 text-slate-600 group-hover:scale-110 transition-transform">🧩</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Scrabble</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Visual word construction and pattern recognition.</p>
                <div className="text-slate-600 text-sm font-bold flex items-center gap-1">
                  Start Training <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigateTo('spelling-bee')}
                className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-2xl mb-6 text-slate-600 group-hover:scale-110 transition-transform">📋</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Spelling Bee</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Auditory accuracy and lexical precision tests.</p>
                <div className="text-slate-600 text-sm font-bold flex items-center gap-1">
                  Begin Exam <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              <div 
                onClick={() => navigateTo('multiplayer')}
                className="group bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-600 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl mb-6 text-white group-hover:scale-110 transition-transform">⚔️</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Lexicon Royale</h3>
                <p className="text-slate-500 text-sm mb-6 leading-relaxed">Competitive real-time vocabulary challenges.</p>
                <div className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                  Enter Arena <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>

            {/* Banner Section */}
            <div className="bg-slate-900 rounded-3xl p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
              
              <div className="max-w-md relative z-10">
                <h3 className="text-3xl font-bold mb-4 tracking-tight">Competitive Mastery</h3>
                <p className="text-slate-400 mb-8 leading-relaxed">Test your spelling efficiency against other users in a high-stakes, real-time environment.</p>
                <button 
                  onClick={() => navigateTo('multiplayer')}
                  className="bg-indigo-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                >
                  Join Live Royale
                </button>
              </div>
              
              <div className="hidden md:flex relative z-10">
                 <div className="w-56 h-56 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-7xl">🏛️</div>
                 </div>
              </div>
            </div>
          </div>
        );
      case 'sounds':
        return <SoundSection />;
      case 'scrabble':
        return <ScrabbleSection onAddPoints={addPoints} />;
      case 'spelling-bee':
        return (
          <SpellingBeeSection 
            onAddPoints={addPoints} 
            progress={state.spellingBeeProgress}
            onLevelComplete={updateBeeProgress}
          />
        );
      case 'multiplayer':
        return <MultiplayerSection onAddPoints={addPoints} />;
      default:
        return <div>Section not found.</div>;
    }
  };

  return (
    <Layout points={state.points} onNavigate={navigateTo} currentSection={state.currentSection}>
      {renderContent()}
    </Layout>
  );
};

export default App;