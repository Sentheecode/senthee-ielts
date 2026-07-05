import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WritingTopicBank } from "./writing-topic-bank";
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

describe("WritingTopicBank", () => {
  it("shows bundled writing topics immediately", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    const { container } = render(<WritingTopicBank repository={repository} />);

    // Topics render immediately from bundled LOCAL_TOPICS (20 writing prompts)
    expect(container.innerHTML).toContain("university education");
    expect(container.innerHTML).toContain("topic-card");
    expect(screen.getByText(/本地题库/)).toBeInTheDocument();
  });

  it("records a selected writing topic as output practice", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<WritingTopicBank repository={repository} />);

    // Click the first topic's "记录这题" button
    const recordButtons = screen.getAllByRole("button", { name: "记录这题" });
    await user.click(recordButtons[0]);

    expect(repository.load().attempts).toMatchObject([
      {
        taskId: "writing-topic",
        kind: "output",
        minutes: 20,
        detail: expect.stringContaining("university education"),
      },
    ]);
  });
});