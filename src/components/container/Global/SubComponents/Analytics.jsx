import React, { Component } from "react";
import GradientCardTitle from "components/ui/GradientCardTitle/GradientCardTitle";
import SwitchBar from "components/ui/SwitchBar/SwitchBar";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import CustomChart from "components/charts/PieChart/CustomChart";
import GradientCardFooter from "components/ui/GradientCardFooter/GradientCardFooter";
import SimplePieChart from "components/charts/SimplePieChart/SimplePieChart";
import Select from "react-select";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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

    let totalData =
      this.props.globalTimelines.length !== 0
        ? this.props.globalTimelines.map((cases, index) => {
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
                      this.props.globalTimelines[index - 1].totalConfirmed
                    ) -
                      Number(
                        this.props.globalTimelines[index - 1].totalRecovered
                      ) -
                      Number(
                        this.props.globalTimelines[index - 1].deaths.total
                      )),
              dailyRecovered: Number(cases.deltaRecovered),
              dailyDeaths:
                index === 0
                  ? Number(cases.deaths.total)
                  : Number(cases.deaths.total) -
                    Number(this.props.globalTimelines[index - 1].deaths.total),
            };
          })
        : [];

    let totalDeathsByAge =
      this.props.deathsRate.length !== 0
        ? Object.values(
            this.props.deathsRate.filter(
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
      this.props.deathsRate.length !== 0
        ? Object.values(
            this.props.deathsRate.filter(
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

    const Comparator = (a, b) => {
      if (Number(a[1]) > Number(b[1])) return -1;
      if (Number(a[1]) < Number(b[1])) return 1;
      return 0;
    };

    var pieChartData =
      this.props.globalData.length !== 0
        ? this.props.globalData
            .filter((country) => country.title !== "World")
            .map((state) => {
              return [state.title, Number(state[this.props.filterByCases])];
            })
        : [];

    var deathsBySex =
      this.props.deathsRate.length !== 0
        ? Object.values(
            this.props.deathsRate.filter(
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

    return (
      <div className="row">
        <div className="col-sm-4 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Total Confirmed cases daily"} />
            <SwitchBar
              options={["Area", "Bar"]}
              optionValues={["AreaChart", "BarChart"]}
              onClick={(prop) => {
                this.props.onSwitchBar(prop);
              }}
              showGlobalChartType={this.props.showGlobalChartType}
            />
            <SimpleLineChart
              chart={this.props.showGlobalChartType}
              customTooltip={true}
              grid={false}
              data={totalData}
              labels={["Confirmed"]}
              colors={["#e43339"]}
            />
          </div>
        </div>
        <div className="col-sm-4 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Total Active cases daily"} />
            <SwitchBar
              options={["Area", "Bar"]}
              optionValues={["AreaChart", "BarChart"]}
              onClick={(prop) => {
                this.props.onSwitchBar(prop);
              }}
              showGlobalChartType={this.props.showGlobalChartType}
            />
            <SimpleLineChart
              chart={this.props.showGlobalChartType}
              customTooltip={true}
              grid={false}
              data={totalData}
              labels={["Active"]}
              colors={["#192a56"]}
            />
          </div>
        </div>

        <div className="col-sm-4 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Total deaths daily"} />
            <SwitchBar
              options={["Area", "Bar"]}
              optionValues={["AreaChart", "BarChart"]}
              onClick={(prop) => {
                this.props.onSwitchBar(prop);
              }}
              showGlobalChartType={this.props.showGlobalChartType}
            />
            <SimpleLineChart
              chart={this.props.showGlobalChartType}
              customTooltip={true}
              grid={false}
              data={totalData}
              labels={["Deaths"]}
              colors={["#535c68"]}
            />
          </div>
        </div>

        <div className="col-sm-6 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Top 10 countries by cases"} />
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="col-sm-6">
                <Select
                  isClearable={false}
                  isSearchable={false}
                  onChange={(selectedOption) => {
                    this.props.onChange(selectedOption);
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
          <div className="gradient-card">
            <GradientCardTitle title={"Fatality Rate By Age"} />
            <SimpleLineChart
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={totalDeathsByAge}
              labels={["Rate (%)"]}
              colors={["#192a56"]}
            />
            <GradientCardFooter
              content={
                "The percentages do not have to add up to 100%, as they do NOT represent share of deaths by age group."
              }
            />
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Fatality Rate By Gender"} />
            <div style={{ marginBottom: -24 }}>
              <span style={{ color: "#192a56", fontWeight: "bold" }}>
                Male{" "}
                {deathsBySex.length !== 0
                  ? deathsBySex.filter((stat) => stat.name === "Male")[0].value
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
                  ? deathsBySex.filter((stat) => stat.name === "Female")[0]
                      .value
                  : 0}
              </span>
            </div>
            <SimplePieChart data={deathsBySex} />
            <GradientCardFooter
              content={
                "The percentages do not have to add up to 100%, as they do NOT represent share of deaths by age group."
              }
            />
          </div>
        </div>
        <div className="col-sm-6 col-12">
          <div className="gradient-card">
            <GradientCardTitle title={"Fatality Rate By Comorbility"} />
            <SimpleLineChart
              chart={"BarChart"}
              customTooltip={true}
              grid={false}
              data={totalDeathsByCom}
              labels={["Rate (%)", "Rate in confirmed cases(%)"]}
              colors={["#192a56", "#192a56"]}
            />
            <GradientCardFooter
              content={
                "The percentages do not have to add up to 100%, as they do NOT represent share of deaths by age group."
              }
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Analytics;
