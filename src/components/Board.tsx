import type { LetterState, GameStatus } from '../game/types';

interface BoardProps {
  guesses: string[];
  results: LetterState[][];
  currentGuess: string;
  status: GameStatus;
}

export function Board({ guesses, results, currentGuess, status }: BoardProps) {
  const MAX_GUESSES = 6;
  const WORD_LENGTH = 5;

  const rows: React.ReactNode[] = [];

  for (let i = 0; i < MAX_GUESSES; i++) {
    const isCurrentRow = i === guesses.length && status === 'playing';
    const guess = guesses[i];
    const result = results[i];

    const tiles: React.ReactNode[] = [];

    for (let j = 0; j < WORD_LENGTH; j++) {
      let letter = '';
      let state: LetterState = 'empty';
      let classes = 'tile';

      if (guess) {
        letter = guess[j];
        state = result[j];
        classes += ` ${state}`;
      } else if (isCurrentRow) {
        letter = currentGuess[j] || '';
        if (letter) {
          classes += ' filled';
        }
      }

      tiles.push(
        <div key={j} className={classes}>
          {letter}
        </div>
      );
    }

    rows.push(
      <div key={i} className="board-row">
        {tiles}
      </div>
    );
  }

  return <div className="board">{rows}</div>;
}
