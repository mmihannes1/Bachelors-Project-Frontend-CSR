import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { it } from 'vitest';
import App from '../App';

it('Renders Test test test', () => {
  render(<App />);
  //expect(screen.getByText('Test, test, test')).toBeInTheDocument();
});
