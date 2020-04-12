import React from "react";
import { scaleLog } from "d3-scale";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import Countrys from "./ISO2.json";

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
              const d = data.find(
                (s) => Countrys[s.title] === geo.properties.ISO_A2
              );
              //VirusTracker
              // const d = data.find((s) => s.code === geo.properties.ISO_A2);
              //Covid19Info
              // const d = data.find(
              //   (s) => Object.keys(s)[0] === geo.properties.ISO_A3
              // );
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    if (typeof d !== "undefined") {
                      setTooltipContent([
                        { title: geo.properties.NAME_LONG },
                        { Confirmed: d.confirmed === "" ? 0 : d.confirmed },
                        { Deaths: d.deaths === "" ? 0 : d.deaths },
                        { Recovered: d.recovered === "" ? 0 : d.recovered },
                        {
                          DeathsToday:
                            d.deaths_today === "" ? 0 : d.deaths_today,
                        },
                        {
                          ConfirmedToday:
                            d.confirmed_today === "" ? 0 : d.confirmed_today,
                        },
                      ]);
                      // VirusTracker
                      // setTooltipContent([
                      //   { title: d.title },
                      //   { Confirmed: d.total_cases },
                      //   { Deaths: d.total_deaths },
                      //   { Recovered: d.total_recovered },
                      // ]);
                      // //Covid19Info
                      // setTooltipContent([
                      //   { title: Object.keys(d)[0] },
                      //   { Confirmed: Object.values(d)[0].confirmed },
                      //   { Deaths: Object.values(d)[0].deaths },
                      //   { Recovered: Object.values(d)[0].recovered },
                      // ]);
                    } else {
                      setTooltipContent([
                        { title: geo.properties.NAME },
                        { Confirmed: 0 },
                        { Deaths: 0 },
                        { Recovered: 0 },
                        { DeathsToday: 0 },
                        { ConfirmedToday: 0 },
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
                  fill={
                    d
                      ? colorScale(Number(d[mapFilter]))
                      : // ? colorScale(Number(Object.values(d)[0][mapFilter])) // covid19Info
                        "#F5F4F6"
                  }
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
