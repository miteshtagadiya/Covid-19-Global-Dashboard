import React from "react";
import "./MapSwitchBar.sass";

const MapSwitchBar = (props) => {
  return (
    <div className="MapSwitchBar">
      {props.options.map((option, index) => {
        return (
          <div
            key={index}
            className={
              props.mapFilter === props.optionValues[index]
                ? "mapswitch-active"
                : "mapswitch"
            }
            style={
              props.mapFilter === props.optionValues[index]
                ? {
                    background: props.colors[index],
                    color: "white",
                  }
                : {
                    border: "2px solid " + props.colors[index],
                    color: props.colors[index],
                  }
            }
            onClick={() => props.onClick(props.optionValues[index])}
          >
            {option}
          </div>
        );
      })}
    </div>
  );
};

export default MapSwitchBar;
