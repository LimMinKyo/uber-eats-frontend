import { gql, useQuery } from "@apollo/client";
import { User } from "../gql/graphql";

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
  return useQuery<{ me: User }>(ME_QUERY);
};
