import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import "./SimpleLineChart.css";

const SimpleLineChart = props => {
  const data =
    props.data === undefined
      ? [
          { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
          { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
          { name: "March", uv: 2000, pv: 9800, amt: 2290 },
          { name: "April", uv: 2780, pv: 3908, amt: 2000 },
          { name: "May", uv: 1890, pv: 4800, amt: 2181 },
          { name: "June", uv: 2390, pv: 3800, amt: 2500 },
          { name: "July", uv: 3490, pv: 4300, amt: 2100 }
        ]
      : props.data;
  return (
    <div
      className="container-Linechart"
      style={props.height ? { height: props.height } : { height: 270 }}
    >
      <ResponsiveContainer>
        <LineChart
          width={500}
          height={100}
          data={data}

          //   data={data}
          //   margin={{
          //     top: 5,
          //     right: 30,
          //     left: 20,
          //     bottom: 5
          //   }}
        >
          {props.grid === false ? null : (
            <CartesianGrid strokeDasharray="3 3" />
          )}

          <XAxis hide={false} dataKey={props.axis ? props.axis : "name"} />

          <YAxis />
          <Tooltip />
          <Legend
            layout={props.legendLayout ? props.legendLayout : "horizontal"}
            margin={{ top: 0, left: 0, right: 0, bottom: 10 }}
            verticalAlign={props.verticalAlign ? props.verticalAlign : "bottom"}
          />
          <Line
            type="monotone"
            dataKey={props.label1 ? props.label1 : "pv"}
            stroke="#561845"
            activeDot={{ r: 8 }}
            fill="#561845"
            dot={false}
          />
          <Line type="monotone" dataKey={props.label2} stroke="#c23616" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;
