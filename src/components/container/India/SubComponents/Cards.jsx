import React, { Component } from "react";
import Virus from "assets/virus.gif";

class Cards extends Component {
  render() {
    return (
      <div className="row">
        {this.props.locationLoader === true ? (
          <div>
            <img src={Virus} alt="Loader" />
          </div>
        ) : this.props.india.length !== 0 ? (
          this.props.india.statewise
            .filter((location) =>
              location.state
                .toLowerCase()
                .includes(this.props.searchString.toLowerCase())
            )
            .map((location, index) => {
              return location.state !== "Total" ? (
                <div key={index} className="col-sm-4" style={{ padding: 15 }}>
                  <div
                    style={{
                      textAlign: "center",
                      borderRadius: 10,
                      background: "white",
                      color: "#404b69",
                    }}
                  >
                    <label
                      style={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        color: "white",
                        width: "100%",
                        fontSize: 18,
                        fontWeight: "bold",
                        padding: 10,
                        background: "#404b69",
                      }}
                    >
                      {location.state}
                    </label>
                    <br />
                    <div
                      className="row justify-content-center"
                      style={{ paddingTop: 15, paddingBottom: 15 }}
                    >
                      <div style={{ padding: 10, fontWeight: "bold" }}>
                        <div>{location.confirmed}</div>
                        <div>Confirmed</div>
                      </div>
                      <div style={{ padding: 10, fontWeight: "bold" }}>
                        <div>{location.active}</div>
                        <div>Active</div>
                      </div>
                      <div style={{ padding: 10, fontWeight: "bold" }}>
                        <div>{location.recovered}</div>
                        <div>Recovered</div>
                      </div>
                      <div style={{ padding: 10, fontWeight: "bold" }}>
                        <div>{location.deaths}</div>
                        <div>Deaths</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null;
            })
        ) : null}
      </div>
    );
  }
}

export default Cards;
