import { render, screen } from "../test-utils";
import { Restaurant } from "./Restaurant";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const props = {
      id: 1,
      name: "name",
      categoryName: "categoryName",
      coverImg: "lala",
    };
    render(<Restaurant {...props} />);
    screen.getByText(props.name);
    screen.getByText(props.categoryName);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/restaurants/${props.id}`
    );
  });
});
