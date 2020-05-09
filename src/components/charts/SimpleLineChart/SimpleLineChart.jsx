import React from "react";
import {
  LineChart,
  BarChart,
  AreaChart,
  Area,
  Line,
  Bar,
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: "white", padding: 15, borderRadius: 10 }}
        >
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              color: "#404b69",
            }}
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

  let ChartName = (chart) => {
    switch (chart) {
      case "LineChart":
        return LineChart;
      case "BarChart":
        return BarChart;
      case "AreaChart":
        return AreaChart;
      default:
        return LineChart;
    }
  };

  let selectChart = (chart) => {
    switch (chart) {
      case "LineChart":
        return Line;
      case "BarChart":
        return Bar;
      case "AreaChart":
        return Area;
      default:
        return Line;
    }
  };

  let Chart = selectChart(props.chart);
  let Type = ChartName(props.chart);
  return (
    <div
      className="container-Linechart"
      style={props.height ? { height: props.height } : { height: 270 }}
    >
      <ResponsiveContainer>
        <Type
          layout={props.layout ? props.layout : "horizontal"}
          width={500}
          height={100}
          data={data}
          margin={
            props.layout && props.layout === "vertical"
              ? {
                  left: 20,
                }
              : {}
          }
        >
          <CartesianGrid strokeDasharray="3 3" />
          {props.layout && props.layout === "vertical" ? (
            <XAxis type="number" />
          ) : (
            <XAxis hide={false} dataKey={props.axis ? props.axis : "name"} />
          )}
          {props.layout && props.layout === "vertical" ? (
            <YAxis
              type="category"
              hide={false}
              dataKey={props.axis ? props.axis : "name"}
            />
          ) : (
            <YAxis />
          )}
          {props.customTooltip ? (
            <Tooltip content={<CustomTooltip />} />
          ) : (
            <Tooltip />
          )}
          {typeof props.legend === "undefined" || props.legend === true ? (
            <Legend
              layout={props.legendLayout ? props.legendLayout : "horizontal"}
              margin={{ top: 0, left: 0, right: 0, bottom: 10 }}
              verticalAlign={
                props.verticalAlign ? props.verticalAlign : "bottom"
              }
            />
          ) : null}
          {props.labels.map((label, index) =>
            props.chart === "BarChart" ? (
              <Chart
                key={index}
                stackId={"a"}
                type="monotone"
                dataKey={label}
                stroke={props.colors[index]}
                fill={props.colors[index]}
              />
            ) : (
              <Chart
                key={index}
                stackId={"a"}
                type="monotone"
                dataKey={label}
                stroke={props.colors[index]}
                activeDot={{ r: 8 }}
                fill={props.colors[index]}
                dot={false}
              />
            )
          )}
        </Type>
      </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;
