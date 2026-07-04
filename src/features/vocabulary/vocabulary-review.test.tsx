import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VocabularyReview } from "./vocabulary-review";
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

describe("VocabularyReview", () => {
  it("reveals a phrase and records a review", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<VocabularyReview repository={repository} />);
    await user.click(screen.getByRole("button", { name: "显示释义" }));
    expect(screen.getByText("按时完成；赶上截止时间")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "掌握了" }));
    expect(screen.getByText("今日已复习 1 个词块")).toBeInTheDocument();
    expect(repository.load().attempts).toMatchObject([
      { taskId: "vocab-3", kind: "completion", minutes: 3 },
    ]);
  });
});
