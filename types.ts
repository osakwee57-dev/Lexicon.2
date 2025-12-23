
export interface Word {
  text: string;
  phonetic: string;
  description: string;
  production: string; // Explaining how the sound is produced
}

export interface SoundGroup {
  symbol: string;
  category: 'vowel' | 'diphthong' | 'consonant';
  exampleWords: Word[];
}

export interface ScrabbleWord {
  id: string;
  text: string;
  phonetic: string;
  emoji: string;
}

export interface Progress {
  [difficulty: string]: number; // Current unlocked sub-level (1-10)
}

export interface AppState {
  currentSection: 'home' | 'sounds' | 'scrabble' | 'spelling-bee' | 'multiplayer';
  points: number;
  scrabbleProgress: Progress;
  spellingBeeProgress: Progress;
}
