import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./SimpleLineChart.css";

const SimpleLineChart = (props) => {
  const data =
    props.data === undefined
      ? [
          { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
          { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
          { name: "March", uv: 2000, pv: 9800, amt: 2290 },
          { name: "April", uv: 2780, pv: 3908, amt: 2000 },
          { name: "May", uv: 1890, pv: 4800, amt: 2181 },
          { name: "June", uv: 2390, pv: 3800, amt: 2500 },
          { name: "July", uv: 3490, pv: 4300, amt: 2100 },
        ]
      : props.data;

  const getIntroOfPage = (label) => {
    if (label === "Page A") {
      return "Page A is about men's clothing";
    }
    if (label === "Page B") {
      return "Page B is about women's dress";
    }
    if (label === "Page C") {
      return "Page C is about women's bag";
    }
    if (label === "Page D") {
      return "Page D is about household goods";
    }
    if (label === "Page E") {
      return "Page E is about food";
    }
    if (label === "Page F") {
      return "Page F is about baby food";
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "white", padding: 15, borderRadius: 10 }}
        >
          <p
            style={{ textAlign: "center", fontWeight: "bold", color: "black" }}
          >
            {label}
          </p>
          {typeof payload !== "undefined" &&
            payload !== null &&
            payload.map((item, index) => {
              return (
                <div key={index}>
                  <span style={{ color: item.color, fontWeight: "bold" }}>
                    {item.name}:{" "}
                  </span>
                  <span style={{ color: item.color, fontWeight: "bold" }}>
                    {item.value}
                    {typeof props.data.filter(
                      (data) => data?.name === item.payload.name
                    )[0][`daily${item.name}`] === "undefined"
                      ? null
                      : " [+"}
                    {
                      props.data.filter(
                        (data) => data?.name === item.payload.name
                      )[0][`daily${item.name}`]
                    }
                    {/* {props.data[payload.payload.name][`daily${payload.name}`]} */}
                    {typeof props.data.filter(
                      (data) => data?.name === item.payload.name
                    )[0][`daily${item.name}`] === "undefined"
                      ? null
                      : "]"}
                  </span>
                  <br />
                </div>
              );
            })}
        </div>
      );
    }

    return null;
  };
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
          {props.customTooltip ? (
            <Tooltip content={<CustomTooltip />} />
          ) : (
            <Tooltip />
          )}
          <Legend
            layout={props.legendLayout ? props.legendLayout : "horizontal"}
            margin={{ top: 0, left: 0, right: 0, bottom: 10 }}
            verticalAlign={props.verticalAlign ? props.verticalAlign : "bottom"}
          />
          {props.labels.map((label, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={label}
              stroke={props.colors[index]}
              activeDot={{ r: 8 }}
              fill={props.colors[index]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;
