import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../config/AppConfig";
import { Badge } from "reactstrap";
import {
  Table,
  Row,
  Form,
  FormGroup,
  Label,
  Input
} from "reactstrap";

class BrandItemTable extends React.Component {
  constructor(props) {
    super(props);
    console.log("***BrandItemTable");
    const { id } = this.props.match.params;
    this.state = {
      message: "Loading ...!",
      brand: id,
      info: "",
      deals: [],
      sortasc: true,
      original: [],
      itemdata: {}

      // url:"http:localhost:3001/showSavings/bybrand/<brandvalue>/items"
    };
    this.getData = this.getData.bind(this);
    this.sortby = this.sortby.bind(this);
    this.getInv = this.getInv.bind(this);
  }

  getData() {
    const url = config.APIURL+"/showSavings/bybrand/" + this.state.brand + "/items";
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
          original: x.data,
          info: "DONE",
          priceRange: 999999,
          savingsRange: 1,
          message: x.data.length + " items available"
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
    console.log("mounting");
    this.getData();
  }

  handlePriceChange(event) {
    var filter = event.target.value;
    var original = this.state.original;
    console.log();
    if (filter) {
      var filtered = original.filter(
        e => e.price <= parseFloat(event.target.value)
      );
      this.setState({
        deals: filtered,
        message:
          "Price  <= $" + filter + " - " + filtered.length + " items available"
      });
    } else {
      this.setState({
        deals: original,
        message: original.length + " items available"
      });
    }
  }

  handleSavingsChange(event) {
    var filter = event.target.value;
    var original = this.state.original;
    console.log();
    if (filter) {
      var filtered = original.filter(
        e => e.savings >= parseFloat(event.target.value)
      );
      this.setState({
        deals: filtered,
        message:
          "Savings >= " + filter + "% - " + filtered.length + " items available"
      });
    } else {
      this.setState({
        deals: original,
        message: original.length + " items available"
      });
    }
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

  getInv(e) {
    // console.log("Howdy");
    // const itemid = e.target.innerHTML;
    const itemid = e.target.text;
    const url =
      config.IMGURL +
      itemid +
      "/stores/8119/listings";
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

  render() {
    var tableHeader = {
      backgroundColor: "#282c34",
      color: "white",
      textAlign: "left"
    };

    var tableBody = {
      textAlign: "left"
    };
    let details;

    details = (
      <div>
        <div
          className="TableContainerInfo"
          style={{ padding: "10px", fontSize: 15 }}
        >
          {this.state.message
            ? this.state.brand + " - " + this.state.message
            : "Loading.."}
        </div>

        <div className="branddealtable">
          <div
            className="brandItemFilter"
            // style={{ left: "10px", padding: "2px 20px", fontSize: "small" }}
          >
            <Form style={{ paddingLeft: "20px" }}>
              <Row>
                <FormGroup>
                  <Label>Price Less Than</Label>
                  <Input
                    type="number"
                    onChange={e => this.handlePriceChange(e)}
                    placeholder="Enter Desired $$"
                    onBlur={e => (e.target.value = "")}
                  />
                </FormGroup>
              </Row>
              <Row>
                <FormGroup>
                  <Label>Savings Greater Than</Label>
                  <Input
                    type="number"
                    onChange={e => this.handleSavingsChange(e)}
                    placeholder="Enter Desired %"
                    onBlur={e => (e.target.value = "")}
                  />
                </FormGroup>
              </Row>
            </Form>
          </div>

          <div
            className="TableContainer container"
            style={{ minHeight: "80vh" }}
          >
            <Table striped>
              <thead style={tableHeader}>
                <tr>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="itemid"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      ItemID
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="price"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Price
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="was"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Was
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="savings"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Savings
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="brand"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Brand
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="productname"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      ProductName
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="discount"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Discount
                    </Link>
                  </th>
                  <th>
                    <Link
                      style={{ color: "white" }}
                      className="category"
                      to="#"
                      onClick={e => {
                        this.sortby(e);
                      }}
                    >
                      Category
                    </Link>
                  </th>
                  <th> Image and Status </th>
                </tr>
              </thead>
              <tbody>
                {this.state.deals.map((element, id) => (
                  <tr key={id} style={tableBody}>
                    <td>
                      <a onMouseOver={e => this.getInv(e)} href={element.url}>
                        {element.itemid}
                      </a>
                    </td>
                    <td>${element.price}</td>
                    <td>${element.was}</td>
                    <td>{element.savings}%</td>
                    <td>
                      <a href={element.brandURL}>{element.brand}</a>
                    </td>
                    <td>{element.productname}</td>
                    <td>${element.discount}</td>
                    <td>{element.category}</td>
                    <td>
                    {this.state.itemdata.currentItem ===
                      element.itemid.toString() ? (
                        this.state.itemdata.OnlineInv > 0 ? (
                          <h4>
                            <Badge color="success"> InStock </Badge>
                          </h4>
                        ) : (
                          <h4><Badge color="danger"> Out of Stock </Badge></h4>
                        )
                      ) : null}
                      <div>
                        {this.state.itemdata.currentItem ===
                        element.itemid.toString() ? (
                          <img className="itemimg"
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
      </div>
    );
    return details;
  }
}

export default BrandItemTable;
