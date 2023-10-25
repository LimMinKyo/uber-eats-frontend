import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ACCESS_TOKEN } from "./constants";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { REST_API_URL, WS_API_URL } from "./env";

const accessToken = localStorage.getItem(ACCESS_TOKEN);
export const isLoggedInVar = makeVar(Boolean(accessToken));
export const accessTokenVar = makeVar(accessToken);

const wsLink = new WebSocketLink({
  uri: WS_API_URL,
  options: {
    reconnect: true,
    connectionParams: {
      "x-jwt": accessTokenVar() || "",
    },
  },
});

const httpLink = createHttpLink({
  uri: REST_API_URL,
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "x-jwt": accessTokenVar() || "",
  },
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          isLoggedIn: {
            read() {
              return isLoggedInVar();
            },
          },
          accessToken: {
            read() {
              return accessTokenVar();
            },
          },
        },
      },
    },
  }),
});
