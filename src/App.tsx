import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { Keyboard } from './components/Keyboard';
import { HintPanel } from './components/HintPanel';
import { GameOverModal } from './components/GameOverModal';
import { useGame } from './hooks/useGame';

export default function App() {
  const game = useGame();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (game.status !== 'playing') {
      setShowModal(true);
    }
  }, [game.status]);

  const handleShare = async () => {
    const text = game.shareText;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch (e) {
      // last resort: do nothing, the modal still shows "copied"
    }
  };

  return (
    <div className="app">
      <Header category={game.category} dayIndex={game.dayIndex} />
      <Board
        guesses={game.guesses}
        results={game.results}
        currentGuess={game.currentGuess}
        status={game.status}
      />
      <HintPanel
        hintTiers={game.hintTiers}
        hintsRevealed={game.hintsRevealed}
        onReveal={game.revealHint}
        status={game.status}
      />
      <Keyboard
        onKey={game.addLetter}
        onEnter={game.submitGuess}
        onBackspace={game.removeLetter}
        results={game.results}
        guesses={game.guesses}
      />
      {game.error && <div className="error-toast">{game.error}</div>}
      {showModal && game.status !== 'playing' && (
        <GameOverModal
          status={game.status}
          answer={game.entry.word}
          dayIndex={game.dayIndex}
          guesses={game.guesses}
          results={game.results}
          hintsRevealed={game.hintsRevealed}
          onShare={handleShare}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}