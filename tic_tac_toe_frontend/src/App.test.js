import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

jest.useFakeTimers();

test('renders title and initial status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Turn: Player X/i)).toBeInTheDocument();
});

test('alternates turns and detects a win (Two Players)', () => {
  render(<App />);
  const cells = screen.getAllByRole('gridcell');
  // X moves
  fireEvent.click(cells[0]);
  // O moves
  fireEvent.click(cells[3]);
  // X moves
  fireEvent.click(cells[1]);
  // O moves
  fireEvent.click(cells[4]);
  // X moves and wins top row
  fireEvent.click(cells[2]);

  expect(screen.getByText(/Player X wins/i)).toBeInTheDocument();
  // Restart appears
  expect(screen.getByRole('button', { name: /restart/i })).toBeInTheDocument();
});

test('AI mode button toggles and AI makes a move automatically', () => {
  render(<App />);
  // Switch to AI mode
  fireEvent.click(screen.getByRole('button', { name: /Play vs AI/i }));
  // Human is X by default. Click a corner.
  const cells = screen.getAllByRole('gridcell');
  fireEvent.click(cells[0]);

  // After human move, AI should think and move within timeout
  act(() => {
    jest.advanceTimersByTime(350);
  });

  const filledCells = cells.filter((c) => c.textContent !== '');
  expect(filledCells.length).toBe(2); // human + AI
});

test('Restart resets board and maintains mode/side', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Play vs AI/i }));
  const cells = screen.getAllByRole('gridcell');
  fireEvent.click(cells[0]);

  act(() => {
    jest.advanceTimersByTime(350);
  });

  // Now restart
  fireEvent.click(screen.getByRole('button', { name: /restart/i }));
  // Board should be cleared and X to move again
  const cellsAfter = screen.getAllByRole('gridcell');
  expect(cellsAfter.every((c) => c.textContent === '')).toBe(true);
  expect(screen.getByText(/Turn: Player X/i)).toBeInTheDocument();
});
