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
import GradientCardTitle from "components/ui/GradientCardTitle/GradientCardTitle";
import NumbersCard from "components/container/India/SubComponents/NumbersCard";
import NavigationBar from "components/ui/NavigationBar/NavigationBar";
import Analytics from "components/container/India/SubComponents/Analytics";
import StateWiseMap from "../../charts/IndiaMap/StateWiseMap";

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
      tooltipContent: "",
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

  filterStateName = (name) => {
    switch (name) {
      case "Andaman and Nicobar Islands":
        return "andamannicobarislands";
      case "Arunachal Pradesh":
        return "arunachalpradesh";
      case "Andhra Pradesh":
        return "andhrapradesh";
      case "Assam":
        return "assam";
      case "Bihar":
        return "bihar";
      case "Chandigarh":
        return "chandigarh";
      case "Chhattisgarh":
        return "chhattisgarh";
      case "Dadra and Nagar Haveli":
        return "dadranagarhaveli";
      case "Delhi":
        return "delhi";
      case "Karnataka":
        return "karnataka";
      case "Kerala":
        return "kerala";
      case "Goa":
        return "goa";
      case "Gujarat":
        return "gujarat";
      case "Haryana":
        return "haryana";
      case "Himachal Pradesh":
        return "himachalpradesh";
      case "Jammu and Kashmir":
        return "jammukashmir";
      case "Jharkhand":
        return "jharkhand";
      case "Ladakh":
        return "ladakh";
      case "Lakshadweep":
        return "lakshadweep";
      case "Madhya Pradesh":
        return "madhyapradesh";
      case "Maharashtra":
        return "maharashtra";
      case "Manipur":
        return "manipur";
      case "Meghalaya":
        return "meghalaya";
      case "Mizoram":
        return "mizoram";
      case "Nagaland":
        return "nagaland";
      case "Odisha":
        return "odisha";
      case "Puducherry":
        return "puducherry";
      case "Punjab":
        return "punjab";
      case "Rajasthan":
        return "rajasthan";
      case "Sikkim":
        return "sikkim";
      case "Tamil Nadu":
        return "nadu";
      case "Telangana":
        return "telangana";
      case "Tripura":
        return "tripura";
      case "Uttarakhand":
        return "uttarakhand";
      case "Uttar Pradesh":
        return "uttarpradesh";
      case "West Bengal":
        return "westbengal";
      default:
        return "gujarat";
    }
  };

  render() {
    return (
      <ErrorBoundary>
        <div className="App India">
          <div className="container">
            <div>
              <Header
                dashboard={"India"}
                history={this.props.history}
                width={this.state.width}
              />
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
                  stateWiseCity={this.state.stateWiseCity}
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
                <div>
                  {this.state.showState === true ? (
                    <div>
                      <div
                        style={{
                          background:
                            "linear-gradient(to right, #d9a7c7, #fffcdc)",
                          paddingBottom: 25,
                          paddingTop: 30,
                          borderRadius: 15,
                          marginBottom: 15,
                        }}
                      >
                        <GradientCardTitle
                          style={{ textAlign: "center" }}
                          title={this.state.originalStateName}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "rgb(228, 51, 57)",
                            }}
                          >
                            <span>Confirmed</span>
                            <br />
                            <span>{this.state.toolTipContent.confirmed}</span>
                            <br />

                            {this.state.toolTipContent.deltaconfirmed !==
                            "0" ? (
                              <span
                                style={{ fontSize: 17, fontWeight: "bold" }}
                              >
                                &#9650;{" "}
                                {this.state.toolTipContent.deltaconfirmed}
                              </span>
                            ) : null}
                          </div>

                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "rgb(25, 42, 86)",
                            }}
                          >
                            <span>Active</span>
                            <br />
                            <span>{this.state.toolTipContent.active}</span>
                          </div>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "rgb(0, 98, 102)",
                            }}
                          >
                            <span>Recovered</span>
                            <br />
                            <span>{this.state.toolTipContent.recovered}</span>
                            <br />
                            {this.state.toolTipContent.deltaconfirmed !==
                            "0" ? (
                              <span
                                style={{ fontSize: 17, fontWeight: "bold" }}
                              >
                                &#9650;{" "}
                                {this.state.toolTipContent.deltarecovered}
                              </span>
                            ) : null}
                          </div>
                          <div
                            style={{
                              fontWeight: "bold",
                              fontSize: 16,
                              color: "rgb(83, 92, 104)",
                            }}
                          >
                            <span>Deaths</span>
                            <br />
                            <span>{this.state.toolTipContent.deaths}</span>
                            <br />
                            {this.state.toolTipContent.deltaconfirmed !==
                            "0" ? (
                              <span
                                style={{ fontSize: 17, fontWeight: "bold" }}
                              >
                                &#9650; {this.state.toolTipContent.deltadeaths}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center">
                        <div
                          style={{
                            background: "#404b69",
                            cursor: "pointer",
                            fontWeight: "bold",
                            padding: "6px 20px",
                            borderRadius: 5,
                          }}
                          onClick={() =>
                            this.setState({
                              showState: false,
                            })
                          }
                        >
                          Back
                        </div>
                      </div>
                    </div>
                  ) : null}
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
                      {this.state.showState === true ? (
                        <div>
                          <StateWiseMap
                            stateName={this.state.stateName}
                            data={
                              this.state.stateWiseCity.length !== 0
                                ? typeof this.state.stateWiseCity[
                                    this.state.originalStateName
                                  ] !== "undefined"
                                  ? this.state.stateWiseCity[
                                      this.state.originalStateName
                                    ]["districtData"]
                                  : []
                                : []
                            }
                          />
                        </div>
                      ) : (
                        <IndiaMap
                          onStateClick={(state) => {
                            this.setState({
                              showState: true,
                              stateName: this.filterStateName(state.state),
                              originalStateName: state.state,
                              toolTipContent: state,
                            });
                          }}
                          data={
                            this.state.india.length !== 0
                              ? this.state.india.statewise.filter(
                                  (state) => state.state !== "Total"
                                )
                              : []
                          }
                        />
                      )}
                    </div>
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
                    dailyStatus={this.state.dailyStatus}
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
