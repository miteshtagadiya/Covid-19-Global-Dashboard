import React from "react";
import "./SwitchBar.sass";

const SwitchBar = (props) => {
  return (
    <div className="SwitchBar">
      {props.options.map((option, index) => {
        return (
          <div
            key={index}
            className={
              props.showGlobalChartType === props.optionValues[index]
                ? "switch-active"
                : "switch"
            }
            style={
              index === 0
                ? {
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                  }
                : index === props.options.length - 1
                ? {
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  }
                : {}
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

export default SwitchBar;
