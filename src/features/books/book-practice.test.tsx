import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookPractice } from "./book-practice";
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

describe("BookPractice", () => {
  it("shows an answer-sheet mode without copyrighted question text", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<BookPractice repository={repository} />);

    expect(screen.getByRole("heading", { name: "真题书" })).toBeInTheDocument();
    expect(screen.getByLabelText("Book")).toHaveValue("Cambridge IELTS 19");
    expect(screen.getByText("不含题文和音频，只记录做题过程。")).toBeInTheDocument();
    expect(screen.queryByText(/题干原文/)).not.toBeInTheDocument();
  });

  it("records a book section attempt from the phone answer sheet", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<BookPractice repository={repository} />);

    await user.type(screen.getByLabelText("1"), "A");
    await user.type(screen.getByLabelText("错题号"), "1, 4, 8");
    await user.type(screen.getByLabelText("订正记录"), "第 1 题拼写不稳");
    await user.click(screen.getByRole("button", { name: "记录本节" }));

    expect(screen.getByText("已记录：Cambridge IELTS 19 · Test 1 · Listening Section 1")).toBeInTheDocument();
    expect(repository.load().attempts).toMatchObject([
      {
        taskId: "book-listening",
        kind: "correction",
        minutes: 10,
        detail: expect.stringContaining("错题：1, 4, 8"),
      },
    ]);
  });
});
