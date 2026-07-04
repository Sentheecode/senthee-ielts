import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("welcomes the learner toward the band target", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Senthee，今天继续靠近 7 分" }),
    ).toBeInTheDocument();
  });
});
