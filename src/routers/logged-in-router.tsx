import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { RestaurantsPage } from "../pages/client/restaurants";
import { Header } from "../components/Header";
import { useMe } from "../hooks/useMe";

const ClientRoutes = [
  <Route path="/" exact>
    <RestaurantsPage />
  </Route>,
];

export default function LoggedInRouter() {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Switch>{data.me.role === "Client" && ClientRoutes}</Switch>
    </Router>
  );
}
