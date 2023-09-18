import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { RestaurantsPage } from "../pages/client/restaurants";
import { Header } from "../components/Header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmailPage } from "../pages/user/confirm-email";
import { UpdateProfilePage } from "../pages/user/update-profile";
import { NotFoundPage } from "../pages/404";
import { SearchPage } from "../pages/client/search";
import { CategoryPage } from "../pages/client/category";

const ClientRoutes = [
  <Route key={1} path="/" exact>
    <RestaurantsPage />
  </Route>,
  <Route key={2} path="/confirm">
    <ConfirmEmailPage />
  </Route>,
  <Route key={3} path="/update-profile">
    <UpdateProfilePage />
  </Route>,
  <Route key={4} path="/search">
    <SearchPage />
  </Route>,
  <Route key={5} path="/category/:slug">
    <CategoryPage />
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
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}
