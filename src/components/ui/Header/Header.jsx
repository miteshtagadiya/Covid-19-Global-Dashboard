import React from "react";
import Github from "../../../assets/github1.png";
import IndiaIcon from "../../../assets/india.png";
import World from "../../../assets/world.png";
import "./Header.sass";

const Header = (props) => {
  return (
    <div>
      <div className="Header">
        Covid-19 {props.dashboard} {props.width < 1024 ? "" : " Dashboard"}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={Github} alt="github" className="github-icon" />
        </a>
      </div>
      <div className="Switch-dashboard">
        <img
          onClick={() => props.history.push("/india")}
          src={IndiaIcon}
          alt="India"
          className="india-icon"
        />
        <span style={{ fontWeight: "bold" }}>Switch</span>
        <img
          onClick={() => props.history.push("/")}
          src={World}
          alt="World"
          className="global-icon"
        />
      </div>
    </div>
  );
};

export default Header;
