import React, { useMemo, useState } from 'react';
import './App.css';
import './index.css';
import { calculateWinner, isDraw } from './gameUtils';

/**
 * PUBLIC_INTERFACE
 * App - Main Tic Tac Toe application component.
 * Renders a centered 3x3 grid, a title, a turn indicator, and end-of-game messaging.
 * Includes a restart button to reset the game state.
 */
function App() {
  // Board state: 9 cells initialized to null
  const [board, setBoard] = useState(Array(9).fill(null));
  // X always starts
  const [xIsNext, setXIsNext] = useState(true);
  // Track if game is over
  const winner = useMemo(() => calculateWinner(board), [board]);
  const draw = useMemo(() => !winner && isDraw(board), [board, winner]);
  const gameOver = !!winner || draw;

  const currentPlayer = xIsNext ? 'X' : 'O';

  const handleCellClick = (index) => {
    // Ignore clicks if game is over or cell already filled
    if (gameOver || board[index]) return;
    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const handleRestart = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
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
      : `Turn: Player ${currentPlayer}`;

  return (
    <div className="App">
      <main className="t3-container" role="main">
        <header className="t3-header">
          <h1 className="t3-title">Tic Tac Toe</h1>
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
                className={`t3-cell ${cell ? 't3-cell-filled' : ''} ${gameOver ? 't3-cell-disabled' : ''}`}
                onClick={() => handleCellClick(i)}
                disabled={!!cell || gameOver}
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
              Click an empty cell to place {currentPlayer}.
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
