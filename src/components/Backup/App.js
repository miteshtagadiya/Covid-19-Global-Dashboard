import React, { Component } from "react";
import "./App.css";
import Select from "react-select";
import ReactTable from "react-table-6";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import "react-table-6/react-table.css";
import Pagination from "components/ui/Pagination/Pagination";
import IndiaIcon from "assets/india.png";
import World from "assets/world.png";
import Github from "assets/github1.png";
import Virus from "assets/virus.gif";
import ErrorBoundary from "components/ui/ErrorBoundry/ErrorBoundry";
import Countrys from "utils/CountryList.json";
import ReactGA from "react-ga";
import CustomChart from "components/charts/PieChart/CustomChart";
import DataMap from "components/charts/DataMap/DataMap";
import ReactTooltip from "react-tooltip";
import _ from "lodash";
import Popover from "react-popover";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SimplePieChart from "components/charts/SimplePieChart/SimplePieChart";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGlobalChartType: "LineChart",
      searchString: "",
      cards: [],
      ui: "/",
      width: 0,
      height: 0,
      globalTimelines: [],
      setTooltipContent: "",
      mapFilter: "confirmed",
      filterByCases: "confirmed",
      displayBySort: "All",
      currentPage: 0,
      currentCardPage: 0,
      totalCardPages: 0,
      totalPages: 0,
      globalData: [],
      deathsRate: [],
      locationLoader: false,
      selectedCountry: false,
      loadDefaultCards: true,
      data: [],
      timelines: [],
      labels: ["January", "February", "March", "April", "May"],
      isChart: 0,
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

    this.setState({
      locationLoader: true,
    });
    window.addEventListener("focus", () => {
      fetch(`https://covid19-global-api.herokuapp.com/global.json`, {
        header: { "Access-Control-Allow-Origin": "*" },
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            globalData: response,
          });
        })
        .catch((error) => {
          this.setState({
            locationLoader: false,
          });
        });

      fetch(`https://covid19.mathdro.id/api/daily`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            globalTimelines: response,
          });
        })
        .catch((error) => {
          this.setState({
            locationLoader: false,
          });
        });

      this.renderCards([1]);
    });
    fetch(`https://covid19-global-api.herokuapp.com/deaths-rate.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          deathsRate: response,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });
    fetch(`https://covid19-global-api.herokuapp.com/global.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          globalData: response,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });

    fetch(`https://covid19.mathdro.id/api/daily`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          globalTimelines: response,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });

    this.renderCards([1]);
  }

  renderCards(cardId) {
    let cards = [];
    this.setState({
      cards: [],
      locationLoader: true,
    });
    cardId.map((location) => {
      fetch(
        `https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?countryTotals=ALL`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((response) => {
          this.setState({
            locationLoader: false,
            cards: cards.concat(response),
          });
        })
        .catch((error) => {
          this.setState({
            locationLoader: false,
          });
        });
    });
  }

  renderCharts(data) {
    data.map((location) => {
      fetch(
        `https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?countryTimeline=${location}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((response) => {
          this.setState((state) => {
            const timelines = state.timelines.concat(response);
            const locationLoader = false;
            return {
              timelines,
              locationLoader,
            };
          });
        })
        .catch((error) => {
          this.setState({
            locationLoader: false,
          });
        });
    });
  }

  chunkArray = (array, size) => {
    let result = [];
    let arrayCopy = [...array];
    while (arrayCopy.length > 0) {
      result.push(arrayCopy.splice(0, size));
    }
    return result;
  };

  onPageChanged = (data1) => {
    const { currentPage, totalPages } = data1;

    this.setState({
      timelines: [],
      locationLoader: true,
    });
    if (!this.state.selectedCountry) {
      this.renderCharts(_.chunk(Object.keys(Countrys), 9)[currentPage - 1]);
    }

    this.setState({
      currentPage: currentPage - 1,
      totalPages: totalPages,
    });
  };

  changeState = () => {
    this.setState({
      locationLoader: true,
    });
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  renderTooltipLabelColor(caseType) {
    switch (caseType[0]) {
      case "Confirmed":
        return "rgb(64, 75, 105)";

      case "Deaths":
        return "rgb(255, 82, 82)";

      case "Recovered":
        return "rgb(76, 175, 80)";

      default:
        return "rgb(64, 75, 105)";
    }
  }

  render() {
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
            ? "white"
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

    const options = Object.keys(Countrys).map((location) => {
      return {
        value: location,
        label: Countrys[location],
      };
    });

    let totalData =
      this.state.globalTimelines.length !== 0
        ? this.state.globalTimelines.map((cases, index) => {
            return {
              name: cases.reportDate,
              Confirmed: Number(cases.totalConfirmed),
              Active:
                Number(cases.totalConfirmed) -
                Number(cases.totalRecovered) -
                Number(cases.deaths.total),
              Recovered: Number(cases.totalRecovered),
              Deaths: Number(cases.deaths.total),
              dailyConfirmed: Number(cases.deltaConfirmed),
              dailyActive:
                index === 0
                  ? Number(cases.totalConfirmed) -
                    Number(cases.totalRecovered) -
                    Number(cases.deaths.total)
                  : Number(cases.totalConfirmed) -
                    Number(cases.totalRecovered) -
                    Number(cases.deaths.total) -
                    (Number(
                      this.state.globalTimelines[index - 1].totalConfirmed
                    ) -
                      Number(
                        this.state.globalTimelines[index - 1].totalRecovered
                      ) -
                      Number(
                        this.state.globalTimelines[index - 1].deaths.total
                      )),
              dailyRecovered: Number(cases.deltaRecovered),
              dailyDeaths:
                index === 0
                  ? Number(cases.deaths.total)
                  : Number(cases.deaths.total) -
                    Number(this.state.globalTimelines[index - 1].deaths.total),
            };
          })
        : null;

    let totalDeathsByAge =
      this.state.deathsRate.length !== 0
        ? Object.values(
            this.state.deathsRate.filter(
              (type) => Object.keys(type)[0] === "deathsRateByAge"
            )[0]
          )[0].map((cases, index) => {
            return {
              name: cases.age,
              ["Rate (%)"]: cases.all_cases.replace(/[^0-9.]/g, ""),
              ["Rate in confirmed cases(%)"]: cases.confirmed_cases.replace(
                /[^0-9.]/g,
                ""
              ),
            };
          })
        : null;

    let totalDeathsByCom =
      this.state.deathsRate.length !== 0
        ? Object.values(
            this.state.deathsRate.filter(
              (type) => Object.keys(type)[0] === "deathsRateBycomorbidity"
            )[0]
          )[0].map((cases, index) => {
            return {
              name: cases.age,
              ["Rate (%)"]: cases.all_cases.replace(/[^0-9.]/g, ""),
              ["Rate in confirmed cases(%)"]:
                cases.confirmed_cases.replace(/[^0-9.]/g, "") === 0
                  ? 0
                  : cases.confirmed_cases.replace(/[^0-9.]/g, ""),
            };
          })
        : null;

    let date = new Date();
    let todayDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    const data =
      this.state.globalData.length !== 0
        ? this.state.globalData
            .filter((country) => country.title !== "World")
            .map((country) => {
              return {
                country: country.title,
                confirmed: Number(country.confirmed),
                active: Number(country.active),
                recovered: Number(country.recovered),
                deaths: Number(country.deaths),
                deltaConfirmed: Number(country.confirmed_today),
                deltaDeaths: Number(country.deaths_today),
                tests: Number(country.totaltests),
              };
            })
        : [];

    const columns =
      this.state.globalData.length !== 0
        ? [
            {
              Header: "Country",
              accessor: "country", // String-based value accessors!
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
            {
              Header: "Tests",
              accessor: "tests",
              Cell: (props) => {
                return (
                  <>
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
          ]
        : [];

    const Comparator = (a, b) => {
      if (Number(a[1]) > Number(b[1])) return -1;
      if (Number(a[1]) < Number(b[1])) return 1;
      return 0;
    };

    var pieChartData =
      this.state.globalData.length !== 0
        ? this.state.globalData
            .filter((country) => country.title !== "World")
            .map((state) => {
              return [state.title, Number(state[this.state.filterByCases])];
            })
        : [];

    var deathsBySex =
      this.state.deathsRate.length !== 0
        ? Object.values(
            this.state.deathsRate.filter(
              (type) => Object.keys(type)[0] === "deathsRateBySex"
            )[0]
          )[0].map((cases, index) => {
            return {
              name: cases.sex,
              value: Number(cases.confirmed_cases.replace(/[^0-9.]/g, "")),
            };
          })
        : [];

    pieChartData = pieChartData.sort(Comparator).slice(0, 10);

    let Columns = [
      { type: "string", label: "name" },
      { type: "number", label: "value" },
    ];
    let uiClass = "nav-item nav-link";
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
                Covid-19 Global {this.state.width < 1024 ? "" : "Dashboard"}
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
            </div>
            <div style={{ paddingTop: 15 }}>
              <img
                onClick={() => this.props.history.push("/india")}
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
            <div style={{ minHeight: "90vh" }}>
              <div className="row" style={{ padding: "30px 0px" }}>
                <div className="col-sm-3 col-6" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      minHeight: 156,
                      background: "#448AFF",
                      color: "white",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].confirmed
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: "bold" }}>
                        &#9650;
                      </span>{" "}
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].confirmed_today
                        : 0}
                      {this.state.globalData.length !== 0 &&
                      Number(
                        this.state.globalData.filter(
                          (state) => state.title === "World"
                        )[0].confirmed_today
                      ) !== 0 ? (
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
                              {this.state.globalData
                                .filter(
                                  (state) =>
                                    state.title !== "World" &&
                                    state.confirmed_today !== ""
                                )
                                .map((state, index) => {
                                  return (
                                    <div key={index}>
                                      {state.title}: {state.confirmed_today}
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
                                category: "Global Info",
                                action: "Global Confirmed Info Clicked",
                                label: "Global Confirm Info",
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
                  </div>
                </div>
                <div className="col-sm-3 col-6" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      minHeight: 156,
                      fontWeight: "bold",
                      background: "#F9A825",
                      color: "white",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30, marginBottom: 42 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].active
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Active</div>
                  </div>
                </div>
                <div className="col-sm-3 col-6" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      minHeight: 156,
                      fontWeight: "bold",
                      background: "#4CAF50",
                      color: "#ffffff",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30, marginBottom: 42 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].recovered
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Recovered</div>
                  </div>
                </div>
                <div className="col-sm-3 col-6" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      minHeight: 156,
                      background: "#FF5252",
                      color: "#ffffff",
                      borderRadius: 10,
                    }}
                  >
                    <div style={{ fontSize: 30 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].deaths
                        : 0}
                    </div>
                    <div
                      style={{
                        fontSize: 18,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: 20, fontWeight: "bold" }}>
                        &#9650;
                      </span>{" "}
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.filter(
                            (state) => state.title === "World"
                          )[0].deaths_today
                        : 0}
                      {this.state.globalData.length !== 0 &&
                      Number(
                        this.state.globalData.filter(
                          (state) => state.title === "World"
                        )[0].deaths_today
                      ) !== 0 ? (
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
                              {this.state.globalData
                                .filter(
                                  (state) =>
                                    state.title !== "World" &&
                                    state.deaths_today !== ""
                                )
                                .map((state, index) => {
                                  return (
                                    <div key={index}>
                                      {state.title}: {state.deaths_today}
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
                                category: "Global Info",
                                action: "Global Deaths Info Clicked",
                                label: "Global Deaths Info",
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
                  </div>
                </div>
              </div>
              <nav style={{ paddingBottom: 15 }}>
                <div className="nav nav-tabs nav-fill">
                  <label
                    className={
                      this.state.ui === "/" ? uiClass + " active" : uiClass
                    }
                    onClick={() => {
                      this.setState({ ui: "/" });
                      ReactGA.event({
                        category: "Global",
                        action: "Analytics selected",
                        label: "Global Analytics",
                      });
                    }}
                  >
                    {/* <Link to="/"> */}
                    <FontAwesomeIcon
                      icon={["fas", "user"]}
                      style={{ marginRight: 15 }}
                    />
                    Analytics
                    {/* </Link> */}
                  </label>
                  <label
                    className={
                      this.state.ui === "/card" ? uiClass + " active" : uiClass
                    }
                    onClick={() => {
                      this.setState({ ui: "/card" });
                      ReactGA.event({
                        category: "Global",
                        action: "Card selected",
                        label: "Global Card",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "code"]}
                      style={{ marginRight: 15 }}
                    />
                    Card
                  </label>
                  <label
                    className={
                      this.state.ui === "/table" ? uiClass + " active" : uiClass
                    }
                    onClick={() => {
                      this.setState({ ui: "/table" });
                      ReactGA.event({
                        category: "Global",
                        action: "Table selected",
                        label: "Global Table",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "building"]}
                      style={{ marginRight: 15 }}
                    />
                    Table
                  </label>
                  <label
                    className={
                      this.state.ui === "/map" ? uiClass + " active" : uiClass
                    }
                    onClick={() => {
                      this.setState({ ui: "/map" });
                      ReactGA.event({
                        category: "Global",
                        action: "Map selected",
                        label: "Global Map",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "laptop-code"]}
                      style={{ marginRight: 15 }}
                    />
                    Map
                  </label>
                  <label
                    className={
                      this.state.ui === "/chart" ? uiClass + " active" : uiClass
                    }
                    onClick={() => {
                      this.setState({ ui: "/chart" });
                      ReactGA.event({
                        category: "Global",
                        action: "Chart selected",
                        label: "Global Chart",
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "envelope"]}
                      style={{ marginRight: 15 }}
                    />
                    Chart
                  </label>
                </div>
              </nav>
              {this.state.ui === "/" ? (
                <div className="row">
                  <div className="col-sm-4 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Total Confirmed cases daily
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={
                            this.state.showGlobalChartType === "LineChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  cursor: "pointer",
                                  borderTopLeftRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopLeftRadius: 10,
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "LineChart",
                            })
                          }
                        >
                          Line
                        </div>
                        <div
                          style={
                            this.state.showGlobalChartType === "BarChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "BarChart",
                            })
                          }
                        >
                          Bar
                        </div>
                      </div>
                      <SimpleLineChart
                        chart={"AreaChart"}
                        customTooltip={true}
                        grid={false}
                        data={totalData}
                        labels={["Confirmed"]}
                        colors={["#e43339"]}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Total Active cases daily
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={
                            this.state.showGlobalChartType === "LineChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  cursor: "pointer",
                                  borderTopLeftRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopLeftRadius: 10,
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "LineChart",
                            })
                          }
                        >
                          Line
                        </div>
                        <div
                          style={
                            this.state.showGlobalChartType === "BarChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "BarChart",
                            })
                          }
                        >
                          Bar
                        </div>
                      </div>
                      <SimpleLineChart
                        chart={"AreaChart"}
                        customTooltip={true}
                        grid={false}
                        data={totalData}
                        labels={["Active"]}
                        colors={["#192a56"]}
                      />
                    </div>
                  </div>

                  <div className="col-sm-4 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Total deaths daily
                      </div>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={
                            this.state.showGlobalChartType === "LineChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  cursor: "pointer",
                                  borderTopLeftRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopLeftRadius: 10,
                                  borderBottomLeftRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "LineChart",
                            })
                          }
                        >
                          Line
                        </div>
                        <div
                          style={
                            this.state.showGlobalChartType === "BarChart"
                              ? {
                                  background: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                  color: "white",
                                }
                              : {
                                  color: "rgb(64, 75, 105)",
                                  cursor: "pointer",
                                  border: "3px solid rgb(64, 75, 105)",
                                  padding: "5px 15px",
                                  borderTopRightRadius: 10,
                                  borderBottomRightRadius: 10,
                                  fontWeight: "bold",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              showGlobalChartType: "BarChart",
                            })
                          }
                        >
                          Bar
                        </div>
                      </div>
                      <SimpleLineChart
                        chart={"AreaChart"}
                        customTooltip={true}
                        grid={false}
                        data={totalData}
                        labels={["Deaths"]}
                        colors={["#535c68"]}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        paddingTop: 30,
                        borderRadius: 15,
                        marginBottom: 15,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Top ten countries by cases
                      </div>
                      <div className="row" style={{ justifyContent: "center" }}>
                        <div className="col-sm-6">
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
                            placeholder="Top 10 Confirmed"
                            options={[
                              { value: "confirmed", label: "Top 10 Confirmed" },
                              { value: "active", label: "Top 10 Active" },
                              { value: "deaths", label: "Top 10 Deaths" },
                              { value: "recovered", label: "Top 10 Recovered" },
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
                  <div className="col-sm-6 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Fatality Rate By Age
                      </div>
                      <SimpleLineChart
                        chart={"BarChart"}
                        customTooltip={true}
                        grid={false}
                        data={totalDeathsByAge}
                        labels={["Rate (%)"]}
                        colors={["#192a56"]}
                      />
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 12,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          marginRight: 15,
                          textAlign: "left",
                        }}
                      >
                        The percentages do not have to add up to 100%, as they
                        do NOT represent share of deaths by age group.
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Fatality Rate By Gender
                      </div>
                      <div style={{ marginBottom: -24 }}>
                        <span style={{ color: "#192a56", fontWeight: "bold" }}>
                          Male{" "}
                          {deathsBySex.length !== 0
                            ? deathsBySex.filter(
                                (stat) => stat.name === "Male"
                              )[0].value
                            : 0}
                        </span>
                        <span
                          style={{
                            marginLeft: 15,
                            color: "rgb(255, 82, 82)",
                            fontWeight: "bold",
                          }}
                        >
                          Female{" "}
                          {deathsBySex.length !== 0
                            ? deathsBySex.filter(
                                (stat) => stat.name === "Female"
                              )[0].value
                            : 0}
                        </span>
                      </div>
                      <SimplePieChart data={deathsBySex} />
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 12,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          marginRight: 15,
                          textAlign: "left",
                        }}
                      >
                        The percentages do not have to add up to 100%, as they
                        do NOT represent share of deaths by age group.
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 col-12">
                    <div
                      style={{
                        minHeight: 368,
                        background:
                          "linear-gradient(to right, #d9a7c7, #fffcdc)",
                        paddingBottom: 15,
                        paddingLeft: 15,
                        borderRadius: 15,
                        marginBottom: 15,
                        paddingTop: 30,
                      }}
                    >
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 18,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          textAlign: "left",
                        }}
                      >
                        Fatality Rate By Comorbility
                      </div>
                      <SimpleLineChart
                        chart={"BarChart"}
                        customTooltip={true}
                        grid={false}
                        data={totalDeathsByCom}
                        labels={["Rate (%)", "Rate in confirmed cases(%)"]}
                        colors={["#192a56", "#192a56"]}
                      />
                      <div
                        style={{
                          color: "rgb(64, 75, 105)",
                          fontSize: 12,
                          marginBottom: 15,
                          fontWeight: "bold",
                          marginLeft: 15,
                          marginRight: 15,
                          textAlign: "left",
                        }}
                      >
                        The percentages do not have to add up to 100%, as they
                        do NOT represent share of deaths by age group.
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              {this.state.ui === "/map" ? (
                <div className="row" style={{ marginTop: 20 }}>
                  <div
                    className="col-sm-12 col-12"
                    style={{ minHeight: "368px" }}
                  >
                    <div
                      style={{
                        minHeight: 368,
                        border: "2px solid rgb(255, 252, 220)",
                        paddingBottom: 15,
                        paddingTop: 30,
                        borderRadius: 15,
                        marginBottom: 15,
                      }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <div
                          style={
                            this.state.mapFilter === "confirmed"
                              ? {
                                  background: "rgb(68, 138, 255)",
                                  color: "white",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                              : {
                                  border: "2px solid rgb(68, 138, 255)",
                                  color: "rgb(68, 138, 255)",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              mapFilter: "confirmed",
                            })
                          }
                        >
                          Confirmed
                        </div>
                        <div
                          style={
                            this.state.mapFilter === "recovered"
                              ? {
                                  background: "rgb(76, 175, 80)",
                                  color: "white",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                              : {
                                  border: "2px solid rgb(76, 175, 80)",
                                  color: "rgb(76, 175, 80)",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              mapFilter: "recovered",
                            })
                          }
                        >
                          Recovered
                        </div>
                        <div
                          style={
                            this.state.mapFilter === "deaths"
                              ? {
                                  background: "rgb(255, 82, 82)",
                                  color: "white",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                              : {
                                  border: "2px solid rgb(255, 82, 82)",
                                  color: "rgb(255, 82, 82)",
                                  borderRadius: 5,
                                  padding: "5px 10px",
                                  fontWeight: "bold",
                                  margin: "0px 5px",
                                  cursor: "pointer",
                                }
                          }
                          onClick={() =>
                            this.setState({
                              mapFilter: "deaths",
                            })
                          }
                        >
                          Deaths
                        </div>
                      </div>
                      <DataMap
                        mapFilter={this.state.mapFilter}
                        data={
                          this.state.globalData.length !== 0
                            ? this.state.globalData.filter(
                                (location) => location.title !== "World"
                              )
                            : []
                        }
                        setTooltipContent={(content) =>
                          this.setState({ setTooltipContent: content })
                        }
                      />
                      <ReactTooltip>
                        {this.state.setTooltipContent.length !== 0 ? (
                          <div>
                            <span
                              style={{
                                color: this.renderTooltipLabelColor(
                                  Object.keys(this.state.setTooltipContent[0])
                                ),
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {Object.values(this.state.setTooltipContent[0])}
                            </span>
                            <br />
                            <span
                              style={{
                                color: this.renderTooltipLabelColor(
                                  Object.keys(this.state.setTooltipContent[0])
                                ),
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {Object.keys(this.state.setTooltipContent[1])}{" "}
                              {": "}
                              {Object.values(
                                this.state.setTooltipContent[1]
                              )}{" "}
                              <span
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                &#9650;
                              </span>
                              {Object.values(this.state.setTooltipContent[5])}
                            </span>
                            <br />
                            <span
                              style={{
                                color: this.renderTooltipLabelColor(
                                  Object.keys(this.state.setTooltipContent[2])
                                ),
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {Object.keys(this.state.setTooltipContent[2])}{" "}
                              {": "}
                              {Object.values(
                                this.state.setTooltipContent[2]
                              )}{" "}
                              <span
                                style={{ fontSize: 20, fontWeight: "bold" }}
                              >
                                &#9650;
                              </span>
                              {Object.values(this.state.setTooltipContent[4])}
                            </span>
                            <br />
                            <span
                              style={{
                                color: this.renderTooltipLabelColor(
                                  Object.keys(this.state.setTooltipContent[3])
                                ),
                                fontWeight: "bold",
                                fontSize: 16,
                              }}
                            >
                              {Object.keys(this.state.setTooltipContent[3])}{" "}
                              {": "}
                              {Object.values(this.state.setTooltipContent[3])}
                            </span>
                            <br />
                          </div>
                        ) : (
                          ""
                        )}
                      </ReactTooltip>
                    </div>
                  </div>
                </div>
              ) : null}
              {this.state.ui === "/table" ? (
                <div
                  className="row"
                  style={{ marginTop: 20, marginBottom: 15 }}
                >
                  <div className="col-sm-12">
                    <div
                      style={{
                        background: "white",
                        color: "#404b69",
                        borderRadius: 10,
                      }}
                    >
                      <ReactTable
                        style={{ minHeight: 500 }}
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
                        filterable
                      />
                    </div>
                  </div>
                </div>
              ) : null}
              {this.state.ui === "/card" ? (
                this.state.locationLoader === true ? (
                  <div>
                    <img src={Virus} alt="Loader" />
                  </div>
                ) : (
                  <>
                    <div style={{ marginBottom: 20 }}>
                      <input
                        defaultValue={this.state.searchString}
                        type="text"
                        placeholder="Search"
                        onChange={(e) =>
                          this.setState({
                            searchString: e.target.value.toLowerCase(),
                            selectedCountry: false,
                          })
                        }
                      />
                    </div>
                    <div className="row">
                      {this.state.globalData.length !== 0
                        ? this.state.globalData
                            .filter(
                              (location) =>
                                location.title !== "World" &&
                                location.title
                                  .toLowerCase()
                                  .includes(this.state.searchString)
                            )
                            .map((location, index) => {
                              return (
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
                                      {location.title}
                                    </label>
                                    <br />
                                    <div className="row justify-content-center">
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>
                                          {location.confirmed}
                                          {location.confirmed_today ===
                                          "" ? null : (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "#e43339",
                                              }}
                                            >
                                              {"  "}
                                              <span
                                                style={{
                                                  fontSize: 17,
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                &#9650;
                                              </span>
                                              {location.confirmed_today}
                                            </span>
                                          )}
                                        </div>
                                        <div>Confirmed</div>
                                      </div>
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>{location.active}</div>
                                        <div>Active</div>
                                      </div>
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>
                                          {location.deaths}
                                          {location.deaths_today ===
                                          "" ? null : (
                                            <span
                                              style={{
                                                fontSize: 12,
                                                color: "#535c68",
                                              }}
                                            >
                                              {"  "}
                                              <span
                                                style={{
                                                  fontSize: 17,
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                &#9650;
                                              </span>
                                              {location.deaths_today}
                                            </span>
                                          )}
                                        </div>
                                        <div>Deaths</div>
                                      </div>
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>{location.recovered}</div>
                                        <div>Recovered</div>
                                      </div>
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>{location.critical}</div>
                                        <div>Serious</div>
                                      </div>
                                      <div
                                        style={{
                                          padding: 20,
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <div>{location.totaltests}</div>
                                        <div>Tests</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                        : null}
                    </div>
                  </>
                )
              ) : null}{" "}
              {this.state.ui === "/chart" ? (
                <>
                  <div>
                    <Select
                      isClearable={true}
                      onChange={(selectedOption) => {
                        this.setState({
                          timelines: [],
                          selectedCountry: true,
                        });
                        this.state.isChart === 0
                          ? this.renderCards(
                              selectedOption === null
                                ? _.chunk(Object.keys(Countrys), 9)[0]
                                : [selectedOption.value.toUpperCase()]
                            )
                          : this.renderCharts(
                              selectedOption === null
                                ? _.chunk(Object.keys(Countrys), 9)[0]
                                : [selectedOption.value.toUpperCase()]
                            );
                      }}
                      styles={colourStyles}
                      options={options}
                    />
                  </div>

                  <div className="row">
                    {this.state.locationLoader === true ? (
                      <div style={{ width: "100%" }}>
                        <img src={Virus} alt="Loader" />
                      </div>
                    ) : this.state.timelines.length !== 0 ? (
                      this.state.timelines.map((timeline, index1) => {
                        let data = Object.keys(timeline.timelineitems[0])
                          .filter(
                            (data) => data !== "stat" && data !== todayDate
                          )
                          .map((dataKey, index) => {
                            return {
                              name: dataKey,
                              Confirmed:
                                timeline.timelineitems[0][dataKey].total_cases,
                              Deaths:
                                timeline.timelineitems[0][dataKey].total_deaths,
                              Recovered:
                                timeline.timelineitems[0][dataKey]
                                  .total_recoveries,
                              ["New Conf."]:
                                timeline.timelineitems[0][dataKey]
                                  .new_daily_cases,
                              ["New Deaths"]:
                                timeline.timelineitems[0][dataKey]
                                  .new_daily_deaths,
                            };
                          });
                        let confirmed =
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                            ? Object.values(
                                this.state.cards[0].countryitems[0]
                              ).filter(
                                (country) =>
                                  country !== "ok" &&
                                  country.title ===
                                    timeline.countrytimelinedata[0].info.title
                              )[0].total_cases
                            : Object.values(timeline.timelineitems[0])[
                                Object.values(timeline.timelineitems[0])
                                  .length - 2
                              ].total_cases;
                        let deaths =
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                            ? Object.values(
                                this.state.cards[0].countryitems[0]
                              ).filter(
                                (country) =>
                                  country !== "ok" &&
                                  country.title ===
                                    timeline.countrytimelinedata[0].info.title
                              )[0].total_deaths
                            : Object.values(timeline.timelineitems[0])[
                                Object.values(timeline.timelineitems[0])
                                  .length - 2
                              ].total_deaths;
                        let recovered =
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                            ? Object.values(
                                this.state.cards[0].countryitems[0]
                              ).filter(
                                (country) =>
                                  country !== "ok" &&
                                  country.title ===
                                    timeline.countrytimelinedata[0].info.title
                              )[0].total_recovered
                            : Object.values(timeline.timelineitems[0])[
                                Object.values(timeline.timelineitems[0])
                                  .length - 2
                              ].total_recoveries;
                        let NewConfirmed =
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                            ? Object.values(
                                this.state.cards[0].countryitems[0]
                              ).filter(
                                (country) =>
                                  country !== "ok" &&
                                  country.title ===
                                    timeline.countrytimelinedata[0].info.title
                              )[0].total_new_cases_today
                            : Object.values(timeline.timelineitems[0])[
                                Object.values(timeline.timelineitems[0])
                                  .length - 2
                              ].new_daily_cases;
                        let NewDeaths =
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                            ? Object.values(
                                this.state.cards[0].countryitems[0]
                              ).filter(
                                (country) =>
                                  country !== "ok" &&
                                  country.title ===
                                    timeline.countrytimelinedata[0].info.title
                              )[0].total_new_deaths_today
                            : Object.values(timeline.timelineitems[0])[
                                Object.values(timeline.timelineitems[0])
                                  .length - 2
                              ].new_daily_deaths;
                        if (
                          this.state.cards.length !== 0 &&
                          typeof Object.values(
                            this.state.cards[0].countryitems[0]
                          ).filter(
                            (country) =>
                              country !== "ok" &&
                              country.title ===
                                timeline.countrytimelinedata[0].info.title
                          )[0] !== "undefined"
                        ) {
                          data.push({
                            name: todayDate,
                            Confirmed: Object.values(
                              this.state.cards[0].countryitems[0]
                            ).filter(
                              (country) =>
                                country.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].total_cases,
                            Deaths: Object.values(
                              this.state.cards[0].countryitems[0]
                            ).filter(
                              (country) =>
                                country.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].total_deaths,
                            Recovered: Object.values(
                              this.state.cards[0].countryitems[0]
                            ).filter(
                              (country) =>
                                country.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].total_recovered,
                            ["New Conf."]: Object.values(
                              this.state.cards[0].countryitems[0]
                            ).filter(
                              (country) =>
                                country.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].total_new_cases_today,
                            ["New Deaths"]: Object.values(
                              this.state.cards[0].countryitems[0]
                            ).filter(
                              (country) =>
                                country.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].total_new_deaths_today,
                          });
                        }
                        return (
                          <div
                            key={index1}
                            className="col-sm-4"
                            style={{ padding: 15 }}
                          >
                            <div
                              style={{
                                background: "white",
                                borderRadius: 10,
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
                                {timeline.countrytimelinedata[0].info.title}
                              </label>
                              <br />
                              <div className="row justify-content-center">
                                <div
                                  style={{
                                    padding: 20,
                                    fontWeight: "bold",
                                    color: "#92063e",
                                  }}
                                >
                                  <div>
                                    {confirmed}
                                    {NewConfirmed === 0 ? null : (
                                      <span style={{ fontSize: 13 }}>
                                        {"  "}
                                        <span
                                          style={{
                                            fontSize: 17,
                                            fontWeight: "bold",
                                          }}
                                        >
                                          &#9650;
                                        </span>
                                        {NewConfirmed}
                                      </span>
                                    )}
                                  </div>
                                  <div>Confirmed</div>
                                </div>
                                <div
                                  style={{
                                    padding: 20,
                                    fontWeight: "bold",
                                    color: "#404b69",
                                  }}
                                >
                                  <div>
                                    {deaths}
                                    {NewDeaths === 0 ? null : (
                                      <span style={{ fontSize: 13 }}>
                                        {"  "}
                                        <span
                                          style={{
                                            fontSize: 17,
                                            fontWeight: "bold",
                                          }}
                                        >
                                          &#9650;
                                        </span>
                                        {NewDeaths}
                                      </span>
                                    )}
                                  </div>
                                  <div>Deaths</div>
                                </div>
                                <div
                                  style={{
                                    padding: 20,
                                    fontWeight: "bold",
                                    color: "#2F847C",
                                  }}
                                >
                                  <div>{recovered}</div>
                                  <div>Recovered</div>
                                </div>
                              </div>
                              <SimpleLineChart
                                chart={"AreaChart"}
                                labels={[
                                  "Confirmed",
                                  "Recovered",
                                  "Deaths",
                                  "New Conf.",
                                  "New Deaths",
                                ]}
                                colors={[
                                  "#e43339",
                                  "#006266",
                                  "#535c68",
                                  "#192a56",
                                  "#192a56",
                                ]}
                                data={data}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : null}
                    <br />
                    {!this.state.selectedCountry ? (
                      <div
                        className="row"
                        style={{ width: "100%", padding: 30 }}
                      >
                        <Pagination
                          totalRecords={Object.keys(Countrys).length}
                          pageLimit={9}
                          pageNeighbours={1}
                          onPageChanged={this.onPageChanged}
                        />
                      </div>
                    ) : null}
                  </div>
                </>
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

export default App;
