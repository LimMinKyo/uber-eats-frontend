import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { RestaurantsPage } from "../pages/client/restaurants";
import { Header } from "../components/Header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmailPage } from "../pages/user/confirm-email";
import { UpdateProfilePage } from "../pages/user/update-profile";

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <RestaurantsPage />
  </Route>,
  <Route key={2} path="/confirm" exact>
    <ConfirmEmailPage />
  </Route>,
  <Route key={3} path="/update-profile" exact>
    <UpdateProfilePage />
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
