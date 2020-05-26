import React, { Component } from "react";
import SwitchBar from "components/ui/SwitchBar/SwitchBar";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import Select from "react-select";
import CustomChart from "components/charts/PieChart/CustomChart";
import GradientCardTitle from "components/ui/GradientCardTitle/GradientCardTitle";
import GradientCardFooter from "components/ui/GradientCardFooter/GradientCardFooter";
import SimplePieChart from "components/charts/SimplePieChart/SimplePieChart";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = { status: false, seconds: 0, started: false };
  }

  render() {
    let toptenCities = [];

    if (this.props.stateWiseCity.length !== 0) {
      let data = {};
      Object.values(this.props.stateWiseCity).map((city) => {
        return Object.assign(data, city.districtData);
      });

      let sorted = Object.keys(data).sort((a, b) => {
        return data[b]["confirmed"] - data[a]["confirmed"];
      });
      let filtered = sorted
        .filter((data) => data !== "Unassigned")
        .slice(0, 10);

      toptenCities = filtered.map((city) => {
        return { name: city, ["Cases"]: data[city].confirmed };
      });
    }

    let totalDataDaily =
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
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
      this.props.india.length !== 0
        ? this.props.india.cases_time_series.map((cases) => {
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

    var sortable =
      this.props.india.length !== 0 ? this.props.india.statewise : [];

    const Comparator = (a, b) => {
      if (Number(a[1]) > Number(b[1])) return -1;
      if (Number(a[1]) < Number(b[1])) return 1;
      return 0;
    };

    var pieChartData =
      this.props.india.length !== 0
        ? sortable
            .filter(
              (record) =>
                record.state !== "Total" && record.state !== "State Unassigned"
            )
            .map((state) => {
              return [state.state, Number(state[this.props.filterByCases])];
            })
        : [];

    pieChartData = pieChartData.sort(Comparator).slice(0, 10);

    let sortedCuntryName = [];
    if (pieChartData.length !== 0) {
      pieChartData.map((data) => {
        sortedCuntryName.push(data[0]);
      });
    }

    let sortedCountryCode =
      this.props.india.length !== 0
        ? sortable
            .filter(
              (record) =>
                record.state !== "Total" &&
                sortedCuntryName.includes(record.state)
            )
            .map((code) => {
              return code.statecode.toLowerCase();
            })
        : [];

    let sortedCountryName =
      this.props.india.length !== 0
        ? sortable
            .filter(
              (record) =>
                record.state !== "Total" &&
                sortedCuntryName.includes(record.state)
            )
            .map((code) => {
              return code.state;
            })
        : [];

    let dailyConfirmedStatus = this.props.dailyStatus.filter(
      (data) => data.status === "Confirmed"
    );
    let dailyRecoveredStatus = this.props.dailyStatus.filter(
      (data) => data.status === "Recovered"
    );
    let dailyDeathsStatus = this.props.dailyStatus.filter(
      (data) => data.status === "Deceased"
    );

    let count = (code, data, index) => {
      let confirmed = 0;
      for (var i = 0; i <= index; i++) {
        confirmed += Number(dailyConfirmedStatus[i][code]);
      }
      return confirmed;
    };

    let dailyConfirmedFiltered = dailyConfirmedStatus.map((data, index) => {
      let arr = [];

      sortedCountryCode.map((code) => {
        arr.push({
          [code.toUpperCase()]: count(code, dailyConfirmedStatus, index),
        });
      });
      return { [data.date]: arr };
    });

    let dailyRecoveredFiltered = dailyRecoveredStatus.map((data) => {
      let arr = [];
      sortedCountryCode.map((code) => {
        arr.push({ [code.toUpperCase()]: data[code] });
      });
      return { [data.date]: arr };
    });

    let dailyDeathsFiltered = dailyDeathsStatus.map((data) => {
      let arr = [];
      sortedCountryCode.map((code) => {
        arr.push({ [code.toUpperCase()]: data[code] });
      });
      return { [data.date]: arr };
    });

    let multiLineChartData = [];

    multiLineChartData =
      this.props.dailyStatus.length !== 0
        ? dailyConfirmedFiltered.map((cases, index) => {
            let array = Object.values(cases).map((state) => {
              let subArray = { name: Object.keys(cases)[0] };
              state.map((state, i) => {
                subArray[sortedCountryName[i]] = Object.values(state)[0];
              });
              return subArray;
            });
            return array[0];
          })
        : null;

    let a =
      this.props.dailyStatus.length !== 0 && this.props.india.length !== 0
        ? this.props.dailyStatus
            .filter((data) => data.status === "Confirmed")
            .map((d, index) => {
              let x = {};
              Object.keys(d).map((d1) => {
                x[d1] = count(d1, this.props.dailyStatus, index);
              });
              let ob = Object.fromEntries(
                Object.entries(
                  Object.fromEntries(
                    Object.entries(x).sort((a, b) => b[1] - a[1])
                  )
                ).slice(0, 6)
              );

              let z = Object.keys(ob)
                .filter((name) => name !== "tt")
                .map((name, i) => {
                  return {
                    name: this.props.india.statewise.filter(
                      (state) => state.statecode.toLowerCase() === name
                    )[0].state,
                    ["Cases"]: ob[name],
                  };
                });
              return z;
            })
        : [];

    let Columns = [
      { type: "string", label: "name" },
      { type: "number", label: "value" },
    ];

    const filteredByDailyConfirmed = this.props.dailyStatus.filter(
      (data) => data.status === "Confirmed"
    );

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
    let countries = [];
    let nationalityGroup = [];

    if (this.props.rawData.length !== 0) {
      this.props.rawData.map((data) => {
        countries.push(data.nationality);
      });
      countries = [...new Set(countries)].map((country) => {
        return { [country]: 0 };
      });
    }

    let ageGroup = [],
      genderGroup = [];
    let unknown = 0;
    let unknownGender = 0;
    if (this.props.rawData.length !== 0) {
      let range1 = 0,
        range2 = 0,
        range3 = 0,
        range4 = 0,
        range5 = 0,
        range6 = 0,
        range7 = 0,
        range8 = 0,
        range9 = 0,
        range10 = 0,
        male = 0,
        female = 0;
      this.props.rawData.map((data) => {
        countries.filter((country, index) => {
          if (Object.keys(country)[0] === data.nationality) {
            countries[index][data.nationality] =
              countries[index][data.nationality] + 1;
          }
        });
        if (data.agebracket !== "") {
          if (Number(data.agebracket) >= 0 && Number(data.agebracket) <= 10) {
            range1++;
          } else if (
            Number(data.agebracket) > 10 &&
            Number(data.agebracket) <= 20
          ) {
            range2++;
          } else if (
            Number(data.agebracket) > 20 &&
            Number(data.agebracket) <= 30
          ) {
            range3++;
          } else if (
            Number(data.agebracket) > 30 &&
            Number(data.agebracket) <= 40
          ) {
            range4++;
          } else if (
            Number(data.agebracket) > 40 &&
            Number(data.agebracket) <= 50
          ) {
            range5++;
          } else if (
            Number(data.agebracket) > 50 &&
            Number(data.agebracket) <= 60
          ) {
            range6++;
          } else if (
            Number(data.agebracket) > 60 &&
            Number(data.agebracket) <= 70
          ) {
            range7++;
          } else if (
            Number(data.agebracket) > 70 &&
            Number(data.agebracket) <= 80
          ) {
            range8++;
          } else if (
            Number(data.agebracket) > 80 &&
            Number(data.agebracket) <= 90
          ) {
            range9++;
          } else {
            range10++;
          }
        } else {
          unknown++;
        }

        if (data.gender !== "") {
          if (data.gender === "M") {
            male++;
          } else if (data.gender === "F") {
            female++;
          }
        } else {
          unknownGender++;
        }
      });

      nationalityGroup = countries.map((country) => {
        if (Object.keys(country)[0] !== "") {
          return {
            name: Object.keys(country),
            ["Patients"]: Object.values(country),
          };
        }
      });

      ageGroup = [
        {
          name: "0-10 years",
          ["Cases"]: range1,
        },
        { name: "11-20 years", ["Cases"]: range2 },
        { name: "21-30 years", ["Cases"]: range3 },
        { name: "31-40 years", ["Cases"]: range4 },
        { name: "41-50 years", ["Cases"]: range5 },
        { name: "51-60 years", ["Cases"]: range6 },
        { name: "61-70 years", ["Cases"]: range7 },
        { name: "71-80 years", ["Cases"]: range8 },
        { name: "81-90 years", ["Cases"]: range9 },
        { name: "91 up years", ["Cases"]: range10 },
      ];
      genderGroup = [
        { name: "Male", value: male },
        { name: "Female", value: female },
        { name: "Awaiting Details", value: unknownGender },
      ];
    }

    return (
      <div className="row">
        <div className="col-sm-12 col-12">
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
            <GradientCardTitle title={"Top 10 cities by confirmed cases"} />
            <SimpleLineChart
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={toptenCities}
              labels={["Cases"]}
              colors={["#192a56"]}
            />
          </div>
        </div>
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
            <GradientCardTitle title={"Total Confirmed and Active cases"} />
            <SwitchBar
              options={["Total", "Daily"]}
              optionValues={["cumulative", "daily"]}
              onClick={(prop) => {
                this.props.onSwitch(prop);
              }}
              showGlobalChartType={this.props.changeChart}
            />
            <SimpleLineChart
              chart={"AreaChart"}
              customTooltip={true}
              grid={false}
              data={
                this.props.changeChart === "daily" ? totalDataDaily : totalData
              }
              labels={["Confirmed", "Active"]}
              colors={["#e43339", "#192a56"]}
            />
          </div>
        </div>

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
            <GradientCardTitle title={"Total Recovered cases and Deaths"} />
            <SwitchBar
              options={["Total", "Daily"]}
              optionValues={["cumulative", "daily"]}
              onClick={(prop) => {
                this.props.onSwitch(prop);
              }}
              showGlobalChartType={this.props.changeChart}
            />
            <SimpleLineChart
              chart={"AreaChart"}
              customTooltip={true}
              grid={false}
              data={
                this.props.changeChart === "daily" ? totalDataDaily : totalData
              }
              labels={["Recovered", "Deaths"]}
              colors={["#006266", "#535c68"]}
            />
          </div>
        </div>

        <div className="col-sm-6 col-12">
          <div
            style={{
              minHeight: 390,
              background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
              paddingBottom: 15,
              paddingLeft: 15,
              paddingTop: 30,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <GradientCardTitle
              title={"Top 5 states timeline by confirmed cases"}
            />
            <div>
              <div className="timer">
                <div
                  className="timer-button"
                  onClick={() => {
                    this.setState({
                      started: !this.state.started,
                      seconds:
                        this.state.seconds < a.length - 1
                          ? this.state.seconds
                          : 0,
                    });
                    this.state.seconds < a.length - 1
                      ? (this.timer = setInterval(() => {
                          return this.state.seconds < a.length - 1
                            ? this.state.started
                              ? this.setState({
                                  seconds: this.state.seconds + 1,
                                })
                              : null
                            : (clearInterval(this.timer),
                              this.state.started === true
                                ? this.setState({
                                    started: false,
                                  })
                                : null);
                        }, 1000))
                      : clearInterval(this.timer);
                  }}
                >
                  {this.state.started ? "Stop" : "Start"}
                </div>
              </div>
              <div className="timer-date">
                {filteredByDailyConfirmed.length > 0
                  ? filteredByDailyConfirmed[this.state.seconds].date
                  : null}
              </div>
            </div>
            <SimpleLineChart
              layout="vertical"
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={a[this.state.seconds]}
              labels={["Cases"]}
              colors={["#192a56"]}
            />
          </div>
        </div>

        <div className="col-sm-6 col-12">
          <div
            style={{
              background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
              paddingBottom: 15,
              minHeight: 390,
              paddingLeft: 15,
              paddingTop: 30,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <GradientCardTitle title={"Total cases in top 10 states"} />
            <SimpleLineChart
              chart={"AreaChart"}
              legend={false}
              customTooltip={true}
              grid={false}
              data={multiLineChartData}
              labels={sortedCountryName}
              colors={[
                "#3c3568",
                "#f6ba62",
                "#bc443b",
                "#185e4b",
                "#150a47",
                "#334553",
                "#d82f5a",
                "#000133",
                "#11887b",
                "#044a05",
              ]}
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
            <GradientCardTitle title={"Top 10 states by cases"} />
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="col-sm-4">
                <Select
                  isClearable={false}
                  isSearchable={false}
                  onChange={(selectedOption) => {
                    this.props.onSelectOption(selectedOption);
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
              minHeight: 410,
              background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
              paddingBottom: 15,
              paddingLeft: 15,
              paddingTop: 30,
              borderRadius: 15,
              marginBottom: 15,
            }}
          >
            <GradientCardTitle title={"Patients count by age"} />
            <SimpleLineChart
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={ageGroup}
              labels={["Cases"]}
              colors={["#192a56"]}
            />
            <GradientCardFooter
              content={`*Awaiting details for ${unknown} patients.`}
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
            <GradientCardTitle title={"Patients count by gender"} />
            <div style={{ marginBottom: -24 }}>
              <span style={{ color: "#192a56", fontWeight: "bold" }}>
                Male{" "}
                {genderGroup.length !== 0
                  ? genderGroup.filter((stat) => stat.name === "Male")[0].value
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
                {genderGroup.length !== 0
                  ? genderGroup.filter((stat) => stat.name === "Female")[0]
                      .value
                  : 0}
              </span>
              <span
                style={{
                  marginLeft: 15,
                  color: "#404b69",
                  fontWeight: "bold",
                }}
              >
                A. Details{" "}
                {genderGroup.length !== 0
                  ? genderGroup.filter(
                      (stat) => stat.name === "Awaiting Details"
                    )[0].value
                  : 0}
              </span>
            </div>
            <SimplePieChart data={genderGroup} />
            <GradientCardFooter
              content={`*Awaiting details for ${unknownGender} patients.`}
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
            <GradientCardTitle title={"Patients count by nationality"} />

            <SimpleLineChart
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={nationalityGroup}
              labels={["Patients"]}
              colors={["#192a56"]}
            />
            <GradientCardFooter
              content={`*Awaiting details for ${
                typeof countries.filter(
                  (country) => Object.keys(country)[0] === ""
                )[0] !== "undefined"
                  ? Object.values(
                      countries.filter(
                        (country) => Object.keys(country)[0] === ""
                      )[0]
                    )[0]
                  : countries.filter(
                      (country) => Object.keys(country)[0] === ""
                    )[0]
              } patients.`}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
