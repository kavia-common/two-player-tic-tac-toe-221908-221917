import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders title and initial status', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByText(/Turn: Player X/i)).toBeInTheDocument();
});

test('alternates turns and detects a win', () => {
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
