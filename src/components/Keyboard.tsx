import { useEffect, useCallback } from 'react';
import type { LetterState } from '../game/types';

interface KeyboardProps {
  onKey: (letter: string) => void;
  onEnter: () => void;
  onBackspace: () => void;
  results: LetterState[][];
  guesses: string[];
}

const ROW1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const ROW2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
const ROW3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

function getKeyState(letter: string, guesses: string[], results: LetterState[][]): string {
  let best: string = '';
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const result = results[i];
    if (!result) continue;
    for (let j = 0; j < guess.length; j++) {
      if (guess[j] === letter) {
        if (result[j] === 'correct') return 'correct';
        if (result[j] === 'present') best = 'present';
        if (result[j] === 'absent' && !best) best = 'absent';
      }
    }
  }
  return best;
}

export function Keyboard({ onKey, onEnter, onBackspace, results, guesses }: KeyboardProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key.toUpperCase();
    if (key === 'ENTER') {
      onEnter();
    } else if (key === 'BACKSPACE') {
      onBackspace();
    } else if (/^[A-Z]$/.test(key)) {
      onKey(key);
    }
  }, [onKey, onEnter, onBackspace]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const renderKey = (letter: string) => {
    const state = getKeyState(letter, guesses, results);
    return (
      <button
        key={letter}
        className={`key ${state}`}
        onClick={() => onKey(letter)}
      >
        {letter}
      </button>
    );
  };

  return (
    <div className="keyboard">
      <div className="keyboard-row">
        {ROW1.map(renderKey)}
      </div>
      <div className="keyboard-row">
        {ROW2.map(renderKey)}
      </div>
      <div className="keyboard-row">
        <button className="key wide" onClick={onEnter}>ENTER</button>
        {ROW3.map(renderKey)}
        <button className="key wide" onClick={onBackspace}>DEL</button>
      </div>
    </div>
  );
}
