import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from './App';

// smoke test: Appコンポーネントがレンダリングできるか
test('renders without crashing', () => {
  render(
      <App />
  );
  // Loginページがデフォルト表示されるはず
  expect(screen.getByText(/ログインして始める/)).toBeInTheDocument();
});
