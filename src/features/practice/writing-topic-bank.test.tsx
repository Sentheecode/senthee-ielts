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
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify([
      {
        year: 2026,
        date: "2026/1/1",
        topic: "Education & Learning",
        en: "Some people think children should read more books. Discuss both views and give your opinion.",
        zh: "有人认为孩子应该多读书。讨论双方观点并给出你的看法。",
      },
    ]), { status: 200 })));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads writing topics from the external public JSON without bundling them", async () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<WritingTopicBank repository={repository} />);

    expect(await screen.findByText(/Some people think children/)).toBeInTheDocument();
    expect(screen.getByText("来源：外部题库 JSON")).toBeInTheDocument();
  });

  it("records a selected writing topic as output practice", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<WritingTopicBank repository={repository} />);

    await screen.findByText(/Some people think children/);
    await user.click(screen.getByRole("button", { name: "记录这题" }));

    expect(repository.load().attempts).toMatchObject([
      {
        taskId: "writing-topic",
        kind: "output",
        minutes: 20,
        detail: expect.stringContaining("Education & Learning"),
      },
    ]);
  });
});
