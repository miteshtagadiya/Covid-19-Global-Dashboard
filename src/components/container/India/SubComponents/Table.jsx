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
      this.props.india.length !== 0
        ? this.props.india.statewise
            .filter((state) => state.state !== "Total")
            .map((state) => {
              return {
                state: state.state,
                confirmed: Number(state.confirmed),
                active: Number(state.active),
                recovered: Number(state.recovered),
                deaths: Number(state.deaths),
                deltaConfirmed: Number(state.deltaconfirmed),
                deltaActive: Number(
                  state.deltaconfirmed -
                    state.deltarecovered -
                    state.deltadeaths
                ),
                deltaRecovered: Number(state.deltarecovered),
                deltaDeaths: Number(state.deltadeaths),
              };
            })
        : [];

    const columns =
      this.props.india.length !== 0
        ? [
            {
              Header: "State/UT",
              accessor: "state", // String-based value accessors!
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
                    {props.original.deltaActive === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#192a56",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaActive}
                      </span>
                    )}{" "}
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
                    {props.original.deltaRecovered === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#006266",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaRecovered}
                      </span>
                    )}{" "}
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
          ]
        : [];

    const cityData =
      this.props.stateWiseCity.length !== 0
        ? Object.keys(this.props.stateWiseCity).map((city) => {
            return {
              [city]: Object.keys(
                this.props.stateWiseCity[city].districtData
              ).map((key) => {
                return {
                  city: key,
                  confirmed: this.props.stateWiseCity[city].districtData[key]
                    .confirmed,
                  deltaConfirmed: this.props.stateWiseCity[city].districtData[
                    key
                  ]["delta"]["confirmed"],
                  deceased: this.props.stateWiseCity[city].districtData[key]
                    .deceased,
                  active: this.props.stateWiseCity[city].districtData[key]
                    .active,
                  deltaDeceased: this.props.stateWiseCity[city].districtData[
                    key
                  ]["delta"]["deceased"],
                  recovered: this.props.stateWiseCity[city].districtData[key]
                    .recovered,
                  deltaRecovered: this.props.stateWiseCity[city].districtData[
                    key
                  ]["delta"]["recovered"],
                };
              }),
            };
          })
        : [];

    const cityColumns =
      this.props.india.length !== 0
        ? [
            {
              Header: "District",
              accessor: "city",
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
                    {props.original.deltaRecovered === 0 ? null : (
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: "bold",
                          color: "#006266",
                        }}
                      >
                        <span style={{ fontSize: 15, fontWeight: "bold" }}>
                          &#9650;
                        </span>
                        {props.original.deltaRecovered}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
            {
              Header: "Deaths",
              accessor: "deceased",
              Cell: (props) => {
                return (
                  <>
                    {props.original.deltaDeceased === 0 ? null : (
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
                        {props.original.deltaDeceased}
                      </span>
                    )}{" "}
                    <span className="number">{props.value}</span>
                  </>
                );
              },
            },
          ]
        : [];
    return (
      <div className="row" style={{ marginTop: 15 }}>
        <div className="col-sm-12">
          <div
            style={{
              background: "white",
              color: "#404b69",
              borderRadius: 10,
            }}
          >
            <ReactTable
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
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    if (handleOriginal) {
                      handleOriginal();
                    }
                  },
                };
              }}
              filterable
              SubComponent={(row) => {
                return row.original.confirmed === 0 ? null : (
                  <div style={{ padding: "20px" }}>
                    <div style={{ borderRadius: 10 }}>
                      <ReactTable
                        data={
                          Object.values(
                            cityData.filter(
                              (state) =>
                                Object.keys(state)[0] === row.original.state
                            )[0]
                          )[0]
                        }
                        columns={cityColumns}
                        defaultPageSize={5}
                        showPagination={true}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
