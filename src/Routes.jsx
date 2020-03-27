import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import India from "./India";
import App from "./App";

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
