import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { HashRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import * as serviceWorker from "./serviceWorker";
import ErrorBoundry from "components/ui/ErrorBoundry/ErrorBoundry";
import { Index } from "./Routes";

const routing = (
  <HashRouter>
    <ErrorBoundry>
      <Index />
    </ErrorBoundry>
  </HashRouter>
);

ReactDOM.render(routing, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
