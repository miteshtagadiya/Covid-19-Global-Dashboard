import React, { Component } from "react";
import Virus from "assets/virus.gif";
import Countrys from "utils/CountryList.json";
import Select from "react-select";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import Pagination from "components/ui/Pagination/Pagination";
import _ from "lodash";

class ChartsCard extends Component {
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

    let date = new Date();
    let todayDate =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    return (
      <>
        <div>
          <Select
            isClearable={true}
            onChange={(selectedOption) => {
              this.setState({
                timelines: [],
                selectedCountry: true,
              });
              this.getChartsData(
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
          {this.props.locationLoader === true ? (
            <div style={{ width: "100%" }}>
              <img src={Virus} alt="Loader" />
            </div>
          ) : this.props.timelines.length !== 0 ? (
            this.props.timelines.map((timeline, index1) => {
              let data = Object.keys(timeline.timelineitems[0])
                .filter((data) => data !== "stat" && data !== todayDate)
                .map((dataKey, index) => {
                  return {
                    name: dataKey,
                    Confirmed: timeline.timelineitems[0][dataKey].total_cases,
                    Deaths: timeline.timelineitems[0][dataKey].total_deaths,
                    Recovered:
                      timeline.timelineitems[0][dataKey].total_recoveries,
                    ["New Conf."]:
                      timeline.timelineitems[0][dataKey].new_daily_cases,
                    ["New Deaths"]:
                      timeline.timelineitems[0][dataKey].new_daily_deaths,
                  };
                });
              let cardValue =
                this.props.cards.length !== 0 &&
                typeof Object.values(
                  this.props.cards[0].countryitems[0]
                ).filter(
                  (country) =>
                    country !== "ok" &&
                    country.title === timeline.countrytimelinedata[0].info.title
                )[0];
              let filteredTitle = Object.values(
                this.props.cards[0].countryitems[0]
              ).filter(
                (country) =>
                  country !== "ok" &&
                  country.title === timeline.countrytimelinedata[0].info.title
              )[0];
              let totalCases = Object.values(timeline.timelineitems[0])[
                Object.values(timeline.timelineitems[0]).length - 2
              ];
              let confirmed =
                cardValue !== "undefined"
                  ? filteredTitle.total_cases
                  : totalCases.total_cases;
              let deaths =
                cardValue !== "undefined"
                  ? filteredTitle.total_deaths
                  : totalCases.total_deaths;
              let recovered =
                cardValue !== "undefined"
                  ? filteredTitle.total_recovered
                  : totalCases.total_recoveries;
              let NewConfirmed =
                cardValue !== "undefined"
                  ? filteredTitle.total_new_cases_today
                  : totalCases.new_daily_cases;
              let NewDeaths =
                cardValue !== "undefined"
                  ? filteredTitle.total_new_deaths_today
                  : totalCases.new_daily_deaths;
              let countryItemsFiltered = Object.values(
                this.props.cards[0].countryitems[0]
              ).filter(
                (country) =>
                  country.title === timeline.countrytimelinedata[0].info.title
              )[0];
              if (cardValue !== "undefined") {
                data.push({
                  name: todayDate,
                  Confirmed: countryItemsFiltered.total_cases,
                  Deaths: countryItemsFiltered.total_deaths,
                  Recovered: countryItemsFiltered.total_recovered,
                  ["New Conf."]: countryItemsFiltered.total_new_cases_today,
                  ["New Deaths"]: countryItemsFiltered.total_new_deaths_today,
                });
              }
              return (
                <div key={index1} className="col-sm-4 Chart-Card">
                  <div className="chart-card-style">
                    <label className="chart-card-title">
                      {timeline.countrytimelinedata[0].info.title}
                    </label>
                    <br />
                    <div className="row justify-content-center">
                      <div className="chart-card-label-confirmed">
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
                      <div className="chart-card-label-deaths">
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
                      <div className="chart-card-label-recovered">
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
          {!this.props.selectedCountry ? (
            <div className="row" style={{ width: "100%", padding: 30 }}>
              <Pagination
                totalRecords={Object.keys(Countrys).length}
                pageLimit={9}
                pageNeighbours={1}
                onPageChanged={this.props.onPageChanged}
              />
            </div>
          ) : null}
        </div>
      </>
    );
  }
}

export default ChartsCard;
