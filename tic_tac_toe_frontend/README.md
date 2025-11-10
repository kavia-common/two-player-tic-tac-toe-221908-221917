# Tic Tac Toe - React Frontend

A lightweight, modern React implementation of a Tic Tac Toe game with both Two Players and Play vs AI modes.

## Features

- Centered 3x3 grid with clean, modern UI
- Alternating X/O turns (X starts)
- Winner detection across rows, columns, and diagonals
- Draw detection
- End-of-game message and Restart button
- Light theme with primary (#3b82f6) and success (#06b6d4) accents
- No backend dependencies
- Play modes:
  - 2 Players (same device)
  - Play vs AI (unbeatable AI using minimax). Human can choose to play as X (first) or O (second).

## How to Play

- Use the mode buttons below the title to switch between:
  - "2 Players" (default): both players take turns on the same device.
  - "Play vs AI": human plays against an AI that will move automatically after your turn.
- In "Play vs AI" mode:
  - Human plays as X by default. You can switch to O using the side selector.
  - The AI moves automatically after your valid move. It will never move when the game is over or it's not AI's turn.
- Use the Restart button to reset the board at any time. Restart preserves the selected mode and side.

## Running Locally

From this directory:

```bash
npm install
npm start
```

The app will be available at http://localhost:3000.

## Scripts

- `npm start` - Start the dev server
- `npm test` - Run unit tests
- `npm run build` - Build for production

## Notes

- This app does not call any backend services and requires no environment configuration to run.
- Game logic helpers live in `src/gameUtils.js` for easy unit testing and reuse.
- The AI logic is implemented in `getBestMove(board, aiSymbol, humanSymbol)` using the minimax algorithm.
