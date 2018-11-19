import React, { Component } from "react";
import axios from "axios";
import config from "../config/AppConfig.js";
import "./SliderStyle.css";
import { Badge, Button } from "reactstrap";

class ChuppiImageSlider extends Component {
  constructor(props) {
    super(props);
    this.cycleBannerImages = this.cycleBannerImages.bind(this);
    this.cycleWrapper = this.cycleWrapper.bind(this);
    this.setBannerImageURLV2=this.setBannerImageURLV2.bind(this)
    this.state = { bannerItems: null, scroll: { st: 0, ed: 4 } };
    this.bannerData = null;
    this.getitemID = null;
    this.img1 = null;
    this.img2 = null;
    this.img3 = null;
    this.img4 = null;
    this.reset = this.reset.bind(this);
    this.s = 0;
    this.e = 4;
  }

  componentWillMount() {
    this.cycleWrapper();
    // console.log(this.props);
    this.bannerData = this.props.bannerData;

    //setTimeout(this.cycleBannerImages(0, 3),400);
    this.getitemID = this.props.getitemID;

    this.setState(
      { bannerItemsRender: this.props.bannerData.slice(0, 4) },
      () => {
        //this.cycleBannerImages(0, 4);
        this.setBannerImageURLV2();
        console.log("componentWillMount End");
      }
    );
  }

  cycleWrapper() {
    // var s = 0;
    // var e = 4;

    setTimeout(() => {
      const { st, ed } = this.state.scroll;
      // console.log(st, ed);

      const dd = this.props.bannerData.slice(st, ed);

      if (dd.length) {
        // dd.map((e, i) => {
        //   console.log(e.itemid, e.price, i);
        // });

        this.setState(
          {
            scrollData: dd,
            scroll: {
              st: this.state.scroll.st + 4,
              ed: this.state.scroll.ed + 4
            }
          },
          () => {
            this.setBannerImageURLV2()
            this.cycleWrapper();
          }
        );
      } else {
        console.log("Done... its empty");
      }
    }, 3000);
  }

  cycleBannerImages(s, e) {
    // console.log("cycleBannerImages-start");
    this.s = s;
    this.e = e;
    this.setState(
      {
        bannerItems: this.props.bannerData
          ? this.props.bannerData.slice(s, e)
          : null
      },
      () => {
        var { bannerItems } = this.state;
        //add img to bannerItems:
        // console.log(bannerItems.length);

        if (bannerItems) {
          bannerItems.map((e, i, bannerItems) =>
            this.updateImageUrlforBannerItem(
              this.getitemID(e.itemid),
              bannerItems,
              i
            )
          );

          this.setState({ bannerItemsRender: bannerItems }, () => {
            // console.log("imageurl set..");

            // console.log("sleeing 4 sec");

            if (bannerItems) {
              if (bannerItems.length > 0) {
                console.log("sleeing 4 sec ");
                // setTimeout(() => this.cycleBannerImages(s + 4, e + 4), 4000);
                setTimeout(() => this.cycleBannerImages(s + 4, e + 4), 4000);

                // console.log("blac...");
              } else if (bannerItems.length === 0) {
                console.log("nothing left showed all...");
              }
            } else {
              console.log("empty");
            }
          });
        }
      }
    );
  }

  setBannerImageURLV2() {
    // console.log("cycleBannerImages-start");
    this.setState(
      {
        i: 1
      },
      () => {
        //var { bannerItems } = this.state.scrollData?this.state.scrollData:null;
        //add img to bannerItems:
        // console.log(bannerItems.length);

        setTimeout(()=>{},1000)
        if (this.state.scrollData) {
          const bannerItems=this.state.scrollData;
          bannerItems.map((e, i, bannerItems) =>
            this.updateImageUrlforBannerItem(
              this.getitemID(e.itemid),
              bannerItems,
              i
            )
          );

          this.setState(
            { bannerItemsRender: bannerItems },
            () => {
              // console.log("set bannerItemsRender");
            }
          );
        }
      }
    );
  }

  updateImageUrlforBannerItem(i, e, idx) {
    const url = config.IMGURL + i + "/stores/8119/listings";

    axios
      .get(url)
      .then(response => [
        response.data.items[0].imageResources[0].urls[0].url.replace(
          "_400",
          "_300"
        ),
        response.data.items[0].invntry
      ])
      .then(d => {
        e[idx].imageurlBanner = d[0];
        e[idx].inv = d[1] > 0 ? "InStock" : "OutOfStock";
      })
      //   .then(x => console.log("x is ", x))
      .catch(err => console.log(err));
    this.setimages();
  }

  setimages() {
    if (this.state.bannerItemsRender) {
      this.state.bannerItemsRender.map(
        (e, i) => {
          switch (i) {
            case 0:
              // this.setState({ img1: e.imageurlBanner },()=>{setTimeout(()=>{},100)});
              this.img1 = e.imageurlBanner;
              this.img1Name = e.productname;
              this.img1Price = e.price;
              this.img1url = e.itemid;
              this.img1inv = e.inv;
              break;

            case 1:
              //this.setState({ img2: e.imageurlBanner });
              this.img2 = e.imageurlBanner;
              this.img2Name = e.productname;
              this.img2Price = e.price;
              this.img2url = e.itemid;
              this.img2inv = e.inv;

              break;

            case 2:
              //this.setState({ img3: e.imageurlBanner });
              this.img3 = e.imageurlBanner;
              this.img3Name = e.productname;
              this.img3Price = e.price;
              this.img3url = e.itemid;
              this.img3inv = e.inv;
              break;

            case 3:
              //this.setState({ img3: e.imageurlBanner });
              this.img4 = e.imageurlBanner;
              this.img4Name = e.productname;
              this.img4Price = e.price;
              this.img4url = e.itemid;
              this.img4inv = e.inv;
              break;
            default:
              break;
          }
        }

        // <div>{e.imageurlBanner} - {e.itemid}

        // <img src={e.imageurlBanner} alt={e.itemid}/>

        // </div>
      );
      this.setState({
        img1: this.img1,
        img2: this.img2,
        img3: this.img3,
        img4: this.img4
      });
    }

    // console.log(e.itemid)
  }

  reset(x) {
    console.log("ff");
    switch (x) {
      case 1:
        this.setState({ scroll: { st: 0, ed: 4 } }, () => {
          console.log("post reset", this.state.scroll.st, this.state.scroll.ed);
        });
        break;
      case 2:
        this.setState(
          {
            scroll: {
              st: this.state.scroll.st - 8,
              ed: this.state.scroll.ed - 8
            }
          },
          () => {
            console.log(
              "post reset",
              this.state.scroll.st,
              this.state.scroll.ed
            );
          }
        );
        break;
      case 3:
        this.setState(
          {
            scroll: {
              st: this.state.scroll.st + 8,
              ed: this.state.scroll.ed + 8
            }
          },
          () => {
            console.log(
              "post reset",
              this.state.scroll.st,
              this.state.scroll.ed
            );
          }
        );
        break;
      default:
        break;
    }
  }

  render() {
    //    console.log("Render Start");

    const { img1, img2, img3, img4 } = this.state;

    return img1 ? (
      <div className="SliderContainer reset">
        <div className="slider-item-img">
          <Button size="sm" color="dark" onClick={e => this.reset(1)}>
            replay
          </Button>
        </div>
        <div className="slider-item-img prev">
          <Button size="sm" color="dark" onClick={e => this.reset(2)}>
            &lt;
          </Button>
        </div>
        <div className="slider-item-img next">
          <Button size="sm" color="dark" onClick={e => this.reset(3)}>
            &gt;
          </Button>
        </div>
        <div className="slider-item-img">
          <img src={img1} alt="image1" />
          <div className="img-desc">
            <a className="jo" href={this.img1url}>
              {this.img1Name}
            </a>
          </div>
          <div className="img-price">
            <Badge color="s"> ${this.img1Price}</Badge>
          </div>
          <div className="img-inv">
            {this.img1inv === "InStock" ? (
              <Badge color="success">{this.img1inv}</Badge>
            ) : (
              <Badge color="danger">{this.img1inv}</Badge>
            )}
          </div>
        </div>

        <div className="slider-item-img">
          <img src={img2} alt="image2" />
          <div className="img-desc">
            <a className="jo" href={this.img2url}>
              {this.img2Name}
            </a>
          </div>
          <div className="img-price">
            <Badge color="s"> ${this.img2Price}</Badge>
          </div>
          <div className="img-inv">
            {this.img2inv === "InStock" ? (
              <Badge color="success">{this.img2inv}</Badge>
            ) : (
              <Badge color="danger">{this.img2inv}</Badge>
            )}
          </div>
        </div>
        <div className="slider-item-img">
          <img src={img3} alt="image3" />
          <div className="img-desc">
            <a className="jo" href={this.img3url}>
              {this.img3Name}
            </a>
          </div>
          <div className="img-price">
            <Badge color="s"> ${this.img3Price}</Badge>
          </div>
          <div className="img-inv">
            {this.img3inv === "InStock" ? (
              <Badge color="success">{this.img3inv}</Badge>
            ) : (
              <Badge color="danger">{this.img3inv}</Badge>
            )}
          </div>
        </div>
        <div className="slider-item-img">
          <img src={img4} alt="image4" />
          <div className="img-desc">
            <a className="jo" href={this.img4url}>
              {this.img4Name}
            </a>
          </div>
          <div className="img-price">
            <Badge color="s"> ${this.img4Price}</Badge>
          </div>
          <div className="img-inv">
            {this.img4inv === "InStock" ? (
              <Badge color="success">{this.img4inv}</Badge>
            ) : (
              <Badge color="danger">{this.img4inv}</Badge>
            )}
          </div>
        </div>
      </div>
    ) : this.state.bannerItemsRender.length >= 4 ? (
      <div className="SliderContainer">Loading Slider...</div>
    ) : null;
  }
}

export default ChuppiImageSlider;
