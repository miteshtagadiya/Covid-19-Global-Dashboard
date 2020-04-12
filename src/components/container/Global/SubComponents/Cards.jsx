import React, { Component } from "react";
import DataCard from "components/ui/DataCard/DataCard";
import Virus from "assets/virus.gif";

class Cards extends Component {
  render() {
    return this.props.locationLoader === true ? (
      <div>
        <img src={Virus} alt="Loader" />
      </div>
    ) : (
      <>
        <div style={{ marginBottom: 20 }}>
          <input
            defaultValue={this.props.searchString}
            type="text"
            placeholder="Search"
            onChange={(e) => this.props.onSearch(e)}
          />
        </div>
        <div className="row">
          {this.props.globalData.length !== 0
            ? this.props.globalData
                .filter(
                  (location) =>
                    location.title !== "World" &&
                    location.title
                      .toLowerCase()
                      .includes(this.props.searchString)
                )
                .map((location, index) => {
                  return (
                    <DataCard
                      key={index}
                      title={location.title}
                      location={location}
                      index={index}
                      data={[
                        {
                          Confirmed: location.confirmed,
                        },
                        {
                          Active: location.active,
                        },
                        {
                          Deaths: location.deaths,
                        },
                        {
                          Recovered: location.recovered,
                        },
                        { Serious: location.critical },
                        { Tests: location.totaltests },
                      ]}
                      showIcon={[
                        {
                          Confirmed:
                            location.confirmed_today !== "" ? true : false,
                        },
                        {
                          Deaths: location.deaths_today !== "" ? true : false,
                        },
                      ]}
                      dataToday={[
                        {
                          Confirmed: location.confirmed_today,
                        },
                        {
                          Deaths: location.deaths_today,
                        },
                      ]}
                    />
                  );
                })
            : null}
        </div>
      </>
    );
  }
}

export default Cards;
