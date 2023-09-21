import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { CreateAccountPage } from "./create-account";
import { render, waitFor } from "../test-utils";

const setup = () => {
  const mockApolloClient = createMockClient();

  render(
    <ApolloProvider client={mockApolloClient}>
      <CreateAccountPage />
    </ApolloProvider>
  );

  return {
    mockApolloClient,
  };
};

describe("<CreateAccountPage />", () => {
  let mockClient: MockApolloClient;

  beforeEach(() => {
    const { mockApolloClient } = setup();
    mockClient = mockApolloClient;
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Uber Eats");
    });
  });
});
