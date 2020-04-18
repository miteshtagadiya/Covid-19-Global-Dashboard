import React, { Component } from "react";
import "./App.css";
import ReactTable from "react-table-6";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import "react-table-6/react-table.css";
import Github from "assets/github1.png";
import TinyChart from "components/charts/TinyChart";
import IndiaIcon from "assets/india.png";
import World from "assets/world.png";
import { withRouter } from "react-router-dom";
import Virus from "assets/virus.gif";
import Popover from "react-popover";
import ErrorBoundary from "components/ui/ErrorBoundry/ErrorBoundry";
import Select from "react-select";
import ReactGA from "react-ga";
import CustomChart from "components/charts/PieChart/CustomChart";
import IndiaMap from "components/charts/IndiaMap/IndiaMap";

class India extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      currentPage: 0,
      width: 0,
      height: 0,
      selectedCity: "",
      confirmedOpen: false,
      activeOpen: false,
      filterByCases: "confirmed",
      changeChart: "cumulative",
      displayBySort: "All",
      deathsOpen: false,
      totalPages: 0,
      activePage: 0,
      selectedCountry: false,
      locationLoader: false,
      data: [],
      stateWiseCity: [],
      india: [],
      timelines: [],
      labels: ["January", "February", "March", "April", "May"],
      isTable: 0,
      datasets: [
        {
          label: "Rainfall",
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: [65, 59, 80, 81, 56],
          data1: [65, 59, 80, 81, 56],
          data2: [65, 59, 80, 81, 56],
          data3: [65, 59, 80, 81, 56],
        },
      ],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    window.addEventListener("focus", () => {
      fetch(`https://api.covid19india.org/data.json`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            india: response,
            locationLoader: false,
          });
        })
        .catch((error) => {
          this.setState({
            locationLoader: false,
          });
        });
      fetch("https://api.covid19india.org/state_district_wise.json", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            stateWiseCity: response,
          });
        })
        .catch((error) => {});
    });

    this.setState({
      locationLoader: true,
    });
    fetch(`https://api.covid19india.org/data.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          india: response,
          locationLoader: false,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });

    fetch("https://api.covid19india.org/state_district_wise.json", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          stateWiseCity: response,
        });
      })
      .catch((error) => {});
  }

  chunkArray = (array, size) => {
    let result = [];
    let arrayCopy = [...array];
    while (arrayCopy.length > 0) {
      result.push(arrayCopy.splice(0, size));
    }
    return result;
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    let confirmedTinyChartData =
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
            return cases.totalconfirmed !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totalconfirmed),
                }
              : null;
          })
        : null;

    let activeTinyChartData =
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
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
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
            return cases.totaldeceased !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totaldeceased),
                }
              : null;
          })
        : null;
    let recoveredTinyChartData =
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
            return cases.totalrecovered !== ""
              ? {
                  name: cases.date,
                  confirmed: Number(cases.totalrecovered),
                }
              : null;
          })
        : null;

    let totalDataDaily =
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
            return cases.dailyrecovered !== ""
              ? {
                  name: cases.date,
                  Confirmed: Number(cases.dailyconfirmed),
                  Active:
                    Number(cases.dailyconfirmed) -
                    Number(cases.dailyrecovered) -
                    Number(cases.dailydeceased),
                  Recovered: Number(cases.dailyrecovered),
                  Deaths: Number(cases.dailydeceased),
                }
              : null;
          })
        : null;

    let totalData =
      this.state.india.length !== 0
        ? this.state.india.cases_time_series.map((cases) => {
            return cases.totalrecovered !== ""
              ? {
                  name: cases.date,
                  Confirmed: Number(cases.totalconfirmed),
                  Active:
                    Number(cases.totalconfirmed) -
                    Number(cases.totalrecovered) -
                    Number(cases.totaldeceased),
                  Recovered: Number(cases.totalrecovered),
                  Deaths: Number(cases.totaldeceased),
                  dailyConfirmed: Number(cases.dailyconfirmed),
                  dailyActive:
                    Number(cases.dailyconfirmed) -
                    Number(cases.dailyrecovered) -
                    Number(cases.dailydeceased),
                  dailyRecovered: Number(cases.dailyrecovered),
                  dailyDeaths: Number(cases.dailydeceased),
                }
              : null;
          })
        : null;

    const data =
      this.state.india.length !== 0
        ? this.state.india.statewise
            .filter((state) => state.state !== "Total")
            .map((state) => {
              return {
                state: state.state,
                confirmed: Number(state.confirmed),
                active: Number(state.active),
                recovered: Number(state.recovered),
                deaths: Number(state.deaths),
                deltaConfirmed: Number(state.deltaconfirmed),
                deltaActive: Number(
                  state.deltaconfirmed -
                    state.deltarecovered -
                    state.deltadeaths
                ),
                deltaRecovered: Number(state.deltarecovered),
                deltaDeaths: Number(state.deltadeaths),
              };
            })
        : [];

    const columns =
      this.state.india.length !== 0
        ? [
            {
              Header: "State/UT",
              accessor: "state", // String-based value accessors!
            },
            {
              Header: "Confirmed",
              accessor: "confirmed",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaConfirmed === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#e43339",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaConfirmed}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Active",
              accessor: "active",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaActive === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#192a56",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaActive}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Recovered",
              accessor: "recovered",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaRecovered === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#006266",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaRecovered}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Deaths",
              accessor: "deaths",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaDeaths === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#535c68",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaDeaths}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
          ]
        : [];

    const cityData =
      this.state.stateWiseCity.length !== 0
        ? Object.keys(this.state.stateWiseCity).map((city) => {
            return {
              [city]: Object.keys(
                this.state.stateWiseCity[city].districtData
              ).map((key) => {
                return {
                  city: key,
                  confirmed: this.state.stateWiseCity[city].districtData[key]
                    .confirmed,
                  active: this.state.stateWiseCity[city].districtData[key]
                    .active,
                  recovered: this.state.stateWiseCity[city].districtData[key]
                    .recovered,
                  deaths: this.state.stateWiseCity[city].districtData[key]
                    .deaths,
                };
              }),
            };
          })
        : [];

    const cityColumns =
      this.state.india.length !== 0
        ? [
            {
              Header: "District",
              accessor: "city", // String-based value accessors!
            },
            {
              Header: "Confirmed",
              accessor: "confirmed",
            },
            {
              Header: "Active",
              accessor: "active",
            },
            {
              Header: "Recovered",
              accessor: "recovered",
            },
            {
              Header: "Deaths",
              accessor: "deaths",
            },
          ]
        : [];

    const totalConformedToday =
      this.state.india.length !== 0
        ? this.state.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltaconfirmed
        : 0;

    const totalRecoveredToday =
      this.state.india.length !== 0
        ? this.state.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltarecovered
        : 0;

    const totalDeathsToday =
      this.state.india.length !== 0
        ? this.state.india.statewise.filter(
            (record) => record.state === "Total"
          )[0].deltadeaths
        : 0;

    const confirmedPopover =
      this.state.india.length !== 0
        ? this.state.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltaconfirmed) !== 0)
            .map((state) => {
              return { [state.state]: state.deltaconfirmed };
            })
        : [];

    const recoveredPopover =
      this.state.india.length !== 0
        ? this.state.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltarecovered) !== 0)
            .map((state) => {
              return { [state.state]: Number(state.deltarecovered) };
            })
        : [];
    const deathsPopover =
      this.state.india.length !== 0
        ? this.state.india.statewise
            .filter((record) => record.state !== "Total")
            .filter((state) => Number(state.deltadeaths) !== 0)
            .map((state) => {
              return { [state.state]: Number(state.deltadeaths) };
            })
        : [];

    var sortable =
      this.state.india.length !== 0 ? this.state.india.statewise : [];

    const Comparator = (a, b) => {
      if (Number(a[1]) > Number(b[1])) return -1;
      if (Number(a[1]) < Number(b[1])) return 1;
      return 0;
    };

    var pieChartData =
      this.state.india.length !== 0
        ? sortable
            .filter((record) => record.state !== "Total")
            .map((state) => {
              return [state.state, Number(state[this.state.filterByCases])];
            })
        : [];

    if (this.state.displayBySort !== "All") {
      pieChartData = pieChartData.sort(Comparator).slice(0, 10);
    }

    let Columns = [
      { type: "string", label: "name" },
      { type: "number", label: "value" },
    ];

    const colourStyles = {
      control: (styles) => ({
        ...styles,
        backgroundColor: "white",
        marginRight: 15,
        marginBottom: 15,
      }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? "#404b69"
            : isFocused
            ? "#ffffff"
            : null,
          color: isDisabled ? "#ccc" : isSelected ? "white" : "#404b69",
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            backgroundColor: !isDisabled && (isSelected ? "#404b69" : "white"),
          },
        };
      },
    };

    return (
      <ErrorBoundary>
        <div
          className="App"
          style={{
            background: "#172852",
            color: "white",
            height: "100vh",
            overflowY: "scroll",
          }}
        >
          <div className="container">
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "2.1em",
                  fontWeight: "bold",
                  marginTop: 30,
                  paddingBottom: 30,
                  borderBottom: "2px solid white",
                }}
              >
                Covid-19 India {this.state.width < 1024 ? "" : "Dashboard"}
                <img
                  onClick={() =>
                    window.open(
                      "https://github.com/miteshtagadiya/Covid-19-Global-Dashboard",
                      "_blank"
                    )
                  }
                  src={Github}
                  alt="github"
                  style={{ height: 50, width: 50, cursor: "pointer" }}
                />
              </div>
              <div style={{ padding: 15 }}>
                <img
                  onClick={() => {
                    this.props.history.push("/india");
                  }}
                  src={IndiaIcon}
                  alt="India"
                  style={{ height: 50, width: 70, cursor: "pointer" }}
                />
                <span style={{ fontWeight: "bold" }}>Switch</span>
                <img
                  onClick={() => this.props.history.push("/")}
                  src={World}
                  alt="World"
                  style={{
                    marginLeft: 15,
                    height: 50,
                    width: 50,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
            <div style={{ minHeight: "90vh" }}>
              <div className="row" style={{ padding: "10px 0px 30px 0px" }}>
                <div className="col-sm-3 col-6" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      background: "#448AFF",
                      color: "white",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30 }}>
                      {this.state.india.length !== 0
                        ? this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].confirmed
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 17, fontWeight: "bold" }}>
                        &#9650;
                      </span>
                      {this.state.india.length !== 0
                        ? typeof this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltaconfirmed !== "undefined" &&
                          this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltaconfirmed !== null
                          ? this.state.india.statewise.filter(
                              (record) => record.state === "Total"
                            )[0].deltaconfirmed
                          : 0
                        : 0}
                      {Number(totalConformedToday) !== 0 ? (
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
                              {confirmedPopover.map((state, index) => {
                                return (
                                  <div key={index}>
                                    {Object.keys(state)[0]}:{" "}
                                    {Object.values(state)[0]}
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
                    {this.state.india.length !== 0 ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      background: "#F9A825",
                      color: "#ffffff",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30, marginBottom: 35 }}>
                      {this.state.india.length !== 0
                        ? this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].active
                        : 0}
                    </div>

                    <div style={{ fontSize: 18 }}>Active</div>
                    {this.state.india.length !== 0 ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      background: "#4CAF50",
                      color: "#ffffff",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30 }}>
                      {this.state.india.length !== 0
                        ? this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].recovered
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 17, fontWeight: "bold" }}>
                        &#9650;
                      </span>
                      {this.state.india.length !== 0
                        ? typeof this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltarecovered !== "undefined" &&
                          this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltarecovered !== null
                          ? this.state.india.statewise.filter(
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
                                    {Object.keys(state)[0]}:{" "}
                                    {Object.values(state)[0]}
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
                    {this.state.india.length !== 0 ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      background: "#FF5252",
                      color: "#ffffff",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30 }}>
                      {this.state.india.length !== 0
                        ? this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deaths
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 17, fontWeight: "bold" }}>
                        &#9650;
                      </span>
                      {this.state.india.length !== 0
                        ? typeof this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltadeaths !== "undefined" &&
                          this.state.india.statewise.filter(
                            (record) => record.state === "Total"
                          )[0].deltadeaths !== null
                          ? this.state.india.statewise.filter(
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
                                    {Object.keys(state)[0]}:{" "}
                                    {Object.values(state)[0]}
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
                    {this.state.india.length !== 0 ? (
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
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
              <div className="row">
                <div className="col-sm-6 col-12">
                  <div
                    style={{
                      background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
                      paddingBottom: 15,
                      minHeight: 368,
                      paddingLeft: 15,
                      paddingTop: 30,
                      borderRadius: 15,
                      marginBottom: 15,
                    }}
                  >
                    <div className="row" style={{ justifyContent: "center" }}>
                      <div
                        onClick={() => {
                          ReactGA.event({
                            category: "India Line Chart",
                            action: "Cumulative Button Clicked",
                            label: "Cumulative",
                          });
                          this.setState({
                            changeChart: "cumulative",
                          });
                        }}
                        style={
                          this.state.changeChart === "cumulative"
                            ? {
                                padding: "5px 15px 5px 15px",
                                color: "white",
                                background: "#404b69",
                                border: "2px solid #404b69",
                                borderRadius: 5,
                                cursor: "pointer",
                              }
                            : {
                                padding: "5px 15px 5px 15px",
                                color: "#404b69",
                                background: "white",
                                border: "2px solid #404b69",
                                borderRadius: 5,
                                cursor: "pointer",
                              }
                        }
                      >
                        <label
                          style={{
                            marginBottom: 0,
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Cumulative
                        </label>
                      </div>
                      <div
                        onClick={() => {
                          ReactGA.event({
                            category: "India Line Chart",
                            action: "Daily Button Clicked",
                            label: "Daily",
                          });
                          this.setState({
                            changeChart: "daily",
                          });
                        }}
                        style={
                          this.state.changeChart === "daily"
                            ? {
                                padding: "5px 15px 5px 15px",
                                color: "white",
                                background: "#404b69",
                                border: "2px solid #404b69",
                                borderRadius: 5,
                                marginLeft: 15,
                                cursor: "pointer",
                              }
                            : {
                                padding: "5px 15px 5px 15px",
                                color: "#404b69",
                                background: "white",
                                border: "2px solid #404b69",
                                borderRadius: 5,
                                marginLeft: 15,
                                cursor: "pointer",
                              }
                        }
                      >
                        <label
                          style={{
                            marginBottom: 0,
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                        >
                          Daily
                        </label>
                      </div>
                    </div>
                    <SimpleLineChart
                      customTooltip={true}
                      grid={false}
                      data={
                        this.state.changeChart === "daily"
                          ? totalDataDaily
                          : totalData
                      }
                      labels={["Confirmed", "Active", "Recovered", "Deaths"]}
                      colors={["#e43339", "#192a56", "#006266", "#535c68"]}
                    />
                  </div>
                </div>
                <div className="col-sm-6 col-12">
                  <div
                    style={{
                      minHeight: 368,
                      background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
                      paddingBottom: 15,
                      paddingLeft: 15,
                      paddingTop: 30,
                      borderRadius: 15,
                      marginBottom: 15,
                    }}
                  >
                    <div className="row" style={{ justifyContent: "center" }}>
                      <div className="col-sm-4">
                        <Select
                          isClearable={false}
                          isSearchable={false}
                          onChange={(selectedOption) => {
                            this.setState({
                              filterByCases:
                                selectedOption === null
                                  ? "confirmed"
                                  : selectedOption.value,
                            });
                          }}
                          styles={colourStyles}
                          placeholder="Confirmed"
                          options={[
                            { value: "confirmed", label: "Confirmed" },
                            { value: "active", label: "Active" },
                            { value: "deaths", label: "Deaths" },
                            { value: "recovered", label: "Recovered" },
                          ]}
                        />
                      </div>
                      <div className="col-sm-4">
                        <Select
                          isClearable={false}
                          onChange={(selectedOption) => {
                            this.setState({
                              displayBySort:
                                selectedOption === null
                                  ? "All"
                                  : selectedOption.value,
                            });
                          }}
                          isSearchable={false}
                          styles={colourStyles}
                          placeholder="All"
                          options={[
                            { value: "All", label: "All" },
                            {
                              value: "Top 10",
                              label: "Top 10",
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <CustomChart
                      placeholder={false}
                      emptyClassName={"m-t-40"}
                      chartArea={{ left: 10, top: 15, right: 10, bottom: 15 }}
                      rows={pieChartData}
                      columns={Columns}
                      chartType={"PieChart"}
                      height={"270px"}
                    />
                  </div>
                </div>
              </div>
              {this.state.isTable === 1 ? null : this.state.locationLoader ===
                true ? (
                <div>
                  <img src={Virus} alt="Loader" />
                </div>
              ) : (
                <div style={{ paddingTop: 5 }}>
                  <input
                    type="text"
                    placeholder="Search"
                    onChange={(e) =>
                      this.setState({
                        searchString: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div
                style={{
                  textAlign: "right",
                  padding: "15px 0px",
                  marginTop: 15,
                }}
              >
                <span
                  onClick={() => {
                    ReactGA.event({
                      category: "India View",
                      action: "Table View Clicked",
                      label: "Table View",
                    });
                    this.setState({
                      isTable: 1,
                    });
                  }}
                  style={
                    this.state.isTable === 1
                      ? {
                          background: "#404b69",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "20px 0px 0px 20px",
                        }
                      : {
                          background: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "#404b69",
                          padding: "10px 20px",
                          borderRadius: "20px 0px 0px 20px",
                        }
                  }
                >
                  Table
                </span>
                <span
                  onClick={() => {
                    ReactGA.event({
                      category: "India View",
                      action: "Map View Clicked",
                      label: "Map View",
                    });
                    this.setState({ isTable: 2, selectedCountry: false });
                  }}
                  style={
                    this.state.isTable === 2
                      ? {
                          background: "#404b69",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "white",
                          padding: "10px 20px",
                        }
                      : {
                          background: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "#404b69",
                          padding: "10px 20px",
                        }
                  }
                >
                  Map
                </span>
                <span
                  onClick={() => {
                    ReactGA.event({
                      category: "India View",
                      action: "Card View Clicked",
                      label: "Card View",
                    });
                    this.setState({ isTable: 0, selectedCountry: false });
                  }}
                  style={
                    this.state.isTable === 0
                      ? {
                          background: "#404b69",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "white",
                          padding: "10px 20px",
                          borderRadius: "0px 20px 20px 0px",
                        }
                      : {
                          background: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "#404b69",
                          padding: "10px 20px",
                          borderRadius: "0px 20px 20px 0px",
                        }
                  }
                >
                  Card
                </span>
              </div>
              {this.state.isTable === 2 ? (
                <div
                  className="row"
                  style={{
                    border: "2px solid rgb(255, 252, 220)",
                    marginRight: 0,
                    marginTop: 15,
                    marginLeft: 0,
                    borderRadius: 10,
                  }}
                >
                  <div
                    className="col-sm-12"
                    style={{ marginTop: 60, marginBottom: 80 }}
                  >
                    <IndiaMap
                      data={
                        this.state.india.length !== 0
                          ? this.state.india.statewise.filter(
                              (state) => state.state !== "Total"
                            )
                          : []
                      }
                    />
                  </div>
                </div>
              ) : null}
              {this.state.isTable === 0 ? (
                <div className="row">
                  {this.state.locationLoader === true ? (
                    <div>
                      <img src={Virus} alt="Loader" />
                    </div>
                  ) : this.state.india.length !== 0 ? (
                    this.state.india.statewise
                      .filter((location) =>
                        location.state
                          .toLowerCase()
                          .includes(this.state.searchString.toLowerCase())
                      )
                      .map((location, index) => {
                        return location.state !== "Total" ? (
                          <div
                            key={index}
                            className="col-sm-4"
                            style={{ padding: 15 }}
                          >
                            <div
                              style={{
                                textAlign: "center",
                                borderRadius: 10,
                                background: "white",
                                color: "#404b69",
                              }}
                            >
                              <label
                                style={{
                                  borderTopLeftRadius: 10,
                                  borderTopRightRadius: 10,
                                  color: "white",
                                  width: "100%",
                                  fontSize: 18,
                                  fontWeight: "bold",
                                  padding: 10,
                                  background: "#404b69",
                                }}
                              >
                                {location.state}
                              </label>
                              <br />
                              <div
                                className="row justify-content-center"
                                style={{ paddingTop: 15, paddingBottom: 15 }}
                              >
                                <div
                                  style={{ padding: 10, fontWeight: "bold" }}
                                >
                                  <div>{location.confirmed}</div>
                                  <div>Confirmed</div>
                                </div>
                                <div
                                  style={{ padding: 10, fontWeight: "bold" }}
                                >
                                  <div>{location.active}</div>
                                  <div>Active</div>
                                </div>
                                <div
                                  style={{ padding: 10, fontWeight: "bold" }}
                                >
                                  <div>{location.recovered}</div>
                                  <div>Recovered</div>
                                </div>
                                <div
                                  style={{ padding: 10, fontWeight: "bold" }}
                                >
                                  <div>{location.deaths}</div>
                                  <div>Deaths</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })
                  ) : null}
                </div>
              ) : null}{" "}
              {this.state.isTable === 1 ? (
                <div className="row" style={{ marginTop: 15 }}>
                  <div className="col-sm-12">
                    <div
                      style={{
                        background: "white",
                        color: "#404b69",
                        borderRadius: 10,
                      }}
                    >
                      <ReactTable
                        data={data}
                        columns={columns}
                        defaultPageSize={10}
                        className="-striped -highlight"
                        noDataText={<b>No data found</b>}
                        getTheadProps={(state, rowInfo, column) => {
                          return {
                            style: {
                              fontWeight: "bold",
                            },
                          };
                        }}
                        getTdProps={(state, rowInfo, column, instance) => {
                          return {
                            onClick: (e, handleOriginal) => {
                              if (handleOriginal) {
                                handleOriginal();
                              }
                            },
                          };
                        }}
                        filterable
                        SubComponent={(row) => {
                          return row.original.confirmed === 0 ? null : (
                            <div style={{ padding: "20px" }}>
                              <div style={{ borderRadius: 10 }}>
                                <ReactTable
                                  data={
                                    Object.values(
                                      cityData.filter(
                                        (state) =>
                                          Object.keys(state)[0] ===
                                          row.original.state
                                      )[0]
                                    )[0]
                                  }
                                  columns={cityColumns}
                                  defaultPageSize={5}
                                  showPagination={true}
                                />
                              </div>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div style={{ padding: 15 }}>
              Designed and Developed by{"  "}
              <a
                style={{
                  color: "#f6565b",
                  fontWeight: "bold",
                  textDecoration: "none",
                }}
                href="https://miteshtagadiya.js.org"
                rel="noopener noreferrer"
                target="_blank"
              >
                Mitesh Tagadiya
              </a>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withRouter(India);
