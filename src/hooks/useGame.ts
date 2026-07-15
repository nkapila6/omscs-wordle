import { useState, useEffect, useCallback, useRef } from 'react';
import { WORDS } from '../data/words';
import {
  getWordOfDay,
  evaluateGuess,
  isValidGuess,
  getHintTiers,
  generateShareText,
} from '../game/engine';
import type { LetterState, GameStatus, HintTier, WordEntry } from '../game/types';

const STORAGE_KEY = 'omscs-wordle-state';
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const ERROR_DURATION_MS = 2000;

interface SavedState {
  dayIndex: number;
  guesses: string[];
  results: LetterState[][];
  status: GameStatus;
  hintsRevealed: number;
}

function loadSavedState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedState;
  } catch {
    return null;
  }
}

function saveState(state: SavedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearSavedState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useGame() {
  const [entry, setEntry] = useState<WordEntry | null>(null);
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [results, setResults] = useState<LetterState[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [status, setStatus] = useState<GameStatus>('playing');
  const [hintsRevealed, setHintsRevealed] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialize game on mount
  useEffect(() => {
    const { entry: wordEntry, dayIndex: currentDayIndex } = getWordOfDay(WORDS);
    setEntry(wordEntry);
    setDayIndex(currentDayIndex);

    const saved = loadSavedState();
    if (saved && saved.dayIndex === currentDayIndex) {
      setGuesses(saved.guesses);
      setResults(saved.results);
      setStatus(saved.status);
      setHintsRevealed(saved.hintsRevealed);
    }
  }, []);

  // Persist state whenever relevant values change
  useEffect(() => {
    if (entry) {
      saveState({ dayIndex, guesses, results, status, hintsRevealed });
    }
  }, [dayIndex, guesses, results, status, hintsRevealed, entry]);

  // Clear error timer on unmount
  useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const setErrorWithAutoClear = useCallback((msg: string) => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }
    setError(msg);
    errorTimerRef.current = setTimeout(() => {
      setError(null);
      errorTimerRef.current = null;
    }, ERROR_DURATION_MS);
  }, []);

  const addLetter = useCallback(
    (letter: string) => {
      if (status !== 'playing' || currentGuess.length >= WORD_LENGTH) return;
      setCurrentGuess((prev) => prev + letter.toUpperCase());
      if (error) setError(null);
    },
    [status, currentGuess.length, error],
  );

  const removeLetter = useCallback(() => {
    if (status !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [status]);

  const submitGuess = useCallback(() => {
    if (status !== 'playing' || currentGuess.length !== WORD_LENGTH) return;

    const guess = currentGuess;

    if (!isValidGuess(guess, WORDS)) {
      setErrorWithAutoClear('Not in word list');
      return;
    }

    if (!entry) return;

    const result = evaluateGuess(entry.word, guess);
    const newGuesses = [...guesses, guess];
    const newResults = [...results, result];

    setGuesses(newGuesses);
    setResults(newResults);
    setCurrentGuess('');

    const isWin = result.every((s) => s === 'correct');
    if (isWin) {
      setStatus('won');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setStatus('lost');
    }
  }, [status, currentGuess, entry, guesses, results, setErrorWithAutoClear]);

  const revealHint = useCallback(() => {
    if (status !== 'playing' || hintsRevealed >= 3) return;
    setHintsRevealed((prev) => prev + 1);
  }, [status, hintsRevealed]);

  const reset = useCallback(() => {
    clearSavedState();
    const { entry: wordEntry, dayIndex: currentDayIndex } = getWordOfDay(WORDS);
    setEntry(wordEntry);
    setDayIndex(currentDayIndex);
    setGuesses([]);
    setResults([]);
    setCurrentGuess('');
    setStatus('playing');
    setHintsRevealed(0);
    setError(null);
  }, []);

  const hintTiers: HintTier[] = entry ? getHintTiers(entry, dayIndex) : [];

  const shareText =
    status === 'won' || status === 'lost'
      ? generateShareText(guesses, results, status, hintsRevealed, dayIndex)
      : '';

  return {
    entry: entry!,
    dayIndex,
    category: entry?.category ?? '',
    hintTiers,
    guesses,
    results,
    currentGuess,
    status,
    hintsRevealed,
    error,
    addLetter,
    removeLetter,
    submitGuess,
    revealHint,
    shareText,
    reset,
  };
}
