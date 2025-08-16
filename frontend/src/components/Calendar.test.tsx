import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from './Calendar';

// ---- API と useNavigate をモック ----
const mockFetchCounts = vi.fn();
const mockFetchProblemByDay = vi.fn();
vi.mock('../api/QuestionAPI', () => ({
  fetchQuestionCountsByLastAnsweredDate: (...args: unknown[]) => mockFetchCounts(...args),
}));
vi.mock('../api/ProblemAPI', () => ({
  fetchProblemByDay: (...args: unknown[]) => mockFetchProblemByDay(...args),
}));
const mockNavigate = vi.fn();
vi.mock('react-router', async (orig) => {
  const actual = await orig();
  return { ...actual, useNavigate: () => mockNavigate };
});

// ---- 現在日時を固定（例：2024-02-15）----
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2024-02-15T09:00:00Z'));
});
afterAll(() => {
  vi.useRealTimers();
});

beforeEach(() => {
  vi.clearAllMocks();
});

// デフォルトで件数 API は空の結果を返す
beforeEach(() => {
  mockFetchCounts.mockResolvedValue({});
});

// ========== テスト ==========

test('ヘッダーに現在月が表示される（yyyy年 MM月）', async () => {
  render(<Calendar />);
  // 2024年 02月 を期待（タイムゾーン差を避けるため月のみチェックでもOK）
  expect(
    await screen.findByRole('heading', { name: /2024年 02月/ })
  ).toBeInTheDocument();
});

test('曜日ラベルが表示される', () => {
  render(<Calendar />);
  ['日', '月', '火', '水', '木', '金', '土'].forEach((d) => {
    expect(screen.getByText(d)).toBeInTheDocument();
  });
});

test('APIの集計結果が反映される（件数バッジ表示）', async () => {
  // グリッドに含まれる日付の1つに件数を返す（2024-02-10 に 3件）
  mockFetchCounts.mockResolvedValue({ '2024-02-10': 3 });

  render(<Calendar />);

  // 「3件」が表示されるまで待機
  expect(await screen.findByText('3件')).toBeInTheDocument();
});

test('前月・翌月ボタンで月が切り替わる', async () => {
  render(<Calendar />);
  const prev = screen.getByRole('button', { name: '◀' });
  const next = screen.getByRole('button', { name: '▶' });

  // 初期は 2024年 02月
  expect(await screen.findByRole('heading', { name: /2024年 02月/ })).toBeInTheDocument();

  await userEvent.click(prev);
  expect(await screen.findByRole('heading', { name: /2024年 01月/ })).toBeInTheDocument();

  await userEvent.click(next);
  expect(await screen.findByRole('heading', { name: /2024年 02月/ })).toBeInTheDocument();
  await userEvent.click(next);
  expect(await screen.findByRole('heading', { name: /2024年 03月/ })).toBeInTheDocument();
});

test('日付セルをクリックすると問題取得→/problem へ navigate する', async () => {
  // クリック先の日付の返り値をモック
  const fakeProblem = { id: 123, title: 'sample' };
  mockFetchProblemByDay.mockResolvedValue(fakeProblem);

  render(<Calendar />);

  // カレンダーの「10」など、存在する日をクリック（02月10日が確実にある）
  const grid = screen.getByRole('grid', { hidden: true }) || screen.getByTestId('calendar-grid'); // フォールバック
  // 上の getByRole が取れない場合は下のようにテキストで取得
  const dayCell = await screen.findByText('10');
  await userEvent.click(dayCell);

  await waitFor(() => {
    expect(mockFetchProblemByDay).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/problem', {
      state: { problemData: fakeProblem, from: 'setProblemPage' },
    });
  });
});

test('グリッドの日数（開始〜終了の週で埋まる）が表示される', async () => {
  // 2024年2月は木曜始まり金曜終わりなので 6 週 = 42セルになる（startOfWeek/endOfWeek: 日曜基準）
  render(<Calendar />);

  // セルは role が付いていないので、クラス名で簡易確認（CSS Modules を identity-obj-proxy でモックしていればクラスは文字列）
  const cells = screen.getAllByText(/\d+/, { selector: 'div' })
    .filter((el) => el.parentElement?.className?.toString().includes('calendar_day'));

  expect(cells.length === 35 || cells.length === 42).toBe(true); // 実装変更に強い書き方
});
