# Tic Tac Toe - React Frontend

A lightweight, modern React implementation of a two-player Tic Tac Toe game.

## Features

- Centered 3x3 grid with clean, modern UI
- Alternating X/O turns (X starts)
- Winner detection across rows, columns, and diagonals
- Draw detection
- End-of-game message and Restart button
- Light theme with primary (#3b82f6) and success (#06b6d4) accents
- No backend dependencies

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
