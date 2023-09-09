import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  makeVar,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ACCESS_TOKEN } from "./constants";

const accessToken = localStorage.getItem(ACCESS_TOKEN);
export const isLoggedInVar = makeVar(Boolean(accessToken));
export const accessTokenVar = makeVar(accessToken);

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    "x-jwt": accessTokenVar() || "",
  },
}));

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
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
