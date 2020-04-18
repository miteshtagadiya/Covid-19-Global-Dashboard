import React from "react";
import "./GradientCardTitle.sass";

const GradientCardTitle = (props) => {
  return (
    <div style={props.style ? props.style : {}} className="GradientCardTitle">
      {props.title}
    </div>
  );
};

export default GradientCardTitle;
