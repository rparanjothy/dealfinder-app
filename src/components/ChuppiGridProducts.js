import React, { Component } from "react";
import axios from "axios";
import { Badge, Button, Form, FormGroup, Label, Input } from "reactstrap";
import "./ChuppiGrid.css";
import config from "../config/AppConfig";

class chuppiGridProducts extends Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
    // this.getData = this.getData.bind(this);
    this.loadimagedata = this.loadimagedata.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);

    // this.searchOptions = { price: null, savings: null, search: null };
    // this.searchOptions = { price: 9999999, savings: 1, search: "" };
    this.sortasc = true;
    this.sortitems = this.sortitems.bind(this);
    this.load = this.load.bind(this);
    this.btnToggle = true;
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    const { msg } = this.props.match.params;
    this.setState(
      {
        input: msg,
        searchOptions: { price: 9999999, savings: 1, search: "" },
        //Added Pagination
        pagination: { start: 0, end: 100 },
        sortasc:true
      },
      () => {
        console.log("dss", this.state.input);
        this.load();
      }
    );
    // this.searchOptions = { price: 9999999, savings: 1, search: "" };

    //this.load()
  }

  filter(e) {
    console.log("Howdy!");
    if (this.state.searchOptions.search) {
      //filter from master so you get all
      if (this.state.master) {
        var toFilter = this.state.master;
        // var toFilter = this.state.master.slice(
        //   this.state.pagination.start,
        //   this.state.pagination.end
        // );

        toFilter = toFilter.filter(e =>
          e["productname"]
            .toLowerCase()
            .includes(this.state.searchOptions.search.toLowerCase())
        );
        this.setState(
          {
            data: toFilter,
            pagination: { start: 0, end: 100 }
          },
          () => {
            console.log("Filtered..");
            this.setState({
              filtercount: toFilter.length ? toFilter.length : "0"
            });
          }
        );
      }
    }
  }

  goPrev() {
    console.log("Prev");
    var { start, end } = this.state.pagination;
    start -= 100;
    end -= 100;
    this.setState({ pagination: { start, end } }, () => {
      console.log("slicing master");
      this.setState({ data: this.state.master.slice(start, end) });
    });
  }

  goNext() {
    console.log("Next");
    // if length is <100 dont do anything
    var { start, end } = this.state.pagination;
    start += 100;
    end += 100;
    this.setState({ pagination: { start, end } }, () => {
      console.log("slicing master");
      this.setState({ data: this.state.master.slice(start, end) });
    });
  }

  load() {
    // this.getData(this.state.input);
    //const { savings, price, search } = this.state.searchOptions;
    this.setState({ data: null });
    //reset pagination
    this.setState({ pagination: { start: 0, end: 100 } }, () => {
      this.getDataCustom(this.state.input);
    });
  }

  loadimagedata(e) {
    console.log(e.target.innerHTML);
    // console.log(e.target.outerHTML);

    const itemid = e.target.innerHTML;

    this.getImage(itemid);
    return this.state.itemData ? this.state.itemData.img : null;
  }

  getImage(itemid) {
    // const itemid = e.target.text;
    // var imgURL = null;
    const url = config.IMGURL + itemid + "/stores/8119/listings";
    console.log(url);
    axios
      .get(url)
      .then(response => {
        return {
          currentItem: itemid,
          OnlineInv: response.data.items[0].invntry,
          img: response.data.items[0].imageResources[0].urls[0].url.replace(
            "_400",
            "_300"
          )
        };
      })
      .then(d => {
        this.setState({ itemData: d }, () => {
          // console.log(this.state.itemData.length);
        });
      })
      .catch(err => console.log(err));
  }

  getitemID(x) {
    //console.log(typeof(x));
    return x.toString().includes("/") ? x.split("/").pop() : x;
    //return x.split("/").pop();
  }

  onChangeValue(e, i) {
    console.log(e, i);
    switch (i) {
      // case "savings":
      //   this.setState(
      //     {
      //       searchOptions: {
      //         ...this.state.searchOptions,
      //         savings: e.target.value
      //       },
      //       btnToggle: false
      //     },
      //     () => {
      //       console.log(this.state.searchOptions);
      //     }
      //   );
      //   break;
      // case "price":
      //   // console.log(this.state.searchOptions);

      //   this.setState(
      //     {
      //       searchOptions: {
      //         ...this.state.searchOptions,
      //         price: e.target.value
      //       },
      //       btnToggle: false
      //     },
      //     () => {
      //       console.log(this.state.searchOptions);
      //     }
      //   );
      //   break;
      case "search":
        // console.log(this.state.searchOptions);

        this.setState(
          {
            searchOptions: {
              ...this.state.searchOptions,
              search: e.target.value
            },
            btnToggle: false
          },
          () => {
            console.log(this.state.searchOptions);
            // //call filter in real time
            // if (this.state.searchOptions.search) {
            //   this.filter(e);
            // } else {
            //   this.setState({ filtercount: 0 });
            // }
          }
        );
        break;
      default:
        break;
    }
  }

  // getData(x) {
  //   axios
  //     .get("http://localhost:5000/showSavings/" + x)
  //     .then(x => x.data)
  //     .then(data =>
  //       this.setState({ data: data.data }, () => {
  //         // console.log("state is ", this.state.data);
  //       })
  //     )
  //     .catch(e => console.log("Error", e));
  // }

  getDataCustom(brand) {
    this.setState({ status: "Loading....." });
    const url = [config.APIURL, "showSavings/1/999999"].join("/");
    console.log(url);
    var { start, end } = this.state.pagination;
    axios
      .get(url, { params: { search: brand } })
      .then(x => x.data.data)
      .then(data =>
        this.setState({ master: data }, () => {
          console.log("master count " + this.state.master.length);
          // now load data based on pagination length
          this.setState({ data: this.state.master.slice(start, end) }, () => {
            // console.log(this.state.data);
          });
          this.setState({ status: "" });
        })
      )
      .catch(e => console.log("Error", e));
  }

  sortitems() {
    //sort Master
    if (this.state.data) {
      // var toSort = this.state.data;
      this.setState({ pagination: { start: 0, end: 100 } });
      var { start, end } = this.state.pagination;
      var toSort = this.state.master;
      !this.state.sortasc
        ? toSort.sort((a, b) => a["price"] - b["price"])
        : toSort.sort((a, b) => b["price"] - a["price"]);
      this.setState({ data: toSort.slice(start, end) }, () => {
        console.log("Sorted..");
      });
    }
    this.setState({ sortasc: !this.state.sortasc }, () =>
      console.log("Sort asc ", this.state.sortasc)
    );
    //reset pagination to 0-100
  }

  sortitemsSavings() {
    // sort from master and render based on pagination and reset pagination
    if (this.state.data) {
      // var toSort = this.state.data;
      this.setState({ pagination: { start: 0, end: 100 } });
      var { start, end } = this.state.pagination;
      var toSort = this.state.master;

      !this.state.sortasc
        ? toSort.sort((a, b) => a["savings"] - b["savings"])
        : toSort.sort((a, b) => b["savings"] - a["savings"]);
      this.setState({ data: toSort.slice(start, end) }, () => {
        console.log("Sorted..");
      });
    }
    this.setState({ sortasc: !this.state.sortasc }, () =>
      console.log("Sort asc ", this.state.sortasc)
    );
    //reset pagination to 0-100
  }

  refresh(e) {
    //load from master based on pagination
    // reset text
    if (this.state.master) {
      var { start, end } = this.state.pagination;
      this.setState({
        data: this.state.master.slice(start, end),
        searchOptions: { search: "" },
        filtercount: 0
      });
    }
  }

  render() {
    return (
      <div className="chuppi">
        <div className="chuppiInfo1">
          <header>
            {this.state.data ? (
              <div className="chuppiInfo">
                <div
                  className="chuppiInfoChild"
                  //   style={{ display: "flex", alignItems: "center" }}
                >
                  {[
                    "text: " + this.state.searchOptions.search,
                    this.state.master.length + " - items on sale!!"
                  ].join(" >> ")}
                </div>

                <div className="chuppiInfoChild">
                  {/* show prev only when start is more than 0 */}
                  {this.state.pagination.start > 0 ? (
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={e => this.goPrev()}
                      style={{ margin: "5px" }}
                    >
                      Prev
                    </Button>
                  ) : null}

                  {[
                    this.state.pagination.start + 1,
                    "-",
                    //show length if end < length
                    this.state.pagination.end < this.state.master.length
                      ? this.state.pagination.end
                      : this.state.master.length,
                    "of",
                    this.state.master.length
                  ].join(" ")}

                  {/* show next only when there is more than 100 */}
                  {this.state.master.length > this.state.pagination.end ? (
                    <Button
                      color="secondary"
                      size="sm"
                      onClick={e => this.goNext()}
                      style={{ margin: "5px" }}
                    >
                      Next
                    </Button>
                  ) : null}
                </div>
                <div className="chuppiInfoChild">
                  {this.state.data.length ? (
                    <div>
                      <Button
                        size="sm"
                        onClick={e => {
                          this.sortitems();
                        }}
                      >
                        Sort By Price {!this.state.sortasc ? "V" : "^"}
                      </Button>
                      {"  "}
                      <Button
                        size="sm"
                        onClick={e => {
                          this.sortitemsSavings();
                        }}
                      >
                        Sort By Savings {!this.state.sortasc ? "V" : "^"}
                      </Button>
                      {"  "}
                      <Button
                        size="sm"
                        onClick={e => {
                          //Empty data and master
                          this.setState({ data: null, master: null });
                        }}
                      >
                        Clear Search Results
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : (
              this.state.status
            )}
          </header>
        </div>

        <div className="row1">
          <div className="searchBar container">
            <Form>
              <FormGroup>
                {/* </FormGroup>
            <FormGroup> */}
                {/*
             <Label for="price">Price</Label>
                <Input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="10"
                  value={this.state.searchOptions.price}
                  onChange={e => this.onChangeValue(e, e.target.name)}
                />
             
                <Label for="savings">% off</Label>
                <Input
                  type="number"
                  name="savings"
                  id="savings"
                  placeholder="10"
                  value={this.state.searchOptions.savings}
                  onChange={e => this.onChangeValue(e, e.target.name)}
                />
            */}
                <Label for="keywords">Search Text</Label>
                <Input
                  type="test"
                  name="search"
                  id="search"
                  placeholder="hammer"
                  value={this.state.searchOptions.search}
                  onChange={e => this.onChangeValue(e, e.target.name)}
                />
              </FormGroup>
              <FormGroup>
                <Button
                  style={{ marginTop: "5px" }}
                  size="sm"
                  onClick={e => this.filter(e)}
                  block
                >
                  Find Item
                </Button>
                <br />
                <Button
                  style={{ marginTop: "5px" }}
                  size="sm"
                  onClick={e => this.refresh(e)}
                  block
                >
                  Refresh
                </Button>
              </FormGroup>
              {this.state.filtercount ? (
                <Badge color="light">
                  <h3> {this.state.filtercount + " items match"}</h3>
                </Badge>
              ) : null}
            </Form>
          </div>

          <div className="chuppiGrid" style={{ minHeight: "84vh" }}>
            {this.state.data
              ? this.state.data.map((i, j) => (
                  <div key={j} className="chuppiGridPod">
                    <div className="chuppiGridBrand">
                      <Badge color="dark"> {i.brand} </Badge>
                    </div>
                    <div className="chuppiGridItem">
                      <a className="jo" href={i.itemid}>
                        {i.productname}
                      </a>
                    </div>
                    {/* Loading images */}
                    {this.state.itemData ? (
                      this.state.itemData.currentItem ===
                      this.getitemID(i.itemid).toString() ? (
                        <div className="chuppiGridImage">
                          <img
                            className="chuppi-item-img"
                            src={
                              this.state.itemData
                                ? this.state.itemData.img
                                : null
                            }
                            alt="boo"
                          />
                          {this.state.itemData.OnlineInv > 0 ? (
                            <Badge color="success"> InStock </Badge>
                          ) : (
                            <Badge color="danger"> OutOfStock </Badge>
                          )}
                        </div>
                      ) : null
                    ) : null}

                    <div
                      className="chuppiGridItemID"
                      onMouseOver={e => this.loadimagedata(e)}
                    >
                      {this.getitemID(i.itemid)}
                    </div>

                    <Badge color="s">
                      <div className="chuppiGridPrice">
                        <h2> $ {i.price}</h2>
                      </div>
                      <div className="chuppiGridWas">
                        $ {this.getitemID(i.was)}
                      </div>
                    </Badge>
                    <div className="chuppiGridSavings">
                      <h5>
                        <Badge color="success"> {i.savings} % </Badge>
                      </h5>
                    </div>
                  </div>
                ))
              : null}
          </div>
        </div>
        <div
          className="row2 bottom-footer"
          style={{ display: "flex", alignItems: "flex-end" }}
        >
          {this.state.data ? (
            <div className="chuppiInfo">
              <div className="chuppiInfoChild">
                {/* show prev only when start is more than 0 */}
                {this.state.pagination.start > 0 ? (
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={e => this.goPrev()}
                    style={{ margin: "5px" }}
                  >
                    Prev
                  </Button>
                ) : null}

                {[
                  this.state.pagination.start + 1,
                  "-",
                  //show length if end < length
                  this.state.pagination.end < this.state.master.length
                    ? this.state.pagination.end
                    : this.state.master.length,
                  "of",
                  this.state.master.length
                ].join(" ")}

                {/* show next only when there is more than 100 */}
                {this.state.master.length > this.state.pagination.end ? (
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={e => this.goNext()}
                    style={{ margin: "5px" }}
                  >
                    Next
                  </Button>
                ) : null}
              </div>
              <div className="chuppiInfoChild">
                {this.state.data.length ? (
                  <div>
                    <Button
                      size="sm"
                      onClick={e => {
                        this.sortitems();
                      }}
                    >
                      Sort By Price {!this.state.sortasc ? "V" : "^"}
                    </Button>
                    {"  "}
                    <Button
                      size="sm"
                      onClick={e => {
                        this.sortitemsSavings();
                      }}
                    >
                      Sort By Savings {!this.state.sortasc ? "V" : "^"}
                    </Button>
                    {"  "}
                    <Button
                      size="sm"
                      onClick={e => {
                        //Empty data and master
                        this.setState({ data: null, master: null });
                      }}
                    >
                      Clear Search Results
                    </Button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            this.state.status
          )}
        </div>
      </div>
    );
  }
}

export default chuppiGridProducts;
