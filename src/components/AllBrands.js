import React from "react";
import axios from "axios";
import { Table,Button } from "reactstrap";
import { Link } from "react-router-dom";
import config from "../config/AppConfig";

class AllBrands extends React.Component {
  constructor(props) {
    super(props);
    const { id } = this.props.match.params;
    this.state = {
      message: "Loading ...!",
      brand: id,
      info: "",
      deals: [],
      sortasc: true

      // url:"http:localhost:3001/showSavings/bybrand/<brandvalue>/items"
    };
    this.getData = this.getData.bind(this);
    this.sortby = this.sortby.bind(this);
  }

  getData() {
    const url = config.APIURL+"/showSavings/showbybrand";
    // console.log("Howdy!", url);
    this.setState({ info: "Loading..", message: null });
    console.log("Starting to fetch data from ", url);
    axios
      .get(url, {
        headers: { crossDomain: true }
      })
      .then(x => {
        // console.log(x.data);
        this.setState({
          deals: x.data,
          info: "DONE",
          message: x.data.length + " brands on Sale.."
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: err.toString(),
          info: "ERROR"
        });
      });
  }

  componentWillMount() {
    //console.log("mounting");
    this.getData();
  }

  sortby(e) {
    const key = e.target.className;
    console.log(`Sorting by ${key}`);
    var so = [...this.state.deals];
    if (this.state.sortasc) {
      so.sort((a, b) => a[key] - b[key]);
    } else {
      so.sort((a, b) => b[key] - a[key]);
    }
    this.setState({ deals: so });
    this.setState({ sortasc: !this.state.sortasc });
  }

  render() {
    var tableHeader = {
      backgroundColor: "#282c34",
      color: "white",
      textAlign: "left"
    };

    var tableBody = {
      textAlign: "left",
      fontSize: "small"
    };
    let details;

    details = (
      <div className="AllBrandsTableContainer container">
        <div
          className="TableContainerInfo"
          style={{ padding: "10px", fontSize: 15 }}
        >
          {" "}
          {this.state.message ? <div> {this.state.message} </div>: "Loading.."}
        </div>
        <Table striped>
          <thead style={tableHeader}>
            <tr>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="brand"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  {" "}
                  Brand{" "}
                </Link>
              </th>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="counts"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  {" "}
                  Counts{" "}
                </Link>
              </th>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="minPrice"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  {" "}
                  minPrice{" "}
                </Link>
              </th>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="maxPrice"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  maxPrice
                </Link>
              </th>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="minSavings"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  minSavings
                </Link>
              </th>
              <th>
                <Link
                  style={{ color: "white" }}
                  className="maxSavings"
                  to="#"
                  onClick={e => {
                    this.sortby(e);
                  }}
                >
                  
                  maxSavings
                </Link>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.deals.map((element, id) => (
              <tr key={id} style={tableBody}>
                <td>
                  <Link to={"/branditemtable/" + element.brand}>
                  {/* <Link to={"/chuppiGridBrand/" + element.brand}> */}
                    {element.brand}
                  </Link>
                </td>
                <td>{element.counts}</td>
                <td>${element.minPrice}</td>
                <td>${element.maxPrice}</td>
                <td>{element.minSavings}%</td>
                <td>{element.maxSavings}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
    return details;
  }
}

export default AllBrands;
