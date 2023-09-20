import { act, render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { ME_QUERY } from "../hooks/useMe";
import { BrowserRouter } from "react-router-dom";
import { Header } from "./Header";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: false,
                },
              },
            },
          },
        ]}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    screen.getByText("Please verify your email.");
  });

  it("renders without verify banner", async () => {
    render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: ME_QUERY,
            },
            result: {
              data: {
                me: {
                  id: 1,
                  email: "",
                  role: "",
                  verified: true,
                },
              },
            },
          },
        ]}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText("Please verify your email.")).toBeNull();
  });
});
