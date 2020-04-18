import React, { Component } from "react";
import SimpleLineChart from "components/charts/SimpleLineChart/SimpleLineChart";
import SwitchBar from "components/ui/SwitchBar/SwitchBar";
import Virus from "assets/virus.gif";

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      changeChart: "Confirmed",
    };
  }

  render() {
    let colors = {
      Confirmed: "#e43339",
      Recovered: "#006266",
      Deaths: "#535c68",
    };

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
        confirmed += Number(data[i][code]);
      }
      return confirmed;
    };

    return (
      <div className="row india-state-card">
        {this.props.locationLoader === true ? (
          <div>
            <img src={Virus} alt="Loader" />
          </div>
        ) : this.props.india.length !== 0 ? (
          this.props.india.statewise
            .filter((location) =>
              location.state
                .toLowerCase()
                .includes(this.props.searchString.toLowerCase())
            )
            .map((location, index) => {
              let f = dailyConfirmedStatus.map((data1, index) => {
                return {
                  name: data1["date"],
                  Confirmed: count(
                    location.statecode.toLowerCase(),
                    dailyConfirmedStatus,
                    index
                  ),
                  Recovered: count(
                    location.statecode.toLowerCase(),
                    dailyRecoveredStatus,
                    index
                  ),
                  Deaths: count(
                    location.statecode.toLowerCase(),
                    dailyDeathsStatus,
                    index
                  ),
                };
              });

              return location.state !== "Total" ? (
                <div key={index} className="col-sm-4" style={{ padding: 15 }}>
                  <div className="state-card">
                    <label className="state-card-label">{location.state}</label>
                    <br />
                    <div
                      className="row justify-content-center"
                      style={{ paddingTop: 15, paddingBottom: 15 }}
                    >
                      <div className="state-card-style">
                        <div>{location.confirmed}</div>
                        <div
                          className="state-card-info"
                          style={{
                            color: "#e43339",
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: "bold" }}>
                            &#9650;
                          </span>
                          {location.deltaconfirmed}
                        </div>
                        <div>Confirmed</div>
                      </div>
                      <div className="state-card-style">
                        <div style={{ marginBottom: 22 }}>
                          {location.active}
                        </div>
                        <div>Active</div>
                      </div>
                      <div className="state-card-style">
                        <div>{location.recovered}</div>
                        <div
                          className="state-card-info"
                          style={{
                            color: "#006266",
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: "bold" }}>
                            &#9650;
                          </span>
                          {location.deltarecovered}
                        </div>

                        <div>Recovered</div>
                      </div>
                      <div className="state-card-style">
                        <div>{location.deaths}</div>
                        <div
                          className="state-card-info"
                          style={{
                            color: "#535c68",
                          }}
                        >
                          <span style={{ fontSize: 15, fontWeight: "bold" }}>
                            &#9650;
                          </span>
                          {location.deltadeaths}
                        </div>
                        <div>Deaths</div>
                      </div>
                    </div>
                    <div>
                      <SwitchBar
                        options={["Conf.", "Recv.", "Deaths"]}
                        optionValues={["Confirmed", "Recovered", "Deaths"]}
                        onClick={(prop) => {
                          this.setState({
                            changeChart: prop,
                          });
                        }}
                        showGlobalChartType={this.state.changeChart}
                      />
                      <SimpleLineChart
                        chart={"AreaChart"}
                        customTooltip={true}
                        grid={false}
                        data={f}
                        labels={[this.state.changeChart]}
                        colors={[colors[this.state.changeChart]]}
                      />
                    </div>
                  </div>
                </div>
              ) : null;
            })
        ) : null}
      </div>
    );
  }
}

export default Cards;
