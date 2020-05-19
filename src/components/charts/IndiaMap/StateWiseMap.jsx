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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getScale = (name) => {
    switch (name) {
      case "andamannicobarislands":
        return 1000;
      case "arunachalpradesh":
        return 2200;
      case "andhrapradesh":
        return 1300;
      case "assam":
        return 2200;
      case "bihar":
        return 2700;
      case "chandigarh":
        return 3000;
      case "chhattisgarh":
        return 1600;
      case "dadranagarhaveli":
        return 10000;
      case "delhi":
        return 23000;
      case "karnataka":
        return 1600;
      case "kerala":
        return 2400;
      case "goa":
        return 12000;
      case "gujarat":
        return 2100;
      case "haryana":
        return 3300;
      case "himachalpradesh":
        return 3400;
      case "jammukashmir":
        return 3700;
      case "jharkhand":
        return 2800;
      case "ladakh":
        return 3300;
      case "lakshadweep":
        return 2000;
      case "madhyapradesh":
        return 1400;
      case "maharashtra":
        return 1500;
      case "manipur":
        return 5000;
      case "meghalaya":
        return 4300;
      case "mizoram":
        return 4400;
      case "nagaland":
        return 5500;
      case "odisha":
        return 2100;
      case "puducherry":
        return 2000;
      case "punjab":
        return 3500;
      case "rajasthan":
        return 1400;
      case "sikkim":
        return 6000;
      case "nadu":
        return 580;
      case "telangana":
        return 2600;
      case "tripura":
        return 6000;
      case "uttarakhand":
        return 3600;
      case "uttarpradesh":
        return 1500;
      case "westbengal":
        return 2000;
      default:
        return 2100;
    }
  };

  const getCenter = (name) => {
    switch (name) {
      case "andamannicobarislands":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "arunachalpradesh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.5,
        ];
      case "andhrapradesh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 4,
        ];
      case "assam":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "bihar":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 2.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.5,
        ];
      case "chandigarh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "chhattisgarh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 3.2,
        ];
      case "dadranagarhaveli":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 0.2,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.8,
        ];
      case "delhi":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 0.2,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.25,
        ];
      case "karnataka":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 3.5,
        ];
      case "kerala":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 2,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "goa":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 0.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.5,
        ];
      case "gujarat":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2.5,
        ];
      case "haryana":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.7,
        ];
      case "himachalpradesh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.6,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.5,
        ];
      case "jammukashmir":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.5,
        ];
      case "jharkhand":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 2.2,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.7,
        ];
      case "ladakh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "lakshadweep":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] - 2,
          getGeoFile(stateName)["transform"]["translate"][1] + 1,
        ];
      case "madhyapradesh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 4,
          getGeoFile(stateName)["transform"]["translate"][1] + 3,
        ];
      case "maharashtra":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3.7,
          getGeoFile(stateName)["transform"]["translate"][1] + 3.3,
        ];
      case "manipur":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1,
          getGeoFile(stateName)["transform"]["translate"][1] + 1,
        ];
      case "meghalaya":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.7,
        ];
      case "mizoram":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.3,
        ];
      case "nagaland":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.9,
        ];
      case "odisha":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2.5,
        ];
      case "puducherry":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "punjab":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.4,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.5,
        ];
      case "rajasthan":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 4,
          getGeoFile(stateName)["transform"]["translate"][1] + 3.5,
        ];
      case "sikkim":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 0.3,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.5,
        ];
      case "nadu":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 5,
          getGeoFile(stateName)["transform"]["translate"][1] + 11,
        ];
      case "telangana":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.5,
          getGeoFile(stateName)["transform"]["translate"][1] + 2,
        ];
      case "tripura":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 0.6,
          getGeoFile(stateName)["transform"]["translate"][1] + 0.8,
        ];
      case "uttarakhand":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 1.6,
          getGeoFile(stateName)["transform"]["translate"][1] + 1.4,
        ];
      case "uttarpradesh":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 3.4,
        ];
      case "westbengal":
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 3,
        ];
      default:
        return [
          getGeoFile(stateName)["transform"]["translate"][0] + 3,
          getGeoFile(stateName)["transform"]["translate"][1] + 2.5,
        ];
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
      <ComposableMap
        projectionConfig={{
          scale: getScale(stateName),
          center: getCenter(stateName),
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
