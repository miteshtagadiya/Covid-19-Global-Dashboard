import * as React from "react";
import { Chart } from "react-google-charts";
import "./CustomChart.css";

const CustomChart = (props) => {
  const chartEvents = [
    {
      eventName: "select",
      callback({ chartWrapper }) {
        if (props.chartType === "TreeMap") {
          let selectedItem = chartWrapper.getChart().getSelection()[0];
          props.onPlotClick(props.rows[selectedItem.row]);
          chartWrapper.getChart().setSelection([]);
        } else {
          var selectedItem = chartWrapper.getChart().getSelection()[0];
          if (selectedItem) {
            props.onPlotClick(props.rows[Object.values(selectedItem)[0]][0]);
          }
        }
      },
    },
  ];
  return (
    <Chart
      className="custom-charts"
      height={props.height ? props.height : "300px"}
      width={props.width ? props.width : "auto"}
      chartType={props.chartType ? props.chartType : "Bar"}
      rows={props.rows}
      columns={props.columns}
      options={{
        sliceVisibilityThreshold: 0,
        headerHeight: 0,
        backgroundColor: "transparent",
        colors: [
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
          "#004953",
          "#062e03",
          "#7f4330",
          "#420303",
          "#980036",
          "#9c004a",
          "#490648",
          "#76424e",
          "#36013f",
          "#36013f",
          "#333333",
          "#25342b",
          "#171717",
        ],
        minColor: "#A7A0B3",
        midColor: "#88E3CA",
        maxColor: "#E0AEF6",
        chartArea: props.chartArea
          ? props.chartArea
          : { left: 0, top: 10, right: 0 },
        //height: props.height ? props.height : 300,

        //width: props.width ? props.width : "100%",
        // title: "Company Performance",
        isStacked: props.isStacked === true ? true : false,
        legend: props.legend
          ? { position: "none" }
          : props.legendPosition
          ? props.legendPosition
          : {
              position: "right",
              alignment: "center",
            },
        hAxis: props.hAxis
          ? {
              title: "",
              textPosition: "none",
              textColor: "#ffffff",
            }
          : { title: props.title, titleTextStyle: { color: "#333" } },
        vAxis: props.vAxis
          ? {
              textPosition: "none",
            }
          : { minValue: 0 },
        generateTooltip:
          props.generateTooltip === true
            ? (row, size, value) => {
                return (
                  '<div style="background:#fff; padding:5px 10px 5px 10px; border:1px solid grey"><b>' +
                  props.rows[row][0] +
                  "</b> : " +
                  size +
                  "</div>"
                );
              }
            : null,
        // For the legend to fit, we make the chart area smaller
        //chartArea: { width: "50%", height: "70%" }
        // lineWidth: 25
      }}
      // For tests
      rootProps={{ "data-testid": "2" }}
      chartEvents={props.onplot === true ? chartEvents : null}
    />
  );
};
export default CustomChart;
