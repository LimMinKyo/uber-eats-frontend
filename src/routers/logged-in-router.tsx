import { gql, useQuery } from "@apollo/client";
import { User } from "../gql/graphql";

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export default function LoggedInRouter() {
  const { data, loading, error } = useQuery<{ me: User }>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <div>
      <h1>{data.me.email}</h1>
    </div>
  );
}
