import { ApolloClient, InMemoryCache, makeVar } from "@apollo/client";
import { ACCESS_TOKEN } from "./constants";

const accessToken = localStorage.getItem(ACCESS_TOKEN);
export const isLoggedInVar = makeVar(Boolean(accessToken));
export const accessTokenVar = makeVar(accessToken);

export const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
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
