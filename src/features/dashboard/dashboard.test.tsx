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
  it("changes the time budget and records a completed task in the daily diff", async () => {
    const user = userEvent.setup();
    const repository = new LocalLearnerRepository(new MemoryStorage());
    render(<Dashboard repository={repository} />);

    await user.click(screen.getByRole("button", { name: "10 分钟" }));
    expect(screen.getByText("Section 1 表格填空")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "完成并记录" }));
    expect(screen.getByText("10 pts")).toBeInTheDocument();
    expect(screen.getByText(/Section 1 表格填空/)).toBeInTheDocument();
  });
});
