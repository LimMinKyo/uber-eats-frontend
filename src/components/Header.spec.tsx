import { act, render, screen } from "../test-utils";
import { MockedProvider } from "@apollo/client/testing";
import { ME_QUERY } from "../hooks/useMe";
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
        <Header />
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
        <Header />
      </MockedProvider>
    );
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    expect(screen.queryByText("Please verify your email.")).toBeNull();
  });
});
