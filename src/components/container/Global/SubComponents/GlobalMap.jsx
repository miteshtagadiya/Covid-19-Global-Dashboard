import React, { Component } from "react";
import MapSwitchBar from "components/ui/MapSwitchBar/MapSwitchBar";
import DataMap from "components/charts/DataMap/DataMap";
import ReactTooltip from "react-tooltip";

class GlobalMap extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    return (
      <div className="row" style={{ marginTop: 20 }}>
        <div className="col-sm-12 col-12" style={{ minHeight: "368px" }}>
          <div className="global-map">
            <MapSwitchBar
              mapFilter={this.props.mapFilter}
              options={["Confirmed", "Recovered", "Deaths"]}
              optionValues={["confirmed", "recovered", "deaths"]}
              colors={[
                "rgb(68, 138, 255)",
                "rgb(76, 175, 80)",
                "rgb(255, 82, 82)",
              ]}
              onClick={(prop) => this.props.onMapSwitch(prop)}
            />
            <DataMap
              mapFilter={this.props.mapFilter}
              data={
                this.props.globalData.length !== 0
                  ? this.props.globalData.filter(
                      (location) => location.title !== "World"
                    )
                  : []
              }
              setTooltipContent={(content) =>
                this.props.onSetTooltipContent(content)
              }
            />
            <ReactTooltip>
              {this.props.setTooltipContent.length !== 0 ? (
                <div>
                  <span
                    style={{
                      color: this.renderTooltipLabelColor(
                        Object.keys(this.props.setTooltipContent[0])
                      ),
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {Object.values(this.props.setTooltipContent[0])}
                  </span>
                  <br />
                  <span
                    style={{
                      color: this.renderTooltipLabelColor(
                        Object.keys(this.props.setTooltipContent[0])
                      ),
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {Object.keys(this.props.setTooltipContent[1])} {": "}
                    {Object.values(this.props.setTooltipContent[1])}{" "}
                    <span style={{ fontSize: 20, fontWeight: "bold" }}>
                      &#9650;
                    </span>
                    {Object.values(this.props.setTooltipContent[5])}
                  </span>
                  <br />
                  <span
                    style={{
                      color: this.renderTooltipLabelColor(
                        Object.keys(this.props.setTooltipContent[2])
                      ),
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {Object.keys(this.props.setTooltipContent[2])} {": "}
                    {Object.values(this.props.setTooltipContent[2])}{" "}
                    <span style={{ fontSize: 20, fontWeight: "bold" }}>
                      &#9650;
                    </span>
                    {Object.values(this.props.setTooltipContent[4])}
                  </span>
                  <br />
                  <span
                    style={{
                      color: this.renderTooltipLabelColor(
                        Object.keys(this.props.setTooltipContent[3])
                      ),
                      fontWeight: "bold",
                      fontSize: 16,
                    }}
                  >
                    {Object.keys(this.props.setTooltipContent[3])} {": "}
                    {Object.values(this.props.setTooltipContent[3])}
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
    );
  }
}

export default GlobalMap;
