import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLog } from "d3-scale";
import ReactTooltip from "react-tooltip";
import "./indiaMap.css";
import { useEffect } from "react";

const INDIA_TOPO_JSON = require("./india.topo.json");

const PROJECTION_CONFIG = {
  scale: 350,
  center: [78.9629, 22.5937], // always in [East Latitude, North Longitude]
};

// Red Variants
const COLOR_RANGE = ["#ffedea", "#ffcec5", "#ffad9f"];

const DEFAULT_COLOR = "#EEE";

const geographyStyle = {
  default: {
    outline: "none",
  },
  hover: {
    fill: "#F53",
    transition: "all 250ms",
    outline: "none",
  },
  pressed: {
    outline: "none",
  },
};

function useWindowSize() {
  const isClient = typeof window === "object";

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return false;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

const IndiaMap = ({ data, onStateClick }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const size = useWindowSize();

  const colorScale = scaleLog().domain([1, 10]).range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: "NA" }) => {
    return () => {
      setTooltipContent(current);
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  return (
    <div className="indiamap">
      {tooltipContent !== "" ? (
        <ReactTooltip>
          <div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(64, 75, 105)",
              }}
            >
              {tooltipContent.state}
            </span>
            <br />
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(228, 51, 57)",
              }}
            >
              {"Confirmed: "}
              {tooltipContent.confirmed}{" "}
              {tooltipContent.deltaconfirmed !== "0" ? (
                <span style={{ fontSize: 17, fontWeight: "bold" }}>
                  &#9650; {tooltipContent.deltaconfirmed}
                </span>
              ) : null}
            </span>
            <br />
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(25, 42, 86)",
              }}
            >
              {"Active: "}
              {tooltipContent.active}
            </span>
            <br />
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(0, 98, 102)",
              }}
            >
              {"Recovered: "}
              {tooltipContent.recovered}
              {tooltipContent.deltaconfirmed !== "0" ? (
                <span style={{ fontSize: 17, fontWeight: "bold" }}>
                  &#9650; {tooltipContent.deltarecovered}
                </span>
              ) : null}
            </span>
            <br />
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(83, 92, 104)",
              }}
            >
              {"Deaths: "}
              {tooltipContent.deaths}
              {tooltipContent.deltaconfirmed !== "0" ? (
                <span style={{ fontSize: 17, fontWeight: "bold" }}>
                  &#9650; {tooltipContent.deltadeaths}
                </span>
              ) : null}
            </span>
            <br />
          </div>
        </ReactTooltip>
      ) : null}
      <ComposableMap
        projectionConfig={PROJECTION_CONFIG}
        projection="geoMercator"
        height={
          size.width < 1500 && size.width > 768
            ? 200
            : size.width <= 768 && size.width > 400
            ? 150
            : size.width <= 400
            ? 120
            : Math.floor(size.width / 10)
        }
        width={
          size.width < 1500 && size.width > 768
            ? 500
            : size.width <= 768 && size.width > 400
            ? 300
            : size.width <= 400
            ? 220
            : Math.floor(size.width / 5)
        }
        data-tip=""
      >
        <Geographies geography={INDIA_TOPO_JSON}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const current = data.find((s) => s.statecode === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={current ? colorScale(current.active) : DEFAULT_COLOR}
                  style={geographyStyle}
                  onClick={() => onStateClick(current)}
                  onMouseEnter={onMouseEnter(geo, current)}
                  onMouseLeave={onMouseLeave}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default IndiaMap;
