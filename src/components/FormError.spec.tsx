import { render, screen } from "../test-utils";
import { FormError } from "./FormError";

describe("<FormError />", () => {
  it("renders OK with props", () => {
    render(<FormError errorMessage="test" />);
    screen.getByText("test");
  });
});
