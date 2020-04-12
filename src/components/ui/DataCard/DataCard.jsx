import React from "react";
import "./DataCard.sass";

const colors = {
  Confirmed: "#e43339",
  Deaths: "#404b69",
};

const DataCard = (props) => {
  return (
    <div key={props.index} className="col-sm-4 DataCard">
      <div className="data-card">
        <label className="data-card-title">{props.title}</label>
        <br />
        <div className="row justify-content-center">
          {props.data.map((data, index) => {
            let showIcon = props.showIcon.filter(
              (content) => Object.keys(content)[0] === Object.keys(data)[0]
            );
            let showData = props.dataToday.filter(
              (content) => Object.keys(content)[0] === Object.keys(data)[0]
            );

            return (
              <div className="data-card-label">
                <div>
                  {Object.values(data)}
                  {showIcon.length !== 0 && showIcon[0] ? (
                    <span
                      className="data-card-span-label"
                      style={{
                        color: colors[Object.keys(data)],
                      }}
                    >
                      {"  "}
                      <span className="data-card-span-value">&#9650;</span>
                      {showIcon.length !== 0 && showIcon[0]
                        ? Object.values(showData[0])[0]
                        : null}
                    </span>
                  ) : null}
                </div>
                <div>{Object.keys(data)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
