import React from "react";
import ReactGA from "react-ga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import windowSize from "react-window-size";

import "./NavigationBar.sass";

const NavigationBar = (props) => {
  const icons = {
    Analytics: "chart-area",
    Card: "tablet-alt",
    Map: "globe",
    Table: "table",
    Chart: "chart-bar",
  };
  let uiClass = "nav-item nav-link";

  return props.windowWidth > 900 ? (
    <nav>
      <div className="nav nav-tabs nav-fill">
        {props.options.map((option, index) => {
          return (
            <label
              key={index}
              className={
                props.ui === props.optionRoutes[index]
                  ? uiClass + " active"
                  : uiClass
              }
              onClick={() => {
                props.onClick(props.optionRoutes[index]);
                ReactGA.event({
                  category: props.type,
                  action: option + " selected",
                  label: props.type + " " + option,
                });
              }}
            >
              <FontAwesomeIcon
                icon={["fas", icons[option]]}
                className="navbar-icon"
              />
              {option}
            </label>
          );
        })}
      </div>
    </nav>
  ) : (
    <nav>
      <div className="nav nav-tabs nav-fill">
        {props.options.map((option, index) => {
          return (
            <label
              key={index}
              className={
                props.ui === props.optionRoutes[index]
                  ? uiClass + " active"
                  : uiClass
              }
              onClick={() => {
                props.onClick(props.optionRoutes[index]);
                ReactGA.event({
                  category: props.type,
                  action: option + " selected",
                  label: props.type + " " + option,
                });
              }}
            >
              <FontAwesomeIcon
                icon={["fas", icons[option]]}
                className="navbar-icon"
              />
            </label>
          );
        })}
      </div>
    </nav>
  );
};

export default windowSize(NavigationBar);
