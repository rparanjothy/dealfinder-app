import React, { Component } from "react";
import axios from "axios";
import { Badge, Button, Form, FormGroup, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";
import "./ChuppiGrid.css";
import config from "../config/AppConfig";
import ChuppiImageSlider from "./ChuppiImageSlider";

class chuppiGrid extends Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
    // this.getData = this.getData.bind(this);
    this.loadimagedata = this.loadimagedata.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);

    // this.searchOptions = { price: null, savings: null, search: null };
    //this.searchOptions = { price: 9999999, savings: 1, search: "" };
    this.sortasc = true;
    this.sortitems = this.sortitems.bind(this);
    this.load = this.load.bind(this);
    this.btnToggle = true;
    this.goNext = this.goNext.bind(this);
    this.goPrev = this.goPrev.bind(this);
    this.getitemID = this.getitemID.bind();
    // this.cycleBannerImages = this.cycleBannerImages.bind(this);
    // this.getImageForBanner = this.getImageForBanner.bind(this);
    // this.updateImageUrlforBannerItem = this.updateImageUrlforBannerItem.bind(
    //   this
    // );
  }

  componentWillMount() {
    const { msg } = this.props.match.params;
    this.setState(
      {
        input: msg,
        searchOptions: { price: 9999999, savings: 1, search: "" },
        //Added Pagination
        pagination: { start: 0, end: 100 },
        sortasc: true
      },
      () => {
        console.log("dss", this.state.input);
      }
    );
    // this.searchOptions = { price: 9999999, savings: 1, search: "" };

    //this.load()
    this.getlabels();
  }

  getlabels() {
    const pattern = /^[A-Za-z].*/;

    axios
      .get([config.APIURL, "prodlabel"].join("/"))
      .then(x => x.data.labels)
      .then(labels =>
        labels
          .filter(label => label.charAt(0) === label.charAt(0).toUpperCase())
          .filter(firstWord => pattern.test(firstWord))
      )
      .then(labels =>
        this.setState({ labels }, () => {
          console.log("labels loaded", this.state.labels.length);
        })
      );
  }
  //   filter(e) {
  //     console.log("Howdy!");
  //     var toFilter = this.state.master;
  //     toFilter = toFilter.filter(e =>
  //       e["productname"]
  //         .toLowerCase()
  //         .includes(this.state.searchOptions.search.toLowerCase())
  //     );
  //     this.setState({ data: toFilter }, () => console.log("Filtered.."));
  //   }

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
    const { savings, price, search } = this.state.searchOptions;
    this.setState({ data: null, brands: null });
    //reset pagination
    this.setState({ pagination: { start: 0, end: 100 } }, () => {
      this.getDataCustom(savings, price, search);
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

  // getImageForBanner(itemid) {
  //   // const itemid = e.target.text;
  //   // var imgURL = null;
  //   var imgurlR = "https://goo.geel/images/5iqKX2";
  //   const url = config.IMGURL + itemid + "/stores/8119/listings";
  //   console.log(url);
  //   axios
  //     .get(url)
  //     .then(response => {
  //       this.setState(
  //         {
  //           bannerData: [
  //             ...this.state.bannerData,
  //             {
  //               bannerimageid: itemid,
  //               bannerimageUrl: response.data.items[0].imageResources[0].urls[0].url.replace(
  //                 "_400",
  //                 "_300"
  //               )
  //             }
  //           ]
  //         },
  //         () => {
  //           console.log(this.state.bannerData);
  //         }
  //       );
  //     })
  //     .catch(err => {
  //       console.log(err);
  //     });

  //   return imgurlR;
  // }

  getitemID(x) {
    //console.log(typeof(x));
    return x.toString().includes("/") ? x.split("/").pop() : x;
    //return x.split("/").pop();
  }

  onChangeValue(e, i) {
    // console.log(e, i);
    switch (i) {
      case "savings":
        this.setState(
          {
            searchOptions: {
              ...this.state.searchOptions,
              savings: e.target.value
            },
            btnToggle: false
          },
          () => {
            // console.log(this.state.searchOptions);
          }
        );
        break;
      case "price":
        // console.log(this.state.searchOptions);

        this.setState(
          {
            searchOptions: {
              ...this.state.searchOptions,
              price: e.target.value
            },
            btnToggle: false
          },
          () => {
            // console.log(this.state.searchOptions);
          }
        );
        break;
      case "search":
        // console.log(this.state.searchOptions);
        const l = e.target.value;
        this.setState(
          {
            searchOptions: {
              ...this.state.searchOptions,
              search: e.target.value
            },
            btnToggle: false
          },
          () => {
            // console.log(this.state.searchOptions);
            if (l) {
              this.setState(
                {
                  filteredLabel: this.state.labels.filter(label =>
                    label.toLowerCase().includes(l.toLowerCase())
                  )
                }
                // ,() => console.log(this.state.filteredLabel)
              );
              // .map(matches => {console.log("**");console.log(matches);return matches})
            } else {
              this.setState({ filteredLabel: null });
            }
          }
        );

        // now lets try dynamic

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

  getDataCustom(savings, price, search) {
    this.setState({ status: "Loading....." });
    const url = [config.APIURL, "showSavings", savings, price].join("/");
    console.log(url);
    var { start, end } = this.state.pagination;
    console.log(start, end);
    axios
      .get(url, { params: { search: search, sortby: "price" } })
      .then(x => x.data.data)
      .then(data =>
        this.setState({ master: data }, () => {
          console.log("master count " + this.state.master.length);
          // now load data based on pagination length
          this.setState(
            {
              data: this.state.master.slice(start, end),
              bannerData: this.state.master.slice(start, end)
            },
            () => {
              // console.log(this.state.data);
              // load distinct brands
              const availableBrands = new Set();
              this.state.master.map(e => {
                return availableBrands.add(e.brand);
              });
              this.setState({ brands: [...availableBrands.values()].sort() });
            }
          );
          this.setState({ status: "" });
          //           setTimeout(() => this.cycleBannerImages(0, 3), 1000);
        })
      )
      .catch(e => {
        console.log("Error", e);
        this.setState({ status: e.toString() });
      });
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
                    this.state.searchOptions.savings + " %",
                    "$" + this.state.searchOptions.price,
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
                          this.setState({
                            data: null,
                            master: null,
                            brands: null,
                            searchOptions: {
                              price: 9999999,
                              savings: 1,
                              search: ""
                            }
                          });
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

        <div className="row1 imageBanner">
          {this.state.data ? (
            <ChuppiImageSlider
              bannerData={this.state.master}
              getitemID={this.getitemID}
            />
          ) : null}
        </div>

        <div className="row1">
          <div className="col-1">
            <div className="1searchBar 1container ">
              <Form>
                <FormGroup>
                  {/* </FormGroup>
            <FormGroup> */}

                  <Label for="price">Price</Label>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    placeholder="10"
                    value={this.state.searchOptions.price}
                    onChange={e => this.onChangeValue(e, e.target.name)}
                  />

                  <Label for="savings">% off</Label>
                  <Input
                    type="text"
                    name="savings"
                    id="savings"
                    placeholder="10"
                    value={this.state.searchOptions.savings}
                    onChange={e => this.onChangeValue(e, e.target.name)}
                  />

                  <Label for="keywords">Search Text</Label>
                  <Input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="hammer"
                    value={this.state.searchOptions.search}
                    onChange={e => this.onChangeValue(e, e.target.name)}
                  />
                </FormGroup>

                {/* dynamic filter */}
                {this.state.filteredLabel && this.state.filteredLabel.length ? (
                  <div className="dynamic-filter-result">
                    <Button size="sm" block disabled>
                      Matches
                    </Button>
                    <div className="label-container">
                      {this.state.filteredLabel.map(lbl => (
                        <div>
                          <Link
                            style={{ color: "rgb(160,160,160)" }}
                            to={"/chuppiGridProducts/" + lbl}
                          >
                            {lbl}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {this.state.labels ? (
                  <Button size="sm" block onClick={e => this.load()}>
                    Find Deals !
                  </Button>
                ) : (
                  "Loading..."
                )}
              </Form>
            </div>

            {this.state.brands ? (
              <div className="available-brands">
                {/*             
              {this.state.brands
                ? this.state.brands.map(brand => (
                    <Badge className="brand-label" color="secondary">
                      <Link style={{color:"white"}} to={"/chuppiGridBrand/" + brand}>{brand}</Link>
                    </Badge>
                  ))
                : null} */}

                {this.state.brands.map(brand => (
                  <Badge className="brand-label" color="link">
                    {/* <Link
                      style={{ color: "gray" }}
                      to={"/chuppiGridBrand/" + brand}
                    > */}
                    {this.state.searchOptions.search !== "" ? (
                      <Link
                        style={{ color: "rgb(160,160,160)" }}
                        to={[
                          "/chuppiGridBrand",
                          brand,
                          this.state.searchOptions.savings,
                          this.state.searchOptions.price,
                          this.state.searchOptions.search
                        ].join("/")}
                      >
                        {brand}
                      </Link>
                    ) : (
                      <Link
                        style={{ color: "rgb(160,160,160)" }}
                        to={[
                          "/chuppiGridBrand",
                          brand,
                          this.state.searchOptions.savings,
                          this.state.searchOptions.price
                        ].join("/")}
                      >
                        {brand}
                      </Link>
                    )}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          <div className="chuppiGrid">
          {/* <div className="chuppiGrid" style={{ minHeight: "84vh" }}> */}

            {this.state.data
              ? this.state.data.map((i, j) => (
                  <div key={j} className="chuppiGridPod">
                    <div className="chuppiGridBrand">
                      <a href={"/chuppiGridBrand/" + i.brand}>
                        <Badge color="dark"> {i.brand} </Badge>
                      </a>
                    </div>
                    <div className="chuppiGridItem">
                      <a className="jo" href={i.itemid}>
                        {i.productname}
                      </a>
                    </div>
                    {/* Loading images */}
                    {this.state.itemData ? (
                      this.state.itemData.currentItem ===
                      this.getitemID(i.itemid) ? (
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
                      <div className="chuppiGridWas">$ {i.was}</div>
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
                        this.setState({
                          data: null,
                          master: null,
                          brands: null,
                          searchOptions: {
                            price: 9999999,
                            savings: 1,
                            search: ""
                          }
                        });
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

export default chuppiGrid;
