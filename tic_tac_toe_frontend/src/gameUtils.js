 // PUBLIC_INTERFACE
 /**
  * calculateWinner
  * Determines the winner of a Tic Tac Toe board.
  * @param {Array<string|null>} squares - A length-9 array representing the board.
  * @returns {'X'|'O'|null} The winner symbol or null if no winner yet.
  */
 export function calculateWinner(squares) {
   /** Winning line indices across rows, columns, and diagonals. */
   const lines = [
     [0, 1, 2],
     [3, 4, 5],
     [6, 7, 8],
     [0, 3, 6],
     [1, 4, 7],
     [2, 5, 8],
     [0, 4, 8],
     [2, 4, 6],
   ];
   for (let i = 0; i < lines.length; i += 1) {
     const [a, b, c] = lines[i];
     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
       return squares[a];
     }
   }
   return null;
 }
 
 // PUBLIC_INTERFACE
 /**
  * isDraw
  * Determines whether the board is in a draw state (all filled and no winner).
  * @param {Array<string|null>} squares - A length-9 array representing the board.
  * @returns {boolean} True if draw, otherwise false.
  */
 export function isDraw(squares) {
   return squares.every((s) => s !== null);
 }
 
 /**
  * Returns available empty indices in the board.
  * @param {Array<string|null>} squares
  * @returns {number[]}
  */
 function availableMoves(squares) {
   const res = [];
   for (let i = 0; i < squares.length; i += 1) {
     if (squares[i] == null) res.push(i);
   }
   return res;
 }
 
 /**
  * Checks if the board is in a terminal state and returns a score.
  * @param {Array<string|null>} squares
  * @param {'X'|'O'} aiSymbol
  * @param {'X'|'O'} humanSymbol
  * @returns {{done: boolean, score: number|null}}
  */
 function terminalScore(squares, aiSymbol, humanSymbol) {
   const w = calculateWinner(squares);
   if (w === aiSymbol) return { done: true, score: 1 };
   if (w === humanSymbol) return { done: true, score: -1 };
   if (isDraw(squares)) return { done: true, score: 0 };
   return { done: false, score: null };
 }
 
 /**
  * Minimax algorithm for Tic Tac Toe. Since the board is tiny, recursion is fine.
  * @param {Array<string|null>} squares
  * @param {'X'|'O'} aiSymbol
  * @param {'X'|'O'} humanSymbol
  * @param {boolean} maximizing - true if it's AI's turn, false otherwise
  * @returns {{score: number, move: number|null}}
  */
 function minimax(squares, aiSymbol, humanSymbol, maximizing) {
   const term = terminalScore(squares, aiSymbol, humanSymbol);
   if (term.done) {
     return { score: term.score, move: null };
   }
 
   const moves = availableMoves(squares);
   if (maximizing) {
     let bestScore = -Infinity;
     let bestMove = null;
     for (const m of moves) {
       const next = squares.slice();
       next[m] = aiSymbol;
       const result = minimax(next, aiSymbol, humanSymbol, false);
       if (result.score > bestScore) {
         bestScore = result.score;
         bestMove = m;
       }
     }
     return { score: bestScore, move: bestMove };
   } else {
     let bestScore = Infinity;
     let bestMove = null;
     for (const m of moves) {
       const next = squares.slice();
       next[m] = humanSymbol;
       const result = minimax(next, aiSymbol, humanSymbol, true);
       if (result.score < bestScore) {
         bestScore = result.score;
         bestMove = m;
       }
     }
     return { score: bestScore, move: bestMove };
   }
 }
 
 // PUBLIC_INTERFACE
 /**
  * getBestMove
  * Computes the optimal move for the AI using minimax (unbeatable).
  * This function assumes it's currently the AI's turn.
  * @param {Array<string|null>} squares - Board state.
  * @param {'X'|'O'} aiSymbol - AI's symbol.
  * @param {'X'|'O'} humanSymbol - Human player's symbol.
  * @returns {number|null} The best move index, or null if no move available.
  */
 export function getBestMove(squares, aiSymbol, humanSymbol) {
   const { move } = minimax(squares, aiSymbol, humanSymbol, true);
   return move;
 }
