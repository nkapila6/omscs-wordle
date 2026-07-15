import type { LetterState, GameStatus, HintTier, WordEntry } from './types';

const WORD_LENGTH = 5;

export function getDayIndex(date?: Date): number {
  const now = date ? date.getTime() : Date.now();
  return Math.floor((now + 4 * 3600 * 1000) / 86400000);
}

export function getWordOfDay(
  words: WordEntry[],
  date?: Date,
): { entry: WordEntry; dayIndex: number } {
  const dayIndex = getDayIndex(date);
  const entry = words[dayIndex % words.length];
  return { entry, dayIndex };
}

export function evaluateGuess(answer: string, guess: string): LetterState[] {
  const result: LetterState[] = new Array(WORD_LENGTH).fill('empty');
  const answerChars = answer.split('');
  const guessChars = guess.split('');

  // Count unmatched answer letters for duplicate-aware present/absent logic
  const remaining: Record<string, number> = {};

  // First pass: mark correct matches
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessChars[i] === answerChars[i]) {
      result[i] = 'correct';
    } else {
      remaining[answerChars[i]] = (remaining[answerChars[i]] ?? 0) + 1;
    }
  }

  // Second pass: mark present or absent using remaining counts
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i] === 'correct') continue;

    const ch = guessChars[i];
    if ((remaining[ch] ?? 0) > 0) {
      result[i] = 'present';
      remaining[ch]--;
    } else {
      result[i] = 'absent';
    }
  }

  return result;
}

export function isValidGuess(guess: string, words: WordEntry[]): boolean {
  if (guess.length !== WORD_LENGTH) return false;
  // Must be all uppercase A-Z
  if (!/^[A-Z]{5}$/.test(guess)) return false;
  // Hard mode: only curated words are valid
  const wordSet = new Set(words.map((w) => w.word));
  return wordSet.has(guess);
}

export function getHintTiers(entry: WordEntry, dayIndex: number): HintTier[] {
  // Deterministic letter position based on dayIndex
  const revealPos = dayIndex % WORD_LENGTH;
  const wordChars = entry.word.split('');
  const tier1Content = wordChars
    .map((ch, i) => (i === revealPos ? ch : '_'))
    .join(' ');

  const hasRepeats = new Set(wordChars).size < WORD_LENGTH;
  const tier2Content = hasRepeats
    ? 'This word has repeated letters'
    : 'No repeated letters in this word';

  return [
    { tier: 1, label: 'Letter Hint', content: tier1Content },
    { tier: 2, label: 'Letter Pattern', content: tier2Content },
    { tier: 3, label: 'Course Reference', content: entry.hint },
  ];
}

export function generateShareText(
  guesses: string[],
  results: LetterState[][],
  status: GameStatus,
  hintsRevealed: number,
  dayIndex: number,
): string {
  const scoreLine = status === 'won' ? `${guesses.length}/6` : 'X/6';
  const lines: string[] = [
    `OMSCS Wordle #${dayIndex}`,
    scoreLine,
    `Hints: ${hintsRevealed}/3`,
    '',
  ];

  for (const row of results) {
    const emojiRow = row
      .map((s) => {
        switch (s) {
          case 'correct':
            return '\u{1F7E9}';
          case 'present':
            return '\u{1F7E8}';
          case 'absent':
            return '\u{2B1B}';
          case 'empty':
            return '\u{2B1C}';
        }
      })
      .join('');
    lines.push(emojiRow);
  }

  lines.push('', 'Join the OMSCS Wordle @ https://nkapila6.github.io/omscs-wordle/');

  return lines.join('\n');
}

export function getTimeUntilNextWord(): {
  hours: number;
  minutes: number;
  seconds: number;
} {
  const now = Date.now();
  const nowUTC4 = now + 4 * 3600 * 1000;
  const nextMidnightUTC4 =
    (Math.floor(nowUTC4 / 86400000) + 1) * 86400000;
  const remaining = nextMidnightUTC4 - nowUTC4;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}
