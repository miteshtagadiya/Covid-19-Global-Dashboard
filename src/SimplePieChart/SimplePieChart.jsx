import React from "react";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "../SimpleLineChart/SimpleLineChart.css";

const COLORS = ["#192a56", "rgb(255, 82, 82)"];

const SimplePieChart = (props) => {
  return (
    <div
      className="container-Linechart"
      style={props.height ? { height: props.height } : { height: 270 }}
    >
      <ResponsiveContainer>
        <PieChart>
          <Pie
            dataKey="value"
            data={props.data}
            outerRadius={100}
            fill="#8884d8"
            label={false}
          >
            {props.data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SimplePieChart;
