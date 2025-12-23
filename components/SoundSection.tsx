import React, { useState, useCallback } from 'react';
import { SOUNDS_DATA } from '../data/sounds.ts';
import { SoundGroup, Word } from '../types.ts';
import { trackEvent } from '../utils/analytics.ts';

const SoundSection: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<SoundGroup | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);

  const speak = useCallback((text: string) => {
    trackEvent('play_audio', { text });
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const closeModal = () => {
    setSelectedGroup(null);
    setSelectedWord(null);
  };

  const closeWordModal = () => {
    setSelectedWord(null);
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="bg-white border border-slate-200 rounded-[1.5rem] p-8 md:p-12 shadow-sm ring-1 ring-slate-900/5">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Phonetic Directory</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            A comprehensive guide to English phonemes. Select a symbol to analyze articulation mechanics and lexical examples.
          </p>
        </div>

        <div className="space-y-16">
          {/* Vowels */}
          <section>
            <div className="flex items-center gap-3 mb-8 pb-2 border-b border-slate-100">
              <span className="text-indigo-600 font-bold text-[10px] tracking-[0.2em] uppercase">Vocalic Phonemes</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {SOUNDS_DATA.filter(s => s.category === 'vowel' || s.category === 'diphthong').map(sound => (
                <button
                  key={sound.symbol}
                  onClick={() => setSelectedGroup(sound)}
                  className="aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 shadow-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-white hover:-translate-y-1 transition-all"
                >
                  /{sound.symbol}/
                </button>
              ))}
            </div>
          </section>

          {/* Consonants */}
          <section>
            <div className="flex items-center gap-3 mb-8 pb-2 border-b border-slate-100">
              <span className="text-slate-400 font-bold text-[10px] tracking-[0.2em] uppercase">Consonantal Phonemes</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {SOUNDS_DATA.filter(s => s.category === 'consonant').map(sound => (
                <button
                  key={sound.symbol}
                  onClick={() => setSelectedGroup(sound)}
                  className="aspect-square bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-xl font-bold text-slate-700 shadow-sm hover:border-slate-500 hover:text-slate-900 hover:bg-white hover:-translate-y-1 transition-all"
                >
                  /{sound.symbol}/
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Group Detail Modal */}
      {selectedGroup && !selectedWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[1.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="text-xl font-bold text-slate-900">Phoneme: /{selectedGroup.symbol}/</h4>
              <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8">
              <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Lexical Examples</h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedGroup.exampleWords.map((word) => (
                  <button
                    key={word.text}
                    onClick={() => setSelectedWord(word)}
                    className="group bg-slate-50 border border-slate-200 p-4 rounded-xl text-left hover:border-indigo-600 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="text-base font-bold text-slate-900 group-hover:text-indigo-600">{word.text}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">{word.phonetic}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in duration-300">
          <div className="bg-white rounded-[1.5rem] w-full max-w-md overflow-hidden shadow-2xl transform border border-slate-200">
            <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
               <div>
                 <h4 className="text-2xl font-bold text-slate-900">{selectedWord.text}</h4>
                 <p className="text-sm text-indigo-600 font-mono font-medium">{selectedWord.phonetic}</p>
               </div>
               <button onClick={closeWordModal} className="p-2 text-slate-400 hover:text-slate-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
            <div className="p-8">
              <div className="flex justify-center mb-10">
                <button 
                  onClick={() => speak(selectedWord.text)}
                  className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.657-3.657a1 1 0 011.14-.267zM15.707 6.293a1 1 0 010 1.414 3 3 0 000 4.242 1 1 0 01-1.414 1.414 5 5 0 010-7.072 1 1 0 011.414 0zM18.536 3.464a1 1 0 010 1.414 7 7 0 000 9.9 1 1 0 11-1.414 1.414 9 9 0 010-12.728 1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="space-y-6">
                <div>
                  <h6 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Articulation Mechanics</h6>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    {selectedWord.production}
                  </p>
                </div>
                <div className="text-xs text-slate-500 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                  <span className="font-bold text-indigo-700 block mb-1">Lexical Context:</span>
                  {selectedWord.description}
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3">
              <button 
                onClick={closeWordModal}
                className="flex-1 py-3 text-sm bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
              >
                Return
              </button>
              <button 
                onClick={() => speak(selectedWord.text)}
                className="flex-1 py-3 text-sm bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Listen Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SoundSection;
