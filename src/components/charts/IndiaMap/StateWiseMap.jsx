import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLog } from "d3-scale";
import ReactTooltip from "react-tooltip";
import "./indiaMap.css";
import { useEffect } from "react";
const INDIA_TOPO_JSON = require("./india.topo.json");
const andamannicobarislands = require("./states/andamannicobarislands.json");
const arunachalpradesh = require("./states/arunachalpradesh.json");
const andhrapradesh = require("./states/andhrapradesh.json");
const assam = require("./states/assam.json");
const bihar = require("./states/bihar.json");
const chandigarh = require("./states/chandigarh.json");
const chhattisgarh = require("./states/chhattisgarh.json");
const dadranagarhaveli = require("./states/dadranagarhaveli.json");
const delhi = require("./states/delhi.json");
const karnataka = require("./states/karnataka.json");
const kerala = require("./states/kerala.json");
const goa = require("./states/goa.json");
const gujarat = require("./states/gujarat.json");
const haryana = require("./states/haryana.json");
const himachalpradesh = require("./states/himachalpradesh.json");
const jammukashmir = require("./states/jammukashmir.json");
const jharkhand = require("./states/jharkhand.json");
const ladakh = require("./states/ladakh.json");
const lakshadweep = require("./states/lakshadweep.json");
const madhyapradesh = require("./states/madhyapradesh.json");
const maharashtra = require("./states/maharashtra.json");
const manipur = require("./states/manipur.json");
const meghalaya = require("./states/meghalaya.json");
const mizoram = require("./states/mizoram.json");
const nagaland = require("./states/nagaland.json");
const odisha = require("./states/odisha.json");
const puducherry = require("./states/puducherry.json");
const punjab = require("./states/punjab.json");
const rajasthan = require("./states/rajasthan.json");
const sikkim = require("./states/sikkim.json");
const nadu = require("./states/tamil-nadu.json");
const telangana = require("./states/telangana.json");
const tripura = require("./states/tripura.json");
const uttarakhand = require("./states/uttarakhand.json");
const uttarpradesh = require("./states/uttarpradesh.json");
const westbengal = require("./states/westbengal.json");
const STATE_TOPO_JSON = require("./states/andamannicobarislands.json");

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
  }, []);

  return windowSize;
}

const StateWiseMap = ({ data, stateName }) => {
  const [tooltipContent, setTooltipContent] = useState("");
  const size = useWindowSize();

  const colorScale = scaleLog().domain([1, 10]).range(COLOR_RANGE);

  const onMouseEnter = (geo, current = { value: "NA" }) => {
    return () => {
      setTooltipContent({ ...current, geo });
    };
  };

  const onMouseLeave = () => {
    setTooltipContent("");
  };

  const getGeoFile = (name) => {
    switch (name) {
      case "andamannicobarislands":
        return andamannicobarislands;
      case "arunachalpradesh":
        return arunachalpradesh;
      case "andhrapradesh":
        return andhrapradesh;
      case "assam":
        return assam;
      case "bihar":
        return bihar;
      case "chandigarh":
        return chandigarh;
      case "chhattisgarh":
        return chhattisgarh;
      case "dadranagarhaveli":
        return dadranagarhaveli;
      case "delhi":
        return delhi;
      case "karnataka":
        return karnataka;
      case "kerala":
        return kerala;
      case "goa":
        return goa;
      case "gujarat":
        return gujarat;
      case "haryana":
        return haryana;
      case "himachalpradesh":
        return himachalpradesh;
      case "jammukashmir":
        return jammukashmir;
      case "jharkhand":
        return jharkhand;
      case "ladakh":
        return ladakh;
      case "lakshadweep":
        return lakshadweep;
      case "madhyapradesh":
        return madhyapradesh;
      case "maharashtra":
        return maharashtra;
      case "manipur":
        return manipur;
      case "meghalaya":
        return meghalaya;
      case "mizoram":
        return mizoram;
      case "nagaland":
        return nagaland;
      case "odisha":
        return odisha;
      case "puducherry":
        return puducherry;
      case "punjab":
        return punjab;
      case "rajasthan":
        return rajasthan;
      case "sikkim":
        return sikkim;
      case "nadu":
        return nadu;
      case "telangana":
        return telangana;
      case "tripura":
        return tripura;
      case "uttarakhand":
        return uttarakhand;
      case "uttarpradesh":
        return uttarpradesh;
      case "westbengal":
        return westbengal;
      default:
        return gujarat;
    }
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
              {tooltipContent.geo.properties.district}
            </span>
            <br />
            <span
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: "rgb(228, 51, 57)",
              }}
            >
              {typeof tooltipContent.confirmed !== "undefined"
                ? "Confirmed: "
                : "Confirmed: 0"}

              {typeof tooltipContent.confirmed !== "undefined"
                ? tooltipContent.confirmed
                : null}
              {typeof tooltipContent.confirmed !== "undefined" ? (
                Number(tooltipContent.delta.confirmed) !== 0 ? (
                  <span style={{ fontSize: 17, fontWeight: "bold" }}>
                    &#9650; {tooltipContent.delta.confirmed}
                  </span>
                ) : null
              ) : null}
            </span>
          </div>
        </ReactTooltip>
      ) : null}
      {console.log(stateName)}
      {console.log(getGeoFile(stateName)["transform"]["translate"])}
      <ComposableMap
        projectionConfig={{
          scale: 1000,
          center: [
            getGeoFile(stateName)["transform"]["translate"][0] + 3,
            getGeoFile(stateName)["transform"]["translate"][1] + 2,
          ],
        }}
        projection="geoMercator"
        height={
          size.width < 1500 && size.width > 768
            ? 500
            : size.width <= 768 && size.width > 400
            ? 400
            : size.width <= 400
            ? 120
            : Math.floor(size.width / 10)
        }
        width={
          size.width < 1500 && size.width > 768
            ? 900
            : size.width <= 768 && size.width > 400
            ? 600
            : size.width <= 400
            ? 220
            : Math.floor(size.width / 5)
        }
        data-tip=""
      >
        <Geographies geography={getGeoFile(stateName)}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const current = Object.keys(data).find(
                (s) => s === geo.properties.district
              );

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    data[current]
                      ? colorScale(data[current].confirmed)
                      : DEFAULT_COLOR
                  }
                  style={geographyStyle}
                  onMouseEnter={onMouseEnter(geo, data[current])}
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

export default StateWiseMap;
