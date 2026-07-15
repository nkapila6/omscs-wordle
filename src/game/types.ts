export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export type GameStatus = 'playing' | 'won' | 'lost';

export interface WordEntry {
  word: string;
  hint: string;
  category: string;
}

export interface GuessResult {
  letters: LetterState[];
  isWin: boolean;
}

export interface GameState {
  answer: string;
  guesses: string[];
  results: LetterState[][];
  status: GameStatus;
  hintsRevealed: number; // 0-3
  dayIndex: number;
}

export interface HintTier {
  tier: number;
  label: string;
  content: string;
}
