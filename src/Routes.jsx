import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import India from "./India";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import App from "./App";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import brands from "@fortawesome/fontawesome-free-brands";
library.add(fas, brands);
const history = createBrowserHistory();

ReactGA.initialize("UA-162840601-1", { debug: true });
ReactGA.set({ page: window.location.pathname + window.location.hash }); // Update the user's current page
ReactGA.pageview(window.location.pathname + window.location.hash);

history.listen((location) => {
  ReactGA.set({ page: location.pathname + location.hash }); // Update the user's current page
  ReactGA.pageview(location.pathname + location.hash); // Record a pageview for the given page
});

export class Index extends Component {
  render() {
    return (
      <div>
        <React.Fragment>
          <Switch>
            <Route path="/india" component={India} />
            <Route path="/" component={App} />
          </Switch>
        </React.Fragment>
      </div>
    );
  }
}

export default withRouter(Index);
