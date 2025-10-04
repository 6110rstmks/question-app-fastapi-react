// CalendarModal.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import CalendarModal from "../components/CalendarModal";

// --- モック ---
vi.mock("../client/ProblemAPI", () => ({
  fetchProblemByDay: vi.fn(),
}));

vi.mock("../client/QuestionAPI", () => ({
  fetchQuestionCountsByLastAnsweredDate: vi.fn().mockResolvedValue({}),
}));

// useNavigate をモック
const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

import { fetchProblemByDay } from "../client/ProblemAPI";

describe("CalendarModal handleSetProblemByDay", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls fetchProblemByDay and navigates with correct state when a date is clicked", async () => {
    // モックの返り値を準備
    const fakeProblem = { id: 1, problem: "テスト問題", answer: ["テスト解答"] };
    (fetchProblemByDay as jest.Mock).mockResolvedValue(fakeProblem);

    const setIsDisplayCalendar = vi.fn();

    render(
      <CalendarModal setIsDisplayCalendar={setIsDisplayCalendar} />
    );

    // 日付のセル（例: 今日の日付）をクリック
    const today = new Date().getDate().toString();
    const todayCell = screen.getByText(today);
    fireEvent.click(todayCell);

    // fetchProblemByDay が呼ばれたことを確認
    await waitFor(() => {
      expect(fetchProblemByDay).toHaveBeenCalled();
    });

    // navigate が正しい引数で呼ばれたことを確認
    expect(mockedNavigate).toHaveBeenCalledWith("/problem", {
      state: {
        problemData: fakeProblem,
        from: "setProblemPage",
      },
    });
  });
});
