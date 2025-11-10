import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import './index.css';
import { calculateWinner, isDraw, getBestMove } from './gameUtils';

/**
 * PUBLIC_INTERFACE
 * App - Main Tic Tac Toe application component.
 * Renders a centered 3x3 grid, a title, a turn indicator, and end-of-game messaging.
 * Includes a restart button to reset the game state.
 * Now supports Two Players and Play vs AI modes. When in AI mode, X is human and O is AI by default.
 */
function App() {
  // Board state: 9 cells initialized to null
  const [board, setBoard] = useState(Array(9).fill(null));
  // X always starts
  const [xIsNext, setXIsNext] = useState(true);
  // Game mode: 'PVP' (two players) or 'AI'
  const [mode, setMode] = useState('PVP'); // default keep previous behavior (2 players)
  // Side selection for AI mode (optional extension): human as 'X' or 'O'
  const [humanSymbol, setHumanSymbol] = useState('X'); // default human is X
  // AI thinking state (for UI disabling)
  const [aiThinking, setAiThinking] = useState(false);
  const aiMoveTimer = useRef(null);

  // Derived game state
  const winner = useMemo(() => calculateWinner(board), [board]);
  const draw = useMemo(() => !winner && isDraw(board), [board, winner]);
  const gameOver = !!winner || draw;

  const currentPlayer = xIsNext ? 'X' : 'O';
  const aiSymbol = humanSymbol === 'X' ? 'O' : 'X';
  const isAiTurn = mode === 'AI' && !gameOver && currentPlayer === aiSymbol;

  // Clean up any pending AI timers on unmount
  useEffect(() => {
    return () => {
      if (aiMoveTimer.current) {
        clearTimeout(aiMoveTimer.current);
      }
    };
  }, []);

  // Schedule AI move when it's AI's turn
  useEffect(() => {
    if (!isAiTurn) return;
    // Extra guard: ensure there is no terminal state and it's truly AI's turn
    if (gameOver) return;

    setAiThinking(true);
    aiMoveTimer.current = setTimeout(() => {
      // Compute and perform AI move
      const index = getBestMove(board, aiSymbol, humanSymbol);
      if (index != null && board[index] == null) {
        const next = board.slice();
        next[index] = aiSymbol;
        setBoard(next);
        setXIsNext((prev) => !prev);
      }
      setAiThinking(false);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAiTurn, gameOver, board, aiSymbol, humanSymbol]);

  const handleCellClick = (index) => {
    // Ignore clicks if game is over, cell already filled, or it's AI's turn (in AI mode)
    if (gameOver || board[index]) return;

    if (mode === 'AI') {
      // In AI mode, only allow human to move on their turn
      const currentIsHuman = currentPlayer === humanSymbol;
      if (!currentIsHuman || aiThinking) return;
    }

    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    // Reset state but preserve current mode and side selection
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setAiThinking(false);
    if (aiMoveTimer.current) {
      clearTimeout(aiMoveTimer.current);
      aiMoveTimer.current = null;
    }
  };

  const handleSelectMode = (newMode) => {
    setMode(newMode);
    // Reset game entirely for mode change to avoid inconsistent states
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setAiThinking(false);
    if (aiMoveTimer.current) {
      clearTimeout(aiMoveTimer.current);
      aiMoveTimer.current = null;
    }
  };

  const handleSelectHumanSymbol = (symbol) => {
    // Only applicable in AI mode
    setHumanSymbol(symbol);
    // Restart the game to apply side change
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setAiThinking(false);
    if (aiMoveTimer.current) {
      clearTimeout(aiMoveTimer.current);
      aiMoveTimer.current = null;
    }
  };

  // Accessibility helper for ARIA label per cell
  const getCellAriaLabel = (i) => {
    const value = board[i];
    if (value) return `Cell ${i + 1}, ${value}`;
    return `Cell ${i + 1}, empty, press to place ${currentPlayer}`;
  };

  const statusText = winner
    ? `Player ${winner} wins`
    : draw
      ? `It's a draw`
      : `Turn: Player ${currentPlayer}${mode === 'AI' ? currentPlayer === humanSymbol ? ' (You)' : ' (AI)' : ''}`;

  return (
    <div className="App">
      <main className="t3-container" role="main">
        <header className="t3-header">
          <h1 className="t3-title">Tic Tac Toe</h1>

          {/* Mode selector */}
          <div className="t3-mode-selector" role="group" aria-label="Game mode">
            <button
              className={`t3-button ${mode === 'PVP' ? 't3-button-primary' : ''}`}
              onClick={() => handleSelectMode('PVP')}
              aria-pressed={mode === 'PVP'}
            >
              2 Players
            </button>
            <button
              className={`t3-button ${mode === 'AI' ? 't3-button-primary' : ''}`}
              onClick={() => handleSelectMode('AI')}
              aria-pressed={mode === 'AI'}
              style={{ marginLeft: 8 }}
            >
              Play vs AI
            </button>
          </div>

          {mode === 'AI' && (
            <div className="t3-mode-details" role="group" aria-label="Side selection" style={{ marginTop: 10 }}>
              <span className="t3-hint" style={{ marginRight: 8 }}>You play as:</span>
              <button
                className={`t3-button ${humanSymbol === 'X' ? 't3-button-primary' : ''}`}
                onClick={() => handleSelectHumanSymbol('X')}
                aria-pressed={humanSymbol === 'X'}
              >
                X (first)
              </button>
              <button
                className={`t3-button ${humanSymbol === 'O' ? 't3-button-primary' : ''}`}
                onClick={() => handleSelectHumanSymbol('O')}
                aria-pressed={humanSymbol === 'O'}
                style={{ marginLeft: 8 }}
              >
                O (second)
              </button>
            </div>
          )}

          <p className={`t3-status ${winner ? 't3-status-win' : draw ? 't3-status-draw' : ''}`}>
            {statusText}
          </p>
        </header>

        <section className="t3-board" role="grid" aria-label="Tic Tac Toe board">
          <div className="t3-grid">
            {board.map((cell, i) => (
              <button
                key={i}
                role="gridcell"
                aria-label={getCellAriaLabel(i)}
                className={`t3-cell ${cell ? 't3-cell-filled' : ''} ${(gameOver || (mode === 'AI' && aiThinking && currentPlayer === aiSymbol)) ? 't3-cell-disabled' : ''}`}
                onClick={() => handleCellClick(i)}
                disabled={!!cell || gameOver || (mode === 'AI' && (!xIsNext && humanSymbol === 'X' || xIsNext && humanSymbol === 'O')) || (mode === 'AI' && aiThinking)}
              >
                <span className={`t3-mark ${cell === 'X' ? 't3-x' : cell === 'O' ? 't3-o' : ''}`}>
                  {cell}
                </span>
              </button>
            ))}
          </div>
        </section>

        <footer className="t3-footer">
          {gameOver ? (
            <button
              className="t3-button t3-button-primary"
              onClick={handleRestart}
              aria-label="Restart game"
            >
              Restart
            </button>
          ) : (
            <div className="t3-hint" aria-live="polite">
              {mode === 'AI'
                ? currentPlayer === humanSymbol
                  ? `Your turn (${humanSymbol}). Click an empty cell.`
                  : `AI is thinking...`
                : `Click an empty cell to place ${currentPlayer}.`}
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
