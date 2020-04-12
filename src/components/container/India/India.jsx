import React, { Component } from "react";
import "components/Backup/App.css";
import "react-table-6/react-table.css";
import { withRouter } from "react-router-dom";
import ErrorBoundary from "components/ui/ErrorBoundry/ErrorBoundry";
import IndiaMap from "components/charts/IndiaMap/IndiaMap";
import Footer from "components/ui/Footer/Footer";
import Table from "components/container/India/SubComponents/Table";
import Cards from "components/container/India/SubComponents/Cards";
import "components/container/India/India.sass";
import Header from "components/ui/Header/Header";
import NumbersCard from "components/container/India/SubComponents/NumbersCard";
import NavigationBar from "components/ui/NavigationBar/NavigationBar";
import Analytics from "components/container/India/SubComponents/Analytics";

class India extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: "",
      currentPage: 0,
      ui: "/",
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
      rawData: [],
      dailyStatus: [],
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
      this.getData();
      this.getStateData();
    });

    this.setState({
      locationLoader: true,
    });
    this.getRawData();
    this.getDailyStatus();
    this.getData();
    this.getStateData();
  }

  getStateData() {
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

  getRawData() {
    fetch(`https://api.covid19india.org/raw_data.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        this.setState({
          rawData: response.raw_data,
          locationLoader: false,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });
  }

  getDailyStatus() {
    fetch(`https://api.covid19india.org/states_daily.json`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        this.setState({
          dailyStatus: response.states_daily,
          locationLoader: false,
        });
      })
      .catch((error) => {
        this.setState({
          locationLoader: false,
        });
      });
  }

  getData() {
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
    return (
      <ErrorBoundary>
        <div className="App India">
          <div className="container">
            <div>
              <Header history={this.props.history} width={this.state.width} />
            </div>
            <div style={{ minHeight: "90vh" }}>
              <NumbersCard india={this.state.india} />
              <NavigationBar
                type="India"
                ui={this.state.ui}
                options={["Analytics", "Card", "Table", "Map"]}
                optionRoutes={["/", "/card", "/table", "/map"]}
                onClick={(route) => {
                  this.setState({
                    ui: route,
                  });
                }}
              />
              {this.state.ui === "/" ? (
                <Analytics
                  dailyStatus={this.state.dailyStatus}
                  rawData={this.state.rawData}
                  filterByCases={this.state.filterByCases}
                  displayBySort={this.state.displayBySort}
                  india={this.state.india}
                  onSelectOption={(selectedOption) => {
                    this.setState({
                      filterByCases:
                        selectedOption === null
                          ? "confirmed"
                          : selectedOption.value,
                    });
                  }}
                  onSwitch={(prop) =>
                    this.setState({
                      changeChart: prop,
                    })
                  }
                  changeChart={this.state.changeChart}
                />
              ) : null}
              {this.state.ui === "/map" ? (
                <div
                  className="row india-map"
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
              {this.state.ui === "/card" ? (
                <>
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
                  <Cards
                    locationLoader={this.state.locationLoader}
                    india={this.state.india}
                    searchString={this.state.searchString}
                  />
                </>
              ) : null}{" "}
              {this.state.ui === "/table" ? (
                <Table
                  india={this.state.india}
                  stateWiseCity={this.state.stateWiseCity}
                />
              ) : null}
            </div>
            <Footer />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}

export default withRouter(India);
