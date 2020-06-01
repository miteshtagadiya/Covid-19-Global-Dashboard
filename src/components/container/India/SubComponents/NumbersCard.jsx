import React, { Component } from "react";
import TinyChart from "components/charts/TinyChart";
import Popover from "react-popover";
import ReactGA from "react-ga";

class NumbersCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let confirmedTinyChartData =
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
            return cases.totalconfirmed !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totalconfirmed),
                }
              : null;
          })
        : null;

    let activeTinyChartData =
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
            return cases.totalconfirmed !== ""
              ? {
                  name: cases.date,
                  confirmed:
                    Number(cases.totalconfirmed) -
                    Number(cases.totaldeceased) -
                    Number(cases.totalrecovered),
                }
              : null;
          })
        : null;
    let deathTinyChartData =
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
            return cases.totaldeceased !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totaldeceased),
                }
              : null;
          })
        : null;
    let recoveredTinyChartData =
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
            return cases.totalrecovered !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totalrecovered),
                }
              : null;
          })
        : null;

    const totalConformedToday =
      this.props.india.length !== 0
        ? this.props.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltaconfirmed
        : 0;

    const totalRecoveredToday =
      this.props.india.length !== 0
        ? this.props.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltarecovered
        : 0;

    const totalDeathsToday =
      this.props.india.length !== 0
        ? this.props.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltadeaths
        : 0;

    const confirmedPopover =
      this.props.india.length !== 0
        ? this.props.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltaconfirmed) !== 0)
            .map((state) => {
              return { [state.state]: state.deltaconfirmed };
            })
        : [];

    const recoveredPopover =
      this.props.india.length !== 0
        ? this.props.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltarecovered) !== 0)
            .map((state) => {
              return { [state.state]: Number(state.deltarecovered) };
            })
        : [];
    const deathsPopover =
      this.props.india.length !== 0
        ? this.props.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltadeaths) !== 0)
            .map((state) => {
              return { [state.state]: Number(state.deltadeaths) };
            })
        : [];

    return (
      <div
        className="row numeric-card"
        style={{ padding: "50px 0px 30px 0px" }}
      >
        <div className="col-sm-3 col-6" style={{ padding: 15 }}>
          <div
            className="numeric-card-body"
            style={{
              background: "#448AFF",
            }}
          >
            <div style={{ fontSize: 30 }}>
              {this.props.india.length !== 0
                ? this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].confirmed
                : 0}
            </div>
            <div className="numeric-card-info-icon">
              <span style={{ fontSize: 17, fontWeight: "bold" }}>&#9650;</span>
              {this.props.india.length !== 0
                ? typeof this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltaconfirmed !== "undefined" &&
                  this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltaconfirmed !== null
                  ? this.props.india.statewise.filter(
                      (record) => record.state === "Total"
                    )[0].deltaconfirmed
                  : 0
                : 0}
              {Number(totalConformedToday) !== 0 ? (
                <Popover
                  body={
                    <div
                      style={{
                        maxHeight: 400,
                        overflowY: "scroll",
                        borderRight: 10,
                        background: "white",
                        borderRadius: 10,
                        padding: 15,
                        color: "#192a56",
                        fontWeight: "bold",
                      }}
                    >
                      {confirmedPopover.map((state, index) => {
                        return (
                          <div key={index}>
                            {Object.keys(state)[0]}: {Object.values(state)[0]}
                          </div>
                        );
                      })}
                    </div>
                  }
                  preferPlace={"below"}
                  isOpen={this.state.confirmedOpen}
                  onOuterAction={() =>
                    this.setState({
                      confirmedOpen: !this.state.confirmedOpen,
                    })
                  }
                >
                  <div
                    onClick={() => {
                      ReactGA.event({
                        category: "India Info",
                        action: "Confirmed Info Clicked",
                        label: "Confirm Info",
                      });
                      this.setState({
                        confirmedOpen: !this.state.confirmedOpen,
                      });
                    }}
                    className="report-tile"
                    style={{ marginLeft: 5, cursor: "pointer" }}
                  >
                    ?
                  </div>
                </Popover>
              ) : null}
            </div>
            <div style={{ fontSize: 18 }}>Confirmed</div>
            {this.props.india.length !== 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TinyChart
                  data={confirmedTinyChartData}
                  label="confirmed"
                  color="#ffffff"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-sm-3 col-6" style={{ padding: 15 }}>
          <div
            className="numeric-card-body"
            style={{
              background: "#F9A825",
            }}
          >
            <div style={{ fontSize: 30, marginBottom: 35 }}>
              {this.props.india.length !== 0
                ? this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].active
                : 0}
            </div>

            <div style={{ fontSize: 18 }}>Active</div>
            {this.props.india.length !== 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TinyChart
                  data={activeTinyChartData}
                  label="confirmed"
                  color="#ffffff"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-sm-3 col-6" style={{ padding: 15 }}>
          <div
            className="numeric-card-body"
            style={{
              background: "#4CAF50",
            }}
          >
            <div style={{ fontSize: 30 }}>
              {this.props.india.length !== 0
                ? this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].recovered
                : 0}
            </div>
            <div className="numeric-card-info-icon">
              <span style={{ fontSize: 17, fontWeight: "bold" }}>&#9650;</span>
              {this.props.india.length !== 0
                ? typeof this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltarecovered !== "undefined" &&
                  this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltarecovered !== null
                  ? this.props.india.statewise.filter(
                      (record) => record.state === "Total"
                    )[0].deltarecovered
                  : 0
                : 0}
              {Number(totalRecoveredToday) !== 0 ? (
                <Popover
                  body={
                    <div
                      style={{
                        background: "white",
                        borderRadius: 10,
                        padding: 15,
                        color: "#192a56",
                        fontWeight: "bold",
                      }}
                    >
                      {recoveredPopover.map((state, index) => {
                        return (
                          <div key={index}>
                            {Object.keys(state)[0]}: {Object.values(state)[0]}
                          </div>
                        );
                      })}
                    </div>
                  }
                  preferPlace={"below"}
                  isOpen={this.state.activeOpen}
                  onOuterAction={() =>
                    this.setState({
                      activeOpen: !this.state.activeOpen,
                    })
                  }
                >
                  <div
                    onClick={() => {
                      ReactGA.event({
                        category: "India Info",
                        action: "Active Info Clicked",
                        label: "Active Info",
                      });
                      this.setState({
                        activeOpen: !this.state.activeOpen,
                      });
                    }}
                    className="report-tile"
                    style={{ marginLeft: 5, cursor: "pointer" }}
                  >
                    ?
                  </div>
                </Popover>
              ) : null}
            </div>
            <div style={{ fontSize: 18 }}>Recovered</div>
            {this.props.india.length !== 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TinyChart
                  data={recoveredTinyChartData}
                  label="confirmed"
                  color="#ffffff"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="col-sm-3 col-6" style={{ padding: 15 }}>
          <div
            className="numeric-card-body"
            style={{
              background: "#FF5252",
            }}
          >
            <div style={{ fontSize: 30 }}>
              {this.props.india.length !== 0
                ? this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deaths
                : 0}
            </div>
            <div className="numeric-card-info-icon">
              <span style={{ fontSize: 17, fontWeight: "bold" }}>&#9650;</span>
              {this.props.india.length !== 0
                ? typeof this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltadeaths !== "undefined" &&
                  this.props.india.statewise.filter(
                    (record) => record.state === "Total"
                  )[0].deltadeaths !== null
                  ? this.props.india.statewise.filter(
                      (record) => record.state === "Total"
                    )[0].deltadeaths
                  : 0
                : 0}
              {Number(totalDeathsToday) !== 0 ? (
                <Popover
                  body={
                    <div
                      style={{
                        background: "white",
                        borderRadius: 10,
                        padding: 15,
                        color: "#192a56",
                        fontWeight: "bold",
                      }}
                    >
                      {deathsPopover.map((state, index) => {
                        return (
                          <div key={index}>
                            {Object.keys(state)[0]}: {Object.values(state)[0]}
                          </div>
                        );
                      })}
                    </div>
                  }
                  preferPlace={"below"}
                  isOpen={this.state.deathsOpen}
                  onOuterAction={() =>
                    this.setState({
                      deathsOpen: !this.state.deathsOpen,
                    })
                  }
                >
                  <div
                    onClick={() => {
                      ReactGA.event({
                        category: "India Info",
                        action: "Deaths Info Clicked",
                        label: "Deaths Info",
                      });
                      this.setState({
                        deathsOpen: !this.state.deathsOpen,
                      });
                    }}
                    className="report-tile"
                    style={{ marginLeft: 5, cursor: "pointer" }}
                  >
                    ?
                  </div>
                </Popover>
              ) : null}
            </div>
            <div style={{ fontSize: 18 }}>Deaths</div>
            {this.props.india.length !== 0 ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <TinyChart
                  data={deathTinyChartData}
                  label="confirmed"
                  color="#ffffff"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default NumbersCard;
