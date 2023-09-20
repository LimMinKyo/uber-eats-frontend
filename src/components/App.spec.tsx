import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import { isLoggedInVar } from "../apollo";

jest.mock("../routers/logged-out-router", () => {
  return () => <span>logged-out</span>;
});

jest.mock("../routers/logged-in-router", () => {
  return () => <span>logged-in</span>;
});

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    render(<App />);
    screen.getByText("logged-out");
  });

  it("renders LoggedInRouter", async () => {
    render(<App />);
    isLoggedInVar(true);
    await waitFor(() => {
      screen.getByText("logged-in");
    });
  });
});
