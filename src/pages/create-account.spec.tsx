import { ApolloProvider } from "@apollo/client";
import { MockApolloClient, createMockClient } from "mock-apollo-client";
import { CREATE_ACCOUNT_MUTATION, CreateAccountPage } from "./create-account";
import { render, screen, waitFor } from "../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../gql/graphql";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const actualModule = jest.requireActual("react-router-dom");
  return {
    ...actualModule,
    useHistory() {
      return {
        push: mockPush,
      };
    },
  };
});

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

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Create Account | Uber Eats");
    });
  });

  it("renders validation errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole("button");

    userEvent.type(email, "wont@work");

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });

    userEvent.clear(email);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    userEvent.type(email, "working@email.com");
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("submits mutation with form values", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button");
    const formData = {
      email: "working@gmail.com",
      password: "12345",
      role: UserRole.Client,
    };
    const mockCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: null,
        },
      },
    });
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockCreateAccountMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);

    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(button);

    await waitFor(() => {
      expect(mockCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockCreateAccountMutationResponse).toHaveBeenCalledWith({
      input: {
        ...formData,
      },
    });
    expect(window.alert).toHaveBeenCalledTimes(1);
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("get mutation error if it faild mutation", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByRole("button");
    const formData = {
      email: "working@gmail.com",
      password: "12345",
      role: UserRole.Client,
    };
    const mockCreateAccountMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: false,
          error: "mutation-error",
        },
      },
    });
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockCreateAccountMutationResponse
    );

    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(button);

    await waitFor(() => {
      expect(mockCreateAccountMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockCreateAccountMutationResponse).toHaveBeenCalledWith({
      input: {
        ...formData,
      },
    });
    expect(screen.getByText("mutation-error")).toBeInTheDocument();
  });
});
