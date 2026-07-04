import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dashboard } from "./dashboard";
import { LocalLearnerRepository } from "@/lib/storage/local-repository";

class MemoryStorage {
  private data = new Map<string, string>();
  getItem(key: string) {
    return this.data.get(key) ?? null;
  }
  setItem(key: string, value: string) {
    this.data.set(key, value);
  }
}

describe("Dashboard", () => {
  it("starts as Senthee's empty real dashboard with no fake streak", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<Dashboard repository={repository} />);

    expect(screen.getByRole("heading", { name: "Senthee，今天继续靠近 7 分" })).toBeInTheDocument();
    expect(screen.getByText("0 pts")).toBeInTheDocument();
    expect(screen.getByText("连续 0 天")).toBeInTheDocument();
    expect(screen.getByText("安装为 App")).toBeInTheDocument();
    expect(screen.getByText("完成第一项任务后，这里会出现今天的学习变化。")).toBeInTheDocument();
  });

  it("changes the time budget and records a completed task in the daily diff", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<Dashboard repository={repository} />);

    await user.click(screen.getByRole("button", { name: "10 分钟" }));
    expect(screen.getByText("Section 1 表格填空")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "完成并记录" }));
    expect(screen.getByText("10 pts")).toBeInTheDocument();
    expect(screen.getByText(/Section 1 表格填空/)).toBeInTheDocument();
    expect(screen.getByText("连续 1 天")).toBeInTheDocument();
  });

  it("offers a complete personal data export", () => {
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<Dashboard repository={repository} />);
    expect(
      screen.getByRole("button", { name: "导出学习数据" }),
    ).toBeInTheDocument();
  });
});
