import React from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";


class BrandTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "Ready !"
    };
  }

 
  render() {
    var tableHeader = {
      backgroundColor: "#282c34",
      color: "white",
      textAlign: "left"
    };

    var tableBody = {
      textAlign: "left"
    };

    let title;
    if (!this.props.data.length) {
      title = "";
      // title = <div style={{ padding: "10px" }}>{this.state.message}</div>;
    } else {
      title = (
        <div className="TableContainer container">
          <Table striped>
            <thead style={tableHeader}>
              <tr>
                <th>Brand</th>
                <th>Count</th>
                <th>MinPrice</th>
                <th>MaxPrice</th>
                <th>MaxSavings</th>
              </tr>
            </thead>
            <tbody>
              {this.props.data.map((element, id) => (
                <tr key={id} style={tableBody}>
                  <td>
                    <Link to={"/branditemtable/" + element.brand}>
                      {element.brand}
                    </Link>
                    {/* <Link to={"/chuppiGridBrand/" + element.brand}>
                      {element.brand}
                    </Link> */}

                  </td>
                  <td>{element.counts}</td>
                  <td>${element.minPrice}</td>
                  <td>${element.maxPrice}</td>
                  <td>${element.maxSavings}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }

    return title;
  }
}

export default BrandTable;
