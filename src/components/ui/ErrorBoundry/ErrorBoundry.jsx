import React from "react";
import "./ErrorBoundry.css";

class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <section className="page_404">
            <div className="container">
              <div className="row">
                <div
                  className="col-sm-12"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="col-sm-10 col-sm-offset-1  text-center">
                    <div className="four_zero_four_bg"></div>

                    <div className="contant_box_404">
                      <h3 className="h2">Look like you're lost</h3>

                      <p>the page you are looking for not available!</p>

                      <a
                        href="https://miteshtagadiya.github.io/Covid-19-Global-Dashboard"
                        className="link_404"
                      >
                        Go to Home
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundry;
