import type { HintTier, GameStatus } from '../game/types';

interface HintPanelProps {
  hintTiers: HintTier[];
  hintsRevealed: number;
  onReveal: () => void;
  status: GameStatus;
}

export function HintPanel({ hintTiers, hintsRevealed, onReveal, status }: HintPanelProps) {
  const canReveal = status === 'playing' && hintsRevealed < 3;

  return (
    <div className="hint-panel">
      {canReveal && (
        <button className="hint-button" onClick={onReveal}>
          Reveal Hint ({hintsRevealed}/3)
        </button>
      )}
      <div className="hint-counter">Hints: {hintsRevealed}/3</div>
      {hintsRevealed > 0 && (
        <div className="hint-list">
          {hintTiers.slice(0, hintsRevealed).map((tier) => (
            <div key={tier.tier} className="hint-item">
              <div className="hint-label">{tier.label}</div>
              <div className="hint-content">{tier.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}