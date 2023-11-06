import { gql, useApolloClient, useQuery } from "@apollo/client";
import { User } from "../gql/graphql";
import { accessTokenVar, isLoggedInVar } from "../apollo";
import { ACCESS_TOKEN } from "../constants";
import { useHistory } from "react-router-dom";

export const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const useMe = () => {
  const history = useHistory();
  const client = useApolloClient();

  const onError = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    accessTokenVar(null);
    isLoggedInVar(false);
    client.clearStore();
    history.replace("/");
  };

  return useQuery<{ me: User }>(ME_QUERY, { onError });
};
