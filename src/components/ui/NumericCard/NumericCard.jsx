import React, { Component } from "react";
import ReactGA from "react-ga";
import "./NumericCard.sass";
import Popover from "react-popover";

class NumericCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const colors = {
      Confirmed: "#448AFF",
      Active: "#F9A825",
      Recovered: "#4CAF50",
      Deaths: "#FF5252",
    };

    return (
      <div className="row NumericCard">
        {this.props.data.map((card, index) => {
          let dataToday = this.props.dataToday.filter(
            (data) => Object.keys(data)[0] === Object.keys(card)[0]
          );
          let showPopover = this.props.showPopover.filter(
            (data) => Object.keys(data)[0] === Object.keys(card)[0]
          );
          let popoverData = this.props.popoverData.filter(
            (data) => Object.keys(data)[0] === Object.keys(card)[0]
          );
          return (
            <div
              key={index}
              style={{ marginBottom: 15, marginTop: 15 }}
              className={this.props.className}
            >
              <div
                className="card"
                style={{
                  background: colors[Object.keys(card)[0]],
                }}
              >
                <div
                  className="mainNumbers"
                  style={dataToday.length !== 0 ? {} : { marginBottom: 42 }}
                >
                  {Object.values(card)[0]}
                </div>
                {dataToday.length !== 0 ? (
                  <div className="deltaNumbers">
                    <span className="deltaarrow">&#9650;</span>{" "}
                    {dataToday[0][Object.keys(card)[0]]}
                    {showPopover[0][Object.keys(card)[0]] ? (
                      <Popover
                        body={
                          <div
                            style={{
                              maxHeight: 400,
                              overflowY: "scroll",
                              borderRight: 10,
                              background: "white",
                              borderRadius: 10,
                              padding: 15,
                              color: "#192a56",
                              fontWeight: "bold",
                            }}
                          >
                            {popoverData[0][Object.keys(card)[0]]}
                          </div>
                        }
                        preferPlace={"below"}
                        isOpen={this.state[Object.keys(card)[0]]}
                        onOuterAction={() =>
                          this.setState({
                            [Object.keys(card)[0]]: !this.state[
                              Object.keys(card)[0]
                            ],
                          })
                        }
                      >
                        <div
                          onClick={() => {
                            ReactGA.event({
                              category: this.props.type + " Info",
                              action:
                                this.props.type +
                                Object.keys(card)[0] +
                                " Info Clicked",
                              label:
                                this.props.type +
                                Object.keys(card)[0] +
                                " Info",
                            });
                            this.setState({
                              [Object.keys(card)[0]]: !this.state[
                                Object.keys(card)[0]
                              ],
                            });
                          }}
                          className="report-tile delta-info"
                        >
                          ?
                        </div>
                      </Popover>
                    ) : null}
                  </div>
                ) : null}
                <div style={{ fontSize: 18 }}>{Object.keys(card)[0]}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default NumericCard;
