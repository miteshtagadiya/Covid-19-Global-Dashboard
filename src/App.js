import React, { Component } from "react";
import "./App.css";
import Select from "react-select";
import SimpleLineChart from "./SimpleLineChart/SimpleLineChart";
import Pagination from "./Pagination";
import IndiaIcon from "./assets/india.png";
import World from "./assets/world.png";
import Github from "./assets/github1.png";
import Virus from "./assets/virus.gif";
import ErrorBoundary from "./ErrorBoundry";
import Countrys from "./CountryList.json";
import _ from "lodash";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      cards: [],
      globalTimelines: [],
      currentPage: 0,
      currentCardPage: 0,
      totalCardPages: 0,
      totalPages: 0,
      globalData: 0,
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
          data3: [65, 59, 80, 81, 56]
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({
      locationLoader: true
    });
    window.addEventListener("focus", () => {
      fetch(`https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?global=stats`, {
        header: { "Access-Control-Allow-Origin": "*" },
        method: "GET"
      })
        .then(res => res.json())
        .then(response => {
          this.setState({
            globalData: response.results[0],
            locationLoader: false
          });
        })
        .catch(error => {
          this.setState({
            locationLoader: false
          });
        });

      fetch(`https://covid19.mathdro.id/api/daily`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(response => {
          this.setState({
            globalTimelines: response,
            locationLoader: false
          });
        })
        .catch(error => {
          this.setState({
            locationLoader: false
          });
        });

      this.setState({
        cards: []
      });
      this.renderCards(
        this.chunkArray(Object.keys(Countrys), 9)[this.state.currentCardPage]
      );
    });
    fetch(`https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?global=stats`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          globalData: response.results[0],
          locationLoader: false
        });
      })
      .catch(error => {
        this.setState({
          locationLoader: false
        });
      });

    fetch(`https://covid19.mathdro.id/api/daily`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          globalTimelines: response,
          locationLoader: false
        });
      })
      .catch(error => {
        this.setState({
          locationLoader: false
        });
      });

    this.renderCards(
      this.chunkArray(Object.keys(Countrys), 9)[this.state.currentCardPage]
    );
  }

  renderCards(cardId) {
    cardId.map(location => {
      fetch(`https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?countryTotal=${location}`, {
        method: "GET"
      })
        .then(res => res.json())
        .then(response => {
          this.setState({
            locationLoader: false,
            cards: this.state.cards.concat(response)
          });
        })
        .catch(error => {
          this.setState({
            locationLoader: false
          });
        });
    });
  }

  renderCharts(data) {
    this.renderCards(data);
    data.map(location => {
      fetch(
        `https://cors-proxy-pass.herokuapp.com/https://thevirustracker.com/free-api?countryTimeline=${location}`,
        {
          method: "GET"
        }
      )
        .then(res => res.json())
        .then(response => {
          this.setState(state => {
            const timelines = state.timelines.concat(response);
            const locationLoader = false;
            return {
              timelines,
              locationLoader
            };
          });
        })
        .catch(error => {
          this.setState({
            locationLoader: false
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

  onPageChanged = data1 => {
    const { currentPage, totalPages } = data1;

    this.setState({
      timelines: [],
      locationLoader: true
    });
    if (!this.state.selectedCountry) {
      this.renderCharts(_.chunk(Object.keys(Countrys), 9)[currentPage - 1]);
    }

    this.setState({
      currentPage: currentPage - 1,
      totalPages: totalPages
    });
  };

  changeState = () => {
    this.setState({
      locationLoader: true
    });
  };

  onCardPageChanged = data1 => {
    this.setState({
      locationLoader: data1.locationLoader
    });
    const { currentPage } = data1;

    this.setState({
      cards: [],
      locationLoader: true
    });

    if (this.state.loadDefaultCards === false && !this.state.selectedCountry) {
      this.renderCards(_.chunk(Object.keys(Countrys), 9)[currentPage - 1]);
    }
    this.setState({
      currentCardPage: currentPage - 1,
      locationLoader: false,
      loadDefaultCards: false,
      selectedCountry: false
    });
  };

  render() {
    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: "white" }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
            ? "#f6565b"
            : isFocused
            ? "#f6565b"
            : null,
          color: isDisabled ? "#ccc" : isSelected ? "white" : "black",
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            backgroundColor: !isDisabled && (isSelected ? "#f6565b" : "white")
          }
        };
      }
    };

    const options = Object.keys(Countrys).map(location => {
      return {
        value: location,
        label: Countrys[location]
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
                    Number(this.state.globalTimelines[index - 1].deaths.total)
            };
          })
        : null;

    let date = new Date();
    let todayDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    return (
      <ErrorBoundary>
        <div
          className="App"
          style={{
            background: "#172852",
            color: "white",
            height: "100vh",
            overflowY: "scroll"
          }}
        >
          <div className="container">
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 40,
                  fontWeight: "bold",
                  marginTop: 30,
                  paddingBottom: 30,
                  borderBottom: "2px solid white"
                }}
              >
                Covid-19 Global Dashboard
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
                  cursor: "pointer"
                }}
              />
            </div>
            <div style={{ minHeight: "90vh" }}>
              <div className="row" style={{ padding: "30px 0px" }}>
                <div className="col-sm-3" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      minHeight: 156,
                      background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                      color: "#530803",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ fontSize: 35 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_cases
                        : 0}
                    </div>
                    <div style={{ fontSize: 18, marginBottom: 10 }}>
                      <span style={{ fontSize: 20, fontWeight: "bold" }}>
                        &#9650;
                      </span>{" "}
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_new_cases_today
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Confirmed</div>
                  </div>
                </div>
                <div className="col-sm-3" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      minHeight: 156,
                      fontWeight: "bold",
                      background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                      color: "#192a56",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ fontSize: 35, marginBottom: 37 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_active_cases
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Active</div>
                  </div>
                </div>
                <div className="col-sm-3" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      minHeight: 156,
                      fontWeight: "bold",
                      background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                      color: "#006266",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ fontSize: 35, marginBottom: 37 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_recovered
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Recovered</div>
                  </div>
                </div>
                <div className="col-sm-3" style={{ padding: 15 }}>
                  <div
                    style={{
                      padding: 20,
                      fontWeight: "bold",
                      minHeight: 156,
                      background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                      color: "#535c68",
                      borderRadius: 10
                    }}
                  >
                    <div style={{ fontSize: 35 }}>
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_deaths
                        : 0}
                    </div>
                    <div style={{ fontSize: 18, marginBottom: 10 }}>
                      <span style={{ fontSize: 20, fontWeight: "bold" }}>
                        &#9650;
                      </span>{" "}
                      {this.state.globalData.length !== 0
                        ? this.state.globalData.total_new_deaths_today
                        : 0}
                    </div>
                    <div style={{ fontSize: 18 }}>Deaths</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
                  paddingBottom: 15,
                  paddingLeft: 15,
                  borderRadius: 15,
                  marginBottom: 15,
                  paddingTop: 30
                }}
              >
                <SimpleLineChart
                  customTooltip={true}
                  grid={false}
                  data={totalData}
                  labels={["Confirmed", "Active", "Deaths"]}
                  colors={["#e43339", "#192a56", "#535c68"]}
                />
              </div>
              <div>
                <Select
                  isClearable={true}
                  onChange={selectedOption => {
                    this.setState({
                      timelines: [],
                      cards: [],
                      selectedCountry: true
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

              <div
                style={{
                  textAlign: "right",
                  padding: "15px 0px",
                  marginTop: 15
                }}
              >
                <span
                  onClick={() =>
                    this.setState({
                      isChart: 1,
                      selectedCountry: false,
                      locationLoader: true
                    })
                  }
                  style={
                    this.state.isChart === 1
                      ? {
                          background: "#f6565b",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "white",
                          padding: "10px 30px",
                          borderRadius: "20px 0px 0px 20px"
                        }
                      : {
                          background: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "black",
                          padding: "10px 30px",
                          borderRadius: "20px 0px 0px 20px"
                        }
                  }
                >
                  Chart
                </span>
                <span
                  onClick={() =>
                    this.setState({
                      isChart: 0,
                      selectedCountry: false
                    })
                  }
                  style={
                    this.state.isChart === 0
                      ? {
                          background: "#f6565b",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "white",
                          padding: "10px 30px",
                          borderRadius: "0px 20px 20px 0px"
                        }
                      : {
                          background: "white",
                          fontWeight: "bold",
                          cursor: "pointer",
                          color: "black",
                          padding: "10px 30px",
                          borderRadius: "0px 20px 20px 0px"
                        }
                  }
                >
                  Card
                </span>
              </div>
              {this.state.isChart === 0 ? (
                this.state.locationLoader === true ? (
                  <div>
                    <img src={Virus} alt="Loader" />
                  </div>
                ) : (
                  <div className="row">
                    {this.state.cards.length !== 0
                      ? this.state.cards.map((location, index) => {
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
                                  color: "black"
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
                                    background: "#f6565b"
                                  }}
                                >
                                  {location.countrydata[0].info.title}
                                </label>
                                <br />
                                <div className="row justify-content-center">
                                  <div
                                    style={{
                                      padding: 20,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    <div>
                                      {location.countrydata[0].total_cases}
                                      {location.countrydata[0]
                                        .total_new_cases_today === 0 ? null : (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            color: "#e43339"
                                          }}
                                        >
                                          {"  "}
                                          <span
                                            style={{
                                              fontSize: 17,
                                              fontWeight: "bold"
                                            }}
                                          >
                                            &#9650;
                                          </span>
                                          {
                                            location.countrydata[0]
                                              .total_new_cases_today
                                          }
                                        </span>
                                      )}
                                    </div>
                                    <div>Confirmed</div>
                                  </div>
                                  <div
                                    style={{
                                      padding: 20,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    <div>
                                      {
                                        location.countrydata[0]
                                          .total_active_cases
                                      }
                                    </div>
                                    <div>Active</div>
                                  </div>
                                  <div
                                    style={{
                                      padding: 20,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    <div>
                                      {location.countrydata[0].total_deaths}
                                      {location.countrydata[0]
                                        .total_new_deaths_today === 0 ? null : (
                                        <span
                                          style={{
                                            fontSize: 12,
                                            color: "#535c68"
                                          }}
                                        >
                                          {"  "}
                                          <span
                                            style={{
                                              fontSize: 17,
                                              fontWeight: "bold"
                                            }}
                                          >
                                            &#9650;
                                          </span>
                                          {
                                            location.countrydata[0]
                                              .total_new_deaths_today
                                          }
                                        </span>
                                      )}
                                    </div>
                                    <div>Deaths</div>
                                  </div>
                                  <div
                                    style={{
                                      padding: 20,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    <div>
                                      {location.countrydata[0].total_recovered}
                                    </div>
                                    <div>Recovered</div>
                                  </div>
                                  <div
                                    style={{
                                      padding: 20,
                                      fontWeight: "bold"
                                    }}
                                  >
                                    <div>
                                      {
                                        location.countrydata[0]
                                          .total_serious_cases
                                      }
                                    </div>
                                    <div>Serious</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      : null}
                    {!this.state.selectedCountry ? (
                      <div
                        className="row"
                        style={{ width: "100%", padding: 30 }}
                      >
                        <Pagination
                          totalRecords={Object.keys(Countrys).length}
                          pageLimit={9}
                          pageNeighbours={1}
                          onPageChanged={data => {
                            this.onCardPageChanged(data);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                )
              ) : (
                <div className="row">
                  {this.state.locationLoader === true ? (
                    <div style={{ width: "100%" }}>
                      <img src={Virus} alt="Loader" />
                    </div>
                  ) : this.state.timelines.length !== 0 ? (
                    this.state.timelines.map((timeline, index1) => {
                      let data = Object.keys(timeline.timelineitems[0])
                        .filter(data => data !== "stat" && data !== todayDate)
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
                                .new_daily_deaths
                          };
                        });
                      let confirmed =
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                          ? this.state.cards.filter(
                              country =>
                                country.countrydata[0].info.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].countrydata[0].total_cases
                          : Object.values(timeline.timelineitems[0])[
                              Object.values(timeline.timelineitems[0]).length -
                                2
                            ].total_cases;
                      let deaths =
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                          ? this.state.cards.filter(
                              country =>
                                country.countrydata[0].info.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].countrydata[0].total_deaths
                          : Object.values(timeline.timelineitems[0])[
                              Object.values(timeline.timelineitems[0]).length -
                                2
                            ].total_deaths;
                      let recovered =
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                          ? this.state.cards.filter(
                              country =>
                                country.countrydata[0].info.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].countrydata[0].total_recovered
                          : Object.values(timeline.timelineitems[0])[
                              Object.values(timeline.timelineitems[0]).length -
                                2
                            ].total_recoveries;
                      let NewConfirmed =
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                          ? this.state.cards.filter(
                              country =>
                                country.countrydata[0].info.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].countrydata[0].total_new_cases_today
                          : Object.values(timeline.timelineitems[0])[
                              Object.values(timeline.timelineitems[0]).length -
                                2
                            ].new_daily_cases;
                      let NewDeaths =
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                          ? this.state.cards.filter(
                              country =>
                                country.countrydata[0].info.title ===
                                timeline.countrytimelinedata[0].info.title
                            )[0].countrydata[0].total_new_deaths_today
                          : Object.values(timeline.timelineitems[0])[
                              Object.values(timeline.timelineitems[0]).length -
                                2
                            ].new_daily_deaths;
                      if (
                        typeof this.state.cards.filter(
                          country =>
                            country.countrydata[0].info.title ===
                            timeline.countrytimelinedata[0].info.title
                        )[0] !== "undefined"
                      ) {
                        data.push({
                          name: todayDate,
                          Confirmed: this.state.cards.filter(
                            country =>
                              country.countrydata[0].info.title ===
                              timeline.countrytimelinedata[0].info.title
                          )[0].countrydata[0].total_cases,
                          Deaths: this.state.cards.filter(
                            country =>
                              country.countrydata[0].info.title ===
                              timeline.countrytimelinedata[0].info.title
                          )[0].countrydata[0].total_deaths,
                          Recovered: this.state.cards.filter(
                            country =>
                              country.countrydata[0].info.title ===
                              timeline.countrytimelinedata[0].info.title
                          )[0].countrydata[0].total_recovered,
                          ["New Conf."]: this.state.cards.filter(
                            country =>
                              country.countrydata[0].info.title ===
                              timeline.countrytimelinedata[0].info.title
                          )[0].countrydata[0].total_new_cases_today,
                          ["New Deaths"]: this.state.cards.filter(
                            country =>
                              country.countrydata[0].info.title ===
                              timeline.countrytimelinedata[0].info.title
                          )[0].countrydata[0].total_new_deaths_today
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
                              borderRadius: 10
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
                                background: "#f6565b"
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
                                  color: "#92063e"
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
                                          fontWeight: "bold"
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
                                  color: "black"
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
                                          fontWeight: "bold"
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
                                  color: "#2F847C"
                                }}
                              >
                                <div>{recovered}</div>
                                <div>Recovered</div>
                              </div>
                            </div>
                            <SimpleLineChart
                              labels={[
                                "Confirmed",
                                "Recovered",
                                "Deaths",
                                "New Conf.",
                                "New Deaths"
                              ]}
                              colors={[
                                "#e43339",
                                "#006266",
                                "#535c68",
                                "#192a56",
                                "#192a56"
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
                    <div className="row" style={{ width: "100%", padding: 30 }}>
                      <Pagination
                        totalRecords={Object.keys(Countrys).length}
                        pageLimit={9}
                        pageNeighbours={1}
                        onPageChanged={this.onPageChanged}
                      />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div style={{ padding: 15 }}>
              Designed and Developed by{"  "}
              <a
                style={{
                  color: "#f6565b",
                  fontWeight: "bold",
                  textDecoration: "none"
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
