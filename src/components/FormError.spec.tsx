import { render, screen } from "@testing-library/react";
import { FormError } from "./FormError";

describe("<FormError />", () => {
  it("renders OK with props", () => {
    render(<FormError errorMessage="test" />);
    screen.getByText("test");
  });
});
