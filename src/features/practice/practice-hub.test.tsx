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

describe("PracticeHub", () => {
  it("checks a reading answer and supports correction", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<PracticeHub repository={repository} />);
    expect(screen.queryByText(/工作场景/)).not.toBeInTheDocument();
    await user.click(screen.getByLabelText("flexible working hours"));
    await user.click(screen.getByRole("button", { name: "检查答案" }));
    expect(screen.getByText("回答正确：你识别出了同义替换。")) .toBeInTheDocument();
    expect(repository.load().attempts).toMatchObject([
      { taskId: "reading-drill", kind: "completion", minutes: 5 },
    ]);
  });

  it("submits a writing paragraph and shows saved Chinese feedback", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<PracticeHub repository={repository} />);
    await user.click(screen.getByRole("tab", { name: "写作" }));
    await user.type(screen.getByLabelText("写作练习内容"), "I am writing to raise a concern about the timetable because it affects my work.");
    await user.click(screen.getByRole("button", { name: "提交给 Agent" }));
    expect(await screen.findByText(/反馈已保存/)).toBeInTheDocument();
    expect(repository.load().attempts).toMatchObject([
      { taskId: "writing-paragraph", kind: "output", minutes: 15 },
    ]);
  });
});
