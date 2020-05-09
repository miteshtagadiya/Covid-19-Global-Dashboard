import React, { Component } from "react";
import "components/Backup/App.css";
import "react-table-6/react-table.css";
import ErrorBoundary from "components/ui/ErrorBoundry/ErrorBoundry";
import Countrys from "utils/CountryList.json";
import _ from "lodash";
import "components/container/Global/Global.sass";
import Header from "components/ui/Header/Header";
import NavigationBar from "components/ui/NavigationBar/NavigationBar";
import Footer from "components/ui/Footer/Footer";
import Table from "components/container/Global/SubComponents/Table";
import NumberCard from "components/container/Global/SubComponents/NumberCard";
import Analytics from "components/container/Global/SubComponents/Analytics";
import GlobalMap from "components/container/Global/SubComponents/GlobalMap";
import Cards from "components/container/Global/SubComponents/Cards";
import ChartsCard from "components/container/Global/SubComponents/ChartsCard";

class Global extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showGlobalChartType: "AreaChart",
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
      data: [],
      timelines: [],
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    this.setState({
      locationLoader: true,
    });
    window.addEventListener("focus", () => {
      this.getGlobalData();
      this.getDailyData();
      this.getDeathRates();
      this.getCardsData([1]);
    });

    this.getGlobalData();
    this.getDailyData();
    this.getDeathRates();
    this.getCardsData([1]);
  }

  getDeathRates() {
    fetch(`https://covid19-global-api1.herokuapp.com/deaths-rate.json`, {
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
  }

  getGlobalData() {
    fetch(`https://covid19-global-api1.herokuapp.com/global.json`, {
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
  }

  getDailyData() {
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
  }

  getCardsData(cardId) {
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

  getChartsData(data) {
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

  onPageChanged = (data1) => {
    const { currentPage, totalPages } = data1;

    this.setState({
      timelines: [],
      locationLoader: true,
    });
    if (!this.state.selectedCountry) {
      this.getChartsData(_.chunk(Object.keys(Countrys), 9)[currentPage - 1]);
    }

    this.setState({
      currentPage: currentPage - 1,
      totalPages: totalPages,
    });
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
        <div className="Global">
          <div className="container">
            <div>
              <Header
                dashboard={"Global"}
                history={this.props.history}
                width={this.state.width}
              />
            </div>
            <div style={{ minHeight: "90vh" }}>
              <NumberCard globalData={this.state.globalData} />
              <NavigationBar
                type="Global"
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
                  globalTimelines={this.state.globalTimelines}
                  deathsRate={this.state.deathsRate}
                  globalData={this.state.globalData}
                  showGlobalChartType={this.state.showGlobalChartType}
                  filterByCases={this.state.filterByCases}
                  onSwitchBar={(prop) => {
                    this.setState({
                      showGlobalChartType: prop,
                    });
                  }}
                  onChange={(selectedOption) => {
                    this.setState({
                      filterByCases:
                        selectedOption === null
                          ? "confirmed"
                          : selectedOption.value,
                    });
                  }}
                />
              ) : null}
              {this.state.ui === "/map" ? (
                <GlobalMap
                  mapFilter={this.state.mapFilter}
                  globalData={this.state.globalData}
                  setTooltipContent={this.state.setTooltipContent}
                  onSetTooltipContent={(content) => {
                    this.setState({ setTooltipContent: content });
                  }}
                  onMapSwitch={(prop) => {
                    this.setState({
                      mapFilter: prop,
                    });
                  }}
                />
              ) : null}
              {this.state.ui === "/table" ? (
                <Table globalData={this.state.globalData} />
              ) : null}
              {this.state.ui === "/card" ? (
                <Cards
                  locationLoader={this.state.locationLoader}
                  searchString={this.state.searchString}
                  globalData={this.state.globalData}
                  onSearch={(e) => {
                    this.setState({
                      searchString: e.target.value.toLowerCase(),
                      selectedCountry: false,
                    });
                  }}
                />
              ) : null}
              {this.state.ui === "/chart" ? (
                <ChartsCard
                  locationLoader={this.state.locationLoader}
                  cards={this.state.cards}
                  timelines={this.state.timelines}
                  selectedCountry={this.state.selectedCountry}
                  onPageChanged={this.onPageChanged}
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

export default Global;
