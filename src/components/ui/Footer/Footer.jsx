import React from "react";

const Footer = (props) => {
  return (
    <div style={{ padding: 15 }}>
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
  );
};

export default Footer;
