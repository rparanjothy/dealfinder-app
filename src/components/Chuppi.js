import React, { Component } from "react";
import axios from "axios";
import { Table } from "reactstrap";

class chuppi extends Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
    this.getData = this.getData.bind(this);
  }

  componentWillMount() {
    const { msg } = this.props.match.params;
    this.setState({ input: msg }, () => {
      console.log("dss", this.state.input);
      this.getData(this.state.input);
    });
  }

  getData(x) {
    axios
      .get("http://localhost:5000/showSavings/" + x)
      .then(x => x.data)
      .then(data =>
        this.setState({ data: data.data }, () => {
          console.log("state is ", this.state.data);
        })
      )
      .catch(e => console.log("Error", e));
  }

  render() {
    return (
      <div>
        <div style={{ backgroundColor: "#f4f4" }} className="container info">
          Hello
        </div>
        <div
          style={{ minHeight: "70vh", backgroundColor: "#f4f2" }}
          className="content container"
        >
          {this.state.data ? (
            <Table>
              <thead>
                <tr>
                  <td> itemid </td> <td> price </td>
                </tr>
              </thead>
              <tbody>
                {this.state.data.map(e => (
                  <tr>
                    <td> {e.itemid} </td> <td>{e.price} </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            ["Loading data for", this.state.input, "...."].join(" ")
          )}
        </div>
      </div>
    );
  }
}

export default chuppi;
