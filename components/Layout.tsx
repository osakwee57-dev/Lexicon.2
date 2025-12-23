import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  points: number;
  onNavigate: (section: 'home' | 'sounds' | 'scrabble' | 'spelling-bee' | 'multiplayer') => void;
  currentSection: string;
}

const Layout: React.FC<LayoutProps> = ({ children, points, onNavigate, currentSection }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Professional Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => onNavigate('home')}
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-indigo-200 shadow-lg group-hover:bg-indigo-700 transition-colors">
              L
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Lexicon</h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button 
              onClick={() => onNavigate('sounds')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentSection === 'sounds' ? 'bg-slate-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Sounds
            </button>
            <button 
              onClick={() => onNavigate('scrabble')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentSection === 'scrabble' ? 'bg-slate-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Scrabble
            </button>
            <button 
              onClick={() => onNavigate('spelling-bee')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentSection === 'spelling-bee' ? 'bg-slate-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Spelling Bee
            </button>
            <button 
              onClick={() => onNavigate('multiplayer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentSection === 'multiplayer' ? 'bg-slate-100 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              Royale
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
              <span className="text-amber-500 font-bold">★</span>
              <span className="font-bold text-slate-700 text-sm">{points}</span>
            </div>
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                menu?.classList.toggle('hidden');
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div id="mobile-menu" className="hidden md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-2 animate-in fade-in duration-200">
        <button onClick={() => { onNavigate('sounds'); document.getElementById('mobile-menu')?.classList.add('hidden'); }} className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-sm font-medium">Sounds</button>
        <button onClick={() => { onNavigate('scrabble'); document.getElementById('mobile-menu')?.classList.add('hidden'); }} className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-sm font-medium">Scrabble</button>
        <button onClick={() => { onNavigate('spelling-bee'); document.getElementById('mobile-menu')?.classList.add('hidden'); }} className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-sm font-medium">Spelling Bee</button>
        <button onClick={() => { onNavigate('multiplayer'); document.getElementById('mobile-menu')?.classList.add('hidden'); }} className="block w-full text-left px-4 py-3 hover:bg-slate-50 rounded-lg text-sm font-medium">Royale</button>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="text-slate-900 font-bold text-lg mb-2">Lexicon</div>
          <div className="text-slate-500 text-sm max-w-sm mx-auto">
            Advanced English learning platform powered by modern AI technology.
          </div>
          <div className="mt-8 text-slate-400 text-xs uppercase tracking-widest font-semibold">
            &copy; {new Date().getFullYear()} Lexicon Labs. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;