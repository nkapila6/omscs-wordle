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
  dayIndex,
  guesses,
  results,
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

  const generateShareImage = () => {
    const TILE = 48;
    const GAP = 6;
    const PADDING = 24;
    const ROWS = results.length;
    const gridWidth = 5 * TILE + 4 * GAP;
    const gridHeight = ROWS * TILE + (ROWS - 1) * GAP;
    const width = gridWidth + PADDING * 2;
    const headerHeight = 100;
    const footerHeight = 40;
    const height = headerHeight + gridHeight + footerHeight + PADDING * 2;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // background
    ctx.fillStyle = '#0A1628';
    ctx.fillRect(0, 0, width, height);

    // title
    ctx.fillStyle = '#B3A369';
    ctx.font = 'bold 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OMSCS Wordle', width / 2, 36);

    // day + score
    ctx.fillStyle = '#A0A8B0';
    ctx.font = '600 14px system-ui, sans-serif';
    const score = status === 'won' ? `${guesses.length}/6` : 'X/6';
    ctx.fillText(`#${dayIndex}  ${score}  Hints: ${hintsRevealed}/3`, width / 2, 60);

    // tiles
    const startY = headerHeight + PADDING;
    const startX = PADDING;
    for (let i = 0; i < ROWS; i++) {
      const row = results[i];
      for (let j = 0; j < 5; j++) {
        const x = startX + j * (TILE + GAP);
        const y = startY + i * (TILE + GAP);
        const state = row[j];
        if (state === 'correct') ctx.fillStyle = '#B3A369';
        else if (state === 'present') ctx.fillStyle = '#003057';
        else ctx.fillStyle = '#3A3A3E';
        ctx.fillRect(x, y, TILE, TILE);
      }
    }

    // footer link
    ctx.fillStyle = '#6B7280';
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillText('nkapila6.github.io/omscs-wordle', width / 2, height - 16);

    // download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `omscs-wordle-${dayIndex}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

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
        <button className="share-button" onClick={generateShareImage} style={{ background: 'transparent', color: 'var(--gt-gold)', border: '1px solid var(--gt-gold)' }}>Share as Image</button>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}