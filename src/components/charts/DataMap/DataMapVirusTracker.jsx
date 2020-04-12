import React from "react";
import { scaleLog } from "d3-scale";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLog()
  .domain([1, 10])
  .range([
    "#ffedea",
    "#ffcec5",
    "#ffad9f",
    "#ff8a75",
    "#ff5533",
    "#e2492d",
    "#be3d26",
    "#9a311f",
    "#782618",
  ]);

const MapChart = ({ setTooltipContent, data, mapFilter }) => {
  return (
    <ComposableMap
      height={550}
      width={700}
      data-tip=""
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147,
      }}
    >
      {data.length > 0 && (
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const d = data.find((s) => s.code === geo.properties.ISO_A2);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    if (
                      typeof d !== "undefined" &&
                      typeof d.title !== "undefined"
                    ) {
                      setTooltipContent([
                        { title: d.title },
                        { Confirmed: d.total_cases },
                        { Deaths: d.total_deaths },
                        { Recovered: d.total_recovered },
                      ]);
                    }
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={{
                    hover: {
                      fill: "#F53",
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      outline: "none",
                    },
                  }}
                  fill={d ? colorScale(Number(d[mapFilter])) : "#F5F4F6"}
                />
              );
            })
          }
        </Geographies>
      )}
    </ComposableMap>
  );
};

export default MapChart;
