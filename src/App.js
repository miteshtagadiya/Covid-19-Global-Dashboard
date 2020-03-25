import React, { Component } from "react";
import "./App.css";
import Select from "react-select";
import SimpleLineChart from "./SimpleLineChart/SimpleLineChart";
import Pagination from "./Pagination";
import Github from "./assets/github1.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      currentPage: 0,
      totalPages: 0,
      activePage: 0,
      selectedCountry: false,
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
    fetch(`https://coronavirus-tracker-api.herokuapp.com/v2/locations`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(response => {
        this.setState({
          data: response,
          totalPages: this.chunkArray(response.locations, 9).length
        });
      })
      .catch(error => {});
  }

  renderCharts(data) {
    this.setState({
      isChart: 1
    });
    data.map(location => {
      fetch(
        `https://coronavirus-tracker-api.herokuapp.com/v2/locations/${location.id}`,
        {
          method: "GET"
        }
      )
        .then(res => res.json())
        .then(response => {
          this.setState(state => {
            const timelines = state.timelines.concat(response);
            return {
              timelines
            };
          });
        })
        .catch(error => {});
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
    const { data } = this.state;
    const { currentPage, totalPages, pageLimit } = data1;

    const offset = (currentPage - 1) * pageLimit;
    const currentLocations = data.locations.slice(offset, offset + pageLimit);
    this.setState({
      timelines: []
    });
    if (!this.state.selectedCountry) {
      this.renderCharts(
        this.chunkArray(this.state.data.locations, 9)[currentPage - 1]
      );
    }

    this.setState({
      currentPage: currentPage - 1,
      currentLocations: currentLocations,
      totalPages: totalPages
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

    const options =
      this.state.data !== [] && this.state.data.locations
        ? this.state.data.locations.map(location => {
            return {
              value:
                location.province === "" ? location.country : location.province,
              label:
                location.province === "" ? location.country : location.province
            };
          })
        : [];

    return (
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
          <div style={{ minHeight: "90vh" }}>
            <div className="row" style={{ padding: "30px 0px" }}>
              <div className="col-sm-4" style={{ padding: 15 }}>
                <div
                  style={{
                    padding: 20,
                    fontWeight: "bold",
                    background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                    color: "#530803",
                    borderRadius: 10
                  }}
                >
                  <div style={{ fontSize: 35, marginBottom: 10 }}>
                    {this.state.data.length !== 0
                      ? this.state.data.latest.confirmed
                      : 0}
                  </div>
                  <div style={{ fontSize: 18 }}>Confirmed</div>
                </div>
              </div>
              <div className="col-sm-4" style={{ padding: 15 }}>
                <div
                  style={{
                    padding: 20,
                    fontWeight: "bold",
                    background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                    color: "#530803",
                    borderRadius: 10
                  }}
                >
                  <div style={{ fontSize: 35, marginBottom: 10 }}>
                    {this.state.data.length !== 0
                      ? this.state.data.latest.deaths
                      : 0}
                  </div>
                  <div style={{ fontSize: 18 }}>Deaths</div>
                </div>
              </div>
              <div className="col-sm-4" style={{ padding: 15 }}>
                <div
                  style={{
                    padding: 20,
                    fontWeight: "bold",
                    background: "linear-gradient(to right, #ee9ca7, #ffdde1)",
                    color: "#530803",
                    borderRadius: 10
                  }}
                >
                  <div style={{ fontSize: 35, marginBottom: 10 }}>
                    {/* {this.state.data.length !== 0
                    ? this.state.data.latest.recovered
                    : 0} */}
                    N/A
                  </div>
                  <div style={{ fontSize: 18 }}>Recovered</div>
                </div>
              </div>
            </div>
            {this.state.isChart === 1 ? (
              <div>
                <Select
                  onChange={selectedOption => {
                    this.setState({
                      timelines: [],
                      selectedCountry: true
                    });
                    this.renderCharts(
                      this.state.data.locations.filter(location =>
                        location.province === ""
                          ? location.country
                              .toLowerCase()
                              .includes(selectedOption.value.toLowerCase())
                          : location.province
                              .toLowerCase()
                              .includes(selectedOption.value.toLowerCase())
                      )
                    );
                  }}
                  styles={colourStyles}
                  options={options}
                />
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  placeholder="Search"
                  onChange={e =>
                    this.setState({
                      searchString: e.target.value
                    })
                  }
                />
              </div>
            )}
            <div
              style={{ textAlign: "right", padding: "15px 0px", marginTop: 15 }}
            >
              <span
                onClick={() =>
                  this.setState({
                    isChart: 1
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
                  this.setState({ isChart: 0, selectedCountry: false })
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
              <div className="row">
                {this.state.data.length !== 0
                  ? this.state.data.locations
                      .filter(location =>
                        location.province === ""
                          ? location.country
                              .toLowerCase()
                              .includes(this.state.searchString.toLowerCase())
                          : location.province
                              .toLowerCase()
                              .includes(this.state.searchString.toLowerCase())
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
                                {location.province === ""
                                  ? location.country
                                  : location.province}
                              </label>
                              <br />
                              <div className="row justify-content-center">
                                <div
                                  style={{ padding: 20, fontWeight: "bold" }}
                                >
                                  <div>{location.latest.confirmed}</div>
                                  <div>Confirmed</div>
                                </div>
                                <div
                                  style={{ padding: 20, fontWeight: "bold" }}
                                >
                                  <div>{location.latest.deaths}</div>
                                  <div>Deaths</div>
                                </div>
                                <div
                                  style={{ padding: 20, fontWeight: "bold" }}
                                >
                                  <div>{location.latest.recovered}</div>
                                  <div>Recovered</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  : null}
              </div>
            ) : (
              <div className="row">
                {this.state.timelines.length !== 0
                  ? this.state.timelines
                      .filter(locations =>
                        locations.location.country
                          .toLowerCase()
                          .includes(this.state.searchString.toLowerCase())
                      )
                      .map((timeline, index1) => {
                        let data = Object.keys(
                          timeline.location.timelines.confirmed.timeline
                        ).map((dataKey, index) => {
                          return {
                            name: new Date(dataKey).toDateString(),
                            Confirmed:
                              timeline.location.timelines.confirmed.timeline[
                                dataKey
                              ],
                            Deaths:
                              timeline.location.timelines.deaths.timeline[
                                dataKey
                              ]
                          };
                        });
                        return (
                          <div
                            key={index1}
                            className="col-sm-4"
                            style={{ padding: 15 }}
                          >
                            <div
                              style={{ background: "white", borderRadius: 10 }}
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
                                {timeline.location.province === ""
                                  ? timeline.location.country
                                  : timeline.location.province}
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
                                    {timeline.location.latest.confirmed}
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
                                  <div>{timeline.location.latest.deaths}</div>
                                  <div>Deaths</div>
                                </div>
                                <div
                                  style={{
                                    padding: 20,
                                    fontWeight: "bold",
                                    color: "#2F847C"
                                  }}
                                >
                                  <div>
                                    {timeline.location.latest.recovered}
                                  </div>
                                  <div>Recovered</div>
                                </div>
                              </div>
                              <SimpleLineChart
                                data={data}
                                label2="Deaths"
                                label1="Confirmed"
                              />
                            </div>
                          </div>
                        );
                      })
                  : null}
                <br />
                {!this.state.selectedCountry ? (
                  <div className="row" style={{ width: "100%", padding: 30 }}>
                    <Pagination
                      totalRecords={this.state.data.locations.length}
                      pageLimit={9}
                      pageNeighbours={2}
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
    );
  }
}

export default App;
