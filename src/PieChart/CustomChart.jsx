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
          //console.log(props.rows[(Object.values(selectedItem[0]))])
          chartWrapper.getChart().setSelection([]);
        } else {
          var selectedItem = chartWrapper.getChart().getSelection()[0];
          if (selectedItem) {
            // console.log(
            //   "The user selected " +
            //     Object.values(selectedItem) +
            //     props.rows[Object.values(selectedItem)[0]][0]
            // );
            props.onPlotClick(props.rows[Object.values(selectedItem)[0]][0]);
          }
        }
      },
    },
  ];
  return (
    <Chart
      className="custom-charts"
      //      width={"500px"}
      height={props.height ? props.height : "300px"}
      width={props.width ? props.width : "auto"}
      //width={props.width ? props.width : "100%"}
      chartType={props.chartType ? props.chartType : "Bar"}
      //loader={<Skeleton active paragraph={{ rows: 1 }} />}
      // data={props.data ? props.data :[
      //   ["Year", "Sales", "Expenses"],
      //   ["2013", 1000, 400],
      //   ["2014", null, 460],
      //   ["2015", 660, 1120],
      //   ["2016", 1030, 540]
      // ]}
      rows={props.rows}
      columns={props.columns}
      options={{
        sliceVisibilityThreshold: 0,
        headerHeight: 0,
        backgroundColor: "transparent",
        colors: [
          "#262b2f",
          "#214559",
          "#00626f",
          "#00022e",
          "#2b6867",
          "#29304e",
          "#000133",
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
