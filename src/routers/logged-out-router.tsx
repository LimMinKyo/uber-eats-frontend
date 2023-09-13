import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { CreateAccountPage } from "../pages/create-account";
import { LoginPage } from "../pages/login";
import { NotFoundPage } from "../pages/404";

export default function LoggedOutRouter() {
  return (
    <Router>
      <Switch>
        <Route path="/create-account">
          <CreateAccountPage />
        </Route>
        <Route path="/" exact>
          <LoginPage />
        </Route>
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}
