import React from "react";
import { Table } from "reactstrap";
import { Link } from "react-router-dom";
import config from "../config/AppConfig";

import {
  
  Row,
  Form,
  FormGroup,
  Label,
  Input,
  Badge
} from "reactstrap";
import axios from "axios";

class DealTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: "Ready !",
      sortasc: true,
      deals: this.props.data,
      OnlineInv: 99,
      currentItem: 0,
      itemdata: {}
    };
    this.getitemID = this.getitemID.bind(this);
    this.getInv = this.getInv.bind(this);
    this.clearitemdata = this.clearitemdata.bind(this);
  }

  getInv(e) {
    const itemid = e.target.text;
    const url = config.IMGURL + itemid + "/stores/8119/listings";
    axios
      .get(url)
      .then(response => {
        return {
          currentItem: itemid,
          OnlineInv: response.data.items[0].invntry,
          img: response.data.items[0].imageResources[0].urls[0].url
        };
      })
      .then(d =>
        this.setState({ itemdata: d }, () => {
          console.log(d);
          return d;
        })
      )

      // .then(OnlineInvImg => {
      //   console.log("Online Inv ", OnlineInvImg.OnlineInv>0?"In Stock":"Out of Stock");
      //   return OnlineInvImg.OnlineInv>0?"In Stock":"Out of Stock"
      // }).then(oi=>{this.setState({OnlineInv:oi,currentItem:itemid})})
      .catch(err => console.log(err));
  }

  clearitemdata(e) {
    this.setState({ itemdata: {} });
  }

  handlePriceChange(event) {
    console.log("val is", event.target.value);
    event.target.value
      ? this.props.handlePriceFilter(parseInt(event.target.value, 10))
      : this.props.handlePriceFilter(0);
  }

  handleSavingsChange(event) {
    event.target.value
      ? this.props.handleSavingsFilter(parseInt(event.target.value, 10))
      : this.props.handleSavingsFilter(0);
  }

  sortby(e) {
    const key = e.target.className;
    console.log(`Sorting by ${key}`);
    var so = this.props.data.data;
    // var so = this.state.deals;
    console.log(so);

    if (this.state.sortasc) {
      so.sort((a, b) => a[key] - b[key]);
    } else {
      so.sort((a, b) => b[key] - a[key]);
    }
    this.setState({ deals: so });
    this.setState({ sortasc: !this.state.sortasc });
  }

  getitemID(x) {
    //console.log(typeof(x));
    return x.toString().includes("/") ? x.split("/").pop() : x;
    //return x.split("/").pop();
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
    if (!this.props.data.data) {
      title = "";
      // title = <div style={{ padding: "10px" }}>{this.state.message}</div>;
    } else {
      title = (
        <div className="dealtable">
          <div
            className="brandItemFilter"
            // style={{ left: "10px", padding: "2px 20px", fontSize: "small" }}
          >
            <Form style={{ paddingLeft: "1px", paddingRight: "10px" }}>
              <Row>
                <FormGroup>
                  <Label>Price Less Than</Label>
                  <Input
                    type="number"
                    onChange={e => this.handlePriceChange(e)}
                    placeholder="Enter Desired $$"
                    onBlur={e => {
                      console.log(e.target.value);
                      e.target.value = "";
                    }}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <Label>Savings Greater Than</Label>
                  <Input
                    type="number"
                    onChange={e => this.handleSavingsChange(e)}
                    placeholder="Enter desired %"
                    onBlur={e => {
                      console.log(e.target.value);
                      e.target.value = "";
                    }}
                  />
                </FormGroup>
              </Row>
            </Form>
          </div>

          <div className="TableContainer container">
            <Table striped>
              <thead style={tableHeader}>
                <tr>
                  <th>
                    <span
                      style={{ color: "white" }}
                      className="itemid"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      ItemID
                    </span>
                  </th>
                  <th>
                    <span
                      style={{ color: "white" }}
                      className="price"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Price
                    </span>{" "}
                  </th>
                  <th>
                    <span
                      style={{ color: "white" }}
                      className="was"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Was
                    </span>
                  </th>
                  <th>
                    <span
                      style={{ color: "white" }}
                      className="savings"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Savings
                    </span>
                  </th>
                  <th>Brand</th>
                  <th>ProductName</th>
                  <th>
                    <span
                      style={{ color: "white" }}
                      className="discount"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Discount
                    </span>
                  </th>
                  <th>Category</th>
                  <th>Image and Status</th>
                </tr>
              </thead>
              <tbody>
                {this.props.data.data.map((element, id) => (
                  <tr key={id} className={element.itemid} style={tableBody}>
                    <td>
                      <a
                        onMouseOver={e => this.getInv(e)}
                        // onMouseLeave={e => this.clearitemdata(e)}
                        href={element.itemid}
                      >
                        {this.getitemID(element.itemid)}
                      </a>
                    </td>
                    <td>${element.price}</td>
                    <td>${element.was}</td>
                    <td>{element.savings}%</td>
                    <td>
                      <Link to={"/branditemtable/" + element.brand}>
                        {element.brand}
                      </Link>
                    </td>
                    <td>{element.productname}</td>
                    <td>${element.discount}</td>
                    <td>{element.category}</td>
                    <td>
                      {this.state.itemdata.currentItem ===
                      this.getitemID(element.itemid) ? (
                        this.state.itemdata.OnlineInv > 0 ? (
                          <h4>
                            <Badge color="success"> InStock </Badge>
                          </h4>
                        ) : (
                          <h4>
                            <Badge color="danger"> Out of Stock </Badge>
                          </h4>
                        )
                      ) : null}
                      <div>
                        {this.state.itemdata.currentItem ===
                        this.getitemID(element.itemid) ? (
                          <img
                            className="itemimg"
                            src={this.state.itemdata.img.replace(
                              "_400",
                              "_300"
                            )}
                            alt="itemImage"
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      );
    }

    return title;
  }
}

export default DealTable;
