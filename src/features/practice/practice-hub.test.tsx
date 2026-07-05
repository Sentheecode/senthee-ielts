import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PracticeHub } from "./practice-hub";
import { LocalLearnerRepository, type StorageLike } from "@/lib/storage/local-repository";

class MemoryStorage implements StorageLike {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

// Mock Math.random to return deterministic values for Fisher-Yates shuffle
const originalRandom = Math.random;
beforeAll(() => {
  Math.random = () => 0.5;
});
afterAll(() => {
  Math.random = originalRandom;
});

describe("PracticeHub", () => {
  it("checks a reading answer and supports correction", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<PracticeHub repository={repository} />);

    // Reading content loads immediately via lazy useState (deterministic with mocked random)
    expect(screen.getByText(/Remote Work Survey/)).toBeInTheDocument();

    // Answer all questions: first correct, second wrong → partial correction
    const options = screen.getAllByRole("radio");
    await user.click(options[0]); // Q1: "42%" (wrong, correct is "Over two thirds")
    await user.click(options[4]); // Q2: "Commute time" (wrong, correct is "Team cohesion")
    await user.click(screen.getByRole("button", { name: "检查答案" }));

    // Answer check records attempt with partial correction
    expect(repository.load().attempts).toMatchObject([
      { taskId: "reading-drill", kind: "correction", minutes: 5 },
    ]);
  });

  it("submits a writing paragraph and shows saved Chinese feedback", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<PracticeHub repository={repository} />);

    await user.click(screen.getByRole("tab", { name: "写作" }));
    const textarea = screen.getByLabelText("写作内容");
    await user.type(textarea, "I am writing to raise a concern about the timetable.");
    await user.click(screen.getByRole("button", { name: "提交给 Agent" }));
    expect(await screen.findByText(/反馈已保存/)).toBeInTheDocument();
    expect(repository.load().attempts).toMatchObject([
      { taskId: "writing-paragraph", kind: "output", minutes: 15 },
    ]);
  });
});