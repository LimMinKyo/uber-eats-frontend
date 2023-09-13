import { gql, useQuery } from "@apollo/client";
import { User } from "../gql/graphql";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { RestaurantsPage } from "../pages/client/restaurants";

const ClientRoutes = [
  <Route path="/" exact>
    <RestaurantsPage />
  </Route>,
];

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
    <Router>
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
    </Router>
  );
}
