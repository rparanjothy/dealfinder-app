import React, { Component } from "react";
import axios from "axios";
import config from "../config/AppConfig.js";
import "./SliderStyle.css";
import { Badge, Button } from "reactstrap";

class ChuppiStat extends Component {
  constructor(props) {
    super(props);
    this.state = { totalitems: "Loading.." };
  }

  componentWillMount() {
    axios
      .get([config.APIURL, "stats"].join("/"))
      .then(d => d.data)
      .then(d =>
        this.setState({ totalitems: d.ct }, () => {
          console.log(this.state.totalitems);
        })
      )
      .catch(e => console.log(e));
  }
  render() {
    return <div><Badge color='dark'>{this.state.totalitems}</Badge></div>;
  }
}

export default ChuppiStat;
