import { useMemo } from "preact/hooks";
import { Router } from "@nano-router/preact";
import { createBrowserHistory } from "@nano-router/history";
import { RootRoute } from "./RootRoute";
import { routes } from "./routes";

export const App = () => {
  const history = useMemo(() => createBrowserHistory(), []);

  return (
    <Router history={history} routes={routes}>
      <RootRoute />
    </Router>
  );
};
