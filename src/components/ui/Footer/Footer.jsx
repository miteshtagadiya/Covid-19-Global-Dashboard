import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = (props) => {
  return (
    <div style={{ padding: 15 }}>
      <div
        style={{
          fontWeight: "bold",
          display: "flex",
          justifyContent: "center",
          fontSize: 22,
          paddingBottom: 15,
        }}
      >
        <div
          style={{
            border: "3px solid white",
            padding: "5px 25px",
            borderRadius: 5,
            background: "white",
            color: "#404b69",
            cursor: "pointer",
          }}
        >
          <a
            style={{ textDecoration: "none", color: "#404b69" }}
            href="https://github.com/miteshtagadiya/Covid-19-Global-Dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span style={{ marginRight: 10 }}>
              <FontAwesomeIcon icon={["fab", "github"]} className="github" />
            </span>
            Github
          </a>
        </div>
      </div>
      <div>
        Designed and Developed by{"  "}
        <a
          style={{
            color: "#f6565b",
            fontWeight: "bold",
            textDecoration: "none",
          }}
          href="https://miteshtagadiya.js.org"
          rel="noopener noreferrer"
          target="_blank"
        >
          Mitesh Tagadiya
        </a>
      </div>
    </div>
  );
};

export default Footer;
