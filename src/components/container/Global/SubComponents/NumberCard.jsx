import React, { Component } from "react";
import NumericCard from "components/ui/NumericCard/NumericCard";

class NumberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <NumericCard
        type="Global"
        className="col-sm-3 col-6"
        data={[
          {
            Confirmed:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].confirmed
                : 0,
          },
          {
            Active:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].active
                : 0,
          },
          {
            Recovered:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].recovered
                : 0,
          },
          {
            Deaths:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].deaths
                : 0,
          },
        ]}
        showPopover={[
          {
            Confirmed:
              this.props.globalData.length !== 0 &&
              Number(
                this.props.globalData.filter(
                  (state) => state.title === "World"
                )[0].confirmed_today
              ) !== 0
                ? true
                : false,
          },
          {
            Deaths:
              this.props.globalData.length !== 0 &&
              Number(
                this.props.globalData.filter(
                  (state) => state.title === "World"
                )[0].deaths_today
              ) !== 0
                ? true
                : false,
          },
        ]}
        dataToday={[
          {
            Confirmed:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].confirmed_today
                : 0,
          },
          {
            Deaths:
              this.props.globalData.length !== 0
                ? this.props.globalData.filter(
                    (state) => state.title === "World"
                  )[0].deaths_today
                : 0,
          },
        ]}
        popoverData={[
          {
            Confirmed: this.props.globalData
              .filter(
                (state) =>
                  state.title !== "World" && state.confirmed_today !== ""
              )
              .map((state, index) => {
                return (
                  <div key={index}>
                    {state.title}: {state.confirmed_today}
                  </div>
                );
              }),
          },
          {
            Deaths: this.props.globalData
              .filter(
                (state) => state.title !== "World" && state.deaths_today !== ""
              )
              .map((state, index) => {
                return (
                  <div key={index}>
                    {state.title}: {state.deaths_today}
                  </div>
                );
              }),
          },
        ]}
      />
    );
  }
}

export default NumberCard;
