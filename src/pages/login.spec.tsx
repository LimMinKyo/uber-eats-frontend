import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { render, screen, waitFor } from "../test-utils";
import { ApolloProvider } from "@apollo/client";
import { LOGIN_MUTATION, LoginPage } from "./login";
import userEvent from "@testing-library/user-event";

const setup = () => {
  const mockApolloClient = createMockClient();

  render(
    <ApolloProvider client={mockApolloClient}>
      <LoginPage />
    </ApolloProvider>
  );

  return {
    mockApolloClient,
  };
};

describe("<LoginPage />", () => {
  let mockClient: MockApolloClient;

  beforeEach(() => {
    const { mockApolloClient } = setup();

    mockClient = mockApolloClient;
  });

  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Uber Eats");
    });
  });

  it("display email validation errors", async () => {
    const email: HTMLInputElement = screen.getByPlaceholderText(/email/i);
    userEvent.type(email, "this@wont");
    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
    userEvent.clear(email);
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  it("display password required errors", async () => {
    const email: HTMLInputElement = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole("button");
    userEvent.type(email, "this@wont.com");
    userEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("submit form and calls mutation", async () => {
    const email: HTMLInputElement = screen.getByPlaceholderText(/email/i);
    const password: HTMLInputElement = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "12345",
    };
    const mockMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "XXX",
          error: "mutation-error",
        },
      },
    });
    mockClient.setRequestHandler(LOGIN_MUTATION, mockMutationResponse);
    jest.spyOn(Storage.prototype, "setItem");

    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutationResponse).toHaveBeenCalledTimes(1);
    });
    await waitFor(() => {
      expect(mockMutationResponse).toHaveBeenCalledWith({
        input: {
          email: formData.email,
          password: formData.password,
        },
      });
    });
    await waitFor(() => {
      expect(screen.getByText(/mutation-error/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith("access-token", "XXX");
    });
  });
});
