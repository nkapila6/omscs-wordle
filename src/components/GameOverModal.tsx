import { useState, useEffect } from 'react';
import type { GameStatus, LetterState } from '../game/types';
import { getTimeUntilNextWord } from '../game/engine';

interface GameOverModalProps {
  status: GameStatus;
  answer: string;
  dayIndex: number;
  guesses: string[];
  results: LetterState[][];
  hintsRevealed: number;
  onShare: () => void;
  onClose: () => void;
}

export function GameOverModal({
  status,
  answer,
  hintsRevealed,
  onShare,
  onClose,
}: GameOverModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilNextWord());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextWord());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleShare = () => {
    onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{status === 'won' ? 'You got it!' : 'Better luck tomorrow!'}</h2>
        <div className="answer">{answer}</div>
        <div className="hints-used">{hintsRevealed}/3 hints revealed</div>
        <div className="countdown">
          Next word in {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </div>
        {copied && <div className="copied">Copied to clipboard!</div>}
        <button className="share-button" onClick={handleShare}>Share</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}