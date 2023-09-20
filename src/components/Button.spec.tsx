import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    render(<Button canClick loading={false} actionText="test" />);
    screen.getByText("test");
  });

  it("should display loading", () => {
    render(<Button canClick={false} loading actionText="test" />);
    const button = screen.getByText("Loading...");
    expect(button).toHaveClass("pointer-events-none");
  });
});
