import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("welcomes Senthee without a band target", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { name: "Senthee" }),
    ).toBeInTheDocument();
  });
});
