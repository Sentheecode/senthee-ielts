import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VocabularyReview } from "./vocabulary-review";

describe("VocabularyReview", () => {
  it("reveals a phrase and records a review", async () => {
    const user = userEvent.setup();
    render(<VocabularyReview />);
    await user.click(screen.getByRole("button", { name: "显示释义" }));
    expect(screen.getByText("按时完成；赶上截止时间")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "掌握了" }));
    expect(screen.getByText("今日已复习 1 个词块")).toBeInTheDocument();
  });
});
