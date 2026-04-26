import { render, screen, cleanup } from '@testing-library/react';
import App from './App';

afterEach(() => {
  cleanup();
});

test('renders Portal HidroInfo title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Portal HidroInfo/i);
  expect(titleElement).toBeInTheDocument();
});