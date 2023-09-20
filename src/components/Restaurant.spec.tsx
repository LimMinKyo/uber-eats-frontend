import { render, screen } from "@testing-library/react";
import { Restaurant } from "./Restaurant";
import { BrowserRouter } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const props = {
      id: 1,
      name: "name",
      categoryName: "categoryName",
      coverImg: "lala",
    };
    render(
      <BrowserRouter>
        <Restaurant {...props} />
      </BrowserRouter>
    );
    screen.getByText(props.name);
    screen.getByText(props.categoryName);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/restaurants/${props.id}`
    );
  });
});
