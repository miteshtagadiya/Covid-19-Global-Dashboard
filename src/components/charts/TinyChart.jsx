import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
} from "recharts";

export default class TinyChart extends PureComponent {
  state = { width: 0, height: 0 };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    return (
      <LineChart
        width={this.state.width < 1439 ? 100 : 250}
        height={this.state.width < 250 ? 30 : 50}
        data={this.props.data}
      >
        <Line
          type="monotone"
          dataKey={this.props.label}
          stroke={this.props.color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    );
  }
}
