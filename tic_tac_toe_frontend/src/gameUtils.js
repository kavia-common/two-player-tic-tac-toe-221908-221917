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
