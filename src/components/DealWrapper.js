import React from "react";
import DealTable from "./DealTable";
import axios from "axios";

import { Col, Row, Button, Form, FormGroup, Label, Input } from "reactstrap";
import BrandTable from "./BrandTable";
import config from '../config/AppConfig'

class DealWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      priceRange: 999999,
      savingsRange: 1,
      prodName: "",
      brandName: "",
      url: null,
      deals: {},
      message: null,
      info: "",
      brandData: {},
      view: "",
      apiURL: config.APIURL+"/showSavings",
      //apiURL: "/showSavings",

      filteredDeals: {}
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handleSavingsChange = this.handleSavingsChange.bind(this);
    this.handlePriceFilter = this.handlePriceFilter.bind(this);
    this.handleSavingsFilter = this.handleSavingsFilter.bind(this);
  }

  onSubmit(e) {
    // let url = [];

    if (!this.state.url) {
      alert("Enter Price Range OR Savings Range");
      return;
    }
    e.preventDefault();

    this.setState({ info: "Loading..", view: "price-pct", message: null });
    console.log("Starting to fetch data from ", this.state.url);
    axios
      .get(this.state.url, {
        headers: { crossDomain: true }
      })
      .then(x => {
        console.log(x.data);
        console.log(x.data.message);
        this.setState({
          deals: x.data,
          message: x.data.message,
          info: "DONE",
          priceRange: 999999,
          savingsRange: 1,
          filteredDeals: x.data
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          message: err.toString(),
          info: "DONE",
          priceRange: 999999,
          savingsRange: 1
        });
      });
  }

  handleSavingsChange(e) {
    var s = this.state.priceRange;
    console.log(s);
    if (s === 0) {
      s = 999999;
    }
    let computedURL = [
      this.state.apiURL,
      e.target.value ? e.target.value : 1,
      s
    ].join("/");

    this.setState({
      url: computedURL,
      savingsRange: e.target.value ? e.target.value : 1,
      priceRange: s
    });
    console.log(`URL IS  ${computedURL}`);
  }

  handlePriceChange(e) {
    var s = this.state.savingsRange;
    if (s === 0) {
      s = 1;
    }

    let computedURL = [
      this.state.apiURL,
      s,
      e.target.value ? e.target.value : 999999
    ].join("/");

    this.setState({
      url: computedURL,
      priceRange: e.target.value ? e.target.value : 999999,
      savingsRange: s
    });
    console.log(`URL IS  ${computedURL}`);
  }

  onSearchProducts() {
    if (!this.state.prodName) {
      alert("Enter Product Name");
      return;
    }
    this.setState({ filteredDeals:{}, info: "Loading..", view: "price-pct", message: "" });
    console.log("Search Product ", this.state.prodName);
    // Compose URL
    let url = [this.state.apiURL, 1].join("/");
    console.log(url);
    axios
      .get(url, {
        params: { search: this.state.prodName },
        headers: { crossDomain: true }
      })
      .then(x => {
        console.log(x.data);
        console.log(x.data.message);
        this.setState({
          deals: x.data,
          message: x.data.message,
          info: "DONE",
          prodName: "",
          filteredDeals: x.data
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ info: err });
      });
  }

  handlePriceFilter(value) {
    var filter = value;
    var toFilter = this.state.deals;

    console.log();
    if (filter > 0) {
      var filtered = toFilter.data.filter(e => e.price <= parseFloat(value));
      this.setState({ deals:{...this.state.deals,message:"Found "+filtered.length}, filteredDeals: { data: filtered }});
    } else {
      console.log("0 now")
      this.setState({ deals:{...this.state.deals,message:"Available "+toFilter.data.length}, filteredDeals: this.state.deals });
    }
    // console.log("filteredDeals", this.state.filteredDeals);
    // console.log("hello", value);
    // console.log("fil", filtered);
    // console.log("orig", original);
  }

  handleSavingsFilter(value) {
    var filter = value;
    var toFilter = this.state.deals;

    console.log();
    if (filter > 0) {
      var filtered = toFilter.data.filter(e => e.savings >= parseFloat(value));
      this.setState({ deals:{...this.state.deals,message:"Found "+filtered.length}, filteredDeals: { data: filtered }});
    } else {
      console.log("0 now")
      this.setState({ deals:{...this.state.deals,message:"Available "+toFilter.data.length}, filteredDeals: this.state.deals });
    }
    //   this.setState({ filteredDeals: { data: filtered } });
    // } else {
    //   console.log("0 now")
    //   this.setState({ filteredDeals: this.state.deals });
    // }
    // console.log("filteredDeals", this.state.filteredDeals);
    // console.log("hello", value);
    // console.log("fil", filtered);
    // console.log("orig", original);
  }

  onSearchBrand() {
    if (!this.state.brandName) {
      alert("Enter brand Name");
      return;
    }
    this.setState({ view: "brand", message: "Loading..." });
    console.log("Search Brand", this.state.brandName);
    // Compose URL
    let url = this.state.apiURL+"/showbybrand";
    
    console.log(url);
    axios
      .get(url, {
        params: { search: this.state.brandName },
        headers: { crossDomain: true }
      })
      .then(x => {
        console.log(x.data);
        this.setState({
          brandData: x.data,
          message:
            "Found " +
            x.data.length +
            " Brands containing " +
            this.state.brandName,
          info: "DONE",
          brandName: ""
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ info: err.toString() });
      });
  }

  render() {
    return (
      <div className="WrapperContainer container">
        <div>
          <Form>
            <Row form>
              <Col md={4}>
                <FormGroup>
                  <Label>Price Range</Label>
                  <br />
                  <Input
                    type="text"
                    // value={this.state.priceRange}
                    onChange={e => this.handlePriceChange(e)}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Savings Range</Label>
                  <br />
                  <Input
                    type="text"
                    onChange={e => this.handleSavingsChange(e)}
                  />
                </FormGroup>
                <Button color="dark" onClick={this.onSubmit}>
                  Search Deal!
                </Button>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Product Name</Label>
                  <br />
                  <Input
                    type="text"
                    value={this.state.prodName}
                    onChange={e => this.setState({ prodName: e.target.value })}
                  />
                </FormGroup>
                <Button color="dark" onClick={this.onSearchProducts.bind(this)}>
                  Search Products!
                </Button>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Brand Name</Label>
                  <br />
                  <Input
                    type="text"
                    value={this.state.brandName}
                    onChange={e => this.setState({ brandName: e.target.value })}
                  />
                </FormGroup>
                <Button color="dark" onClick={this.onSearchBrand.bind(this)}>
                  Search Brand!
                </Button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="SearchInfo" style={{ paddingTop: "10px" }}>
          <div> {this.state.info === "DONE" ? null : this.state.info}</div>
          <div>
            {!this.state.deals.message
              ? this.state.message
              : this.state.info === "DONE"
              ? this.state.deals.message
              : null}
          </div>
        </div>

        <div className="well container">
           {this.state.filteredDeals && this.state.view === "price-pct" ? (   
            <div>
              <DealTable
                data={this.state.filteredDeals}
                handlePriceFilter={this.handlePriceFilter}
                handleSavingsFilter={this.handleSavingsFilter}
              />
            </div>
          ) : null}
        </div>

        <div className="container">
          {this.state.brandData && this.state.view === "brand" ? (
            <BrandTable data={this.state.brandData} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default DealWrapper;
