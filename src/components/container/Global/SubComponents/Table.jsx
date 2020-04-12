import React, { Component } from "react";
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const data =
      this.props.globalData.length !== 0
        ? this.props.globalData
            .filter((country) => country.title !== "World")
            .map((country) => {
              return {
                country: country.title,
                confirmed: Number(country.confirmed),
                active: Number(country.active),
                recovered: Number(country.recovered),
                deaths: Number(country.deaths),
                deltaConfirmed: Number(country.confirmed_today),
                deltaDeaths: Number(country.deaths_today),
                tests: Number(country.totaltests),
              };
            })
        : [];

    const columns =
      this.props.globalData.length !== 0
        ? [
            {
              Header: "Country",
              accessor: "country",
            },
            {
              Header: "Confirmed",
              accessor: "confirmed",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaConfirmed === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#e43339",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaConfirmed}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Active",
              accessor: "active",
              Cell: (props) => {
                return (
                  <>
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Recovered",
              accessor: "recovered",
              Cell: (props) => {
                return (
                  <>
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Deaths",
              accessor: "deaths",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaDeaths === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#535c68",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaDeaths}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Tests",
              accessor: "tests",
              Cell: (props) => {
                return (
                  <>
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
          ]
        : [];
    return (
      <div className="row global-table">
        <div className="col-sm-12">
          <div className="global-table-card">
            <ReactTable
              style={{ minHeight: 500 }}
              data={data}
              columns={columns}
              defaultPageSize={10}
              className="-striped -highlight"
              noDataText={<b>No data found</b>}
              getTheadProps={(state, rowInfo, column) => {
                return {
                  style: {
                    fontWeight: "bold",
                  },
                };
              }}
              filterable
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
