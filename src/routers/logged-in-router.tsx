import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Header } from "../components/Header";
import { useMe } from "../hooks/useMe";
import { NotFoundPage } from "../pages/404";
import { commonRoutes } from "./routes/common";
import { clientRoutes } from "./routes/client";
import { ownerRoutes } from "./routes/owner";
import { UserRole } from "../gql/graphql";
import { driverRoutes } from "./routes/driver";

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
        {commonRoutes.map(({ path, component }) => (
          <Route exact key={path} path={path}>
            {component}
          </Route>
        ))}
        {data.me.role === UserRole.Client &&
          clientRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map(({ path, component }) => (
            <Route exact key={path} path={path}>
              {component}
            </Route>
          ))}
        <Route>
          <NotFoundPage />
        </Route>
      </Switch>
    </Router>
  );
}
