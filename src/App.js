import React, { Component } from "react";
import "./App.css";
import Header from "./components/Header";
import DealWrapper from "./components/DealWrapper";
import Footer from "./components/Footer.js";
import BrandItemTable from "./components/BrandItemTable";
import { Route } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Chuppi from "./components/Chuppi";
import ChuppiGrid from "./components/ChuppiGrid";
import ChuppiGridBrand from "./components/ChuppiGridBrand";
import ChuppiGridLabels from "./components/ChuppiGridLables";
import ChuppiGridProducts from "./components/ChuppiGridProducts";
import ChuppiGridLabelsAll from "./components/ChuppiGridLablesAll";
import ChuppiGridAllBrands from "./components/ChuppiGridAllBrands";
import { Navbar } from "reactstrap";
import ChuppiGridLessThan50 from "./components/ChuppiGridLessThan50";

import ChuppiStat from "./components/ChuppiStat";

import AllBrands from "./components/AllBrands";

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AlwaysShow">
          <header className="App-header">
            <Header season="Holiday" />
          </header>
          <div className="navNStat">
            <div>
              <Navbar color="dark" light expand="md">
                <NavLink
                  style={{ paddingRight: "10px", color: "white" }}
                  exact
                  to="/chuppiGrid/72"
                >
                  Search Deals
                </NavLink>
                <NavLink
                  style={{ paddingRight: "10px", color: "white" }}
                  exact
                  to="/chuppiGridLabels"
                >
                  Product Categories
                </NavLink>
                <NavLink
                  style={{ paddingRight: "10px", color: "white" }}
                  exact
                  to="/chuppiGridAllBrands"
                >
                  Brands
                </NavLink>
                <NavLink
                  style={{ paddingRight: "10px", color: "white" }}
                  exact
                  to="/chuppiGridLabelsAll"
                >
                  All
                </NavLink>
              </Navbar>
            </div>
            <ChuppiStat />
          </div>
          {/* <Route exact path="/" component={DealWrapper} /></div> */}
          <Route exact path="/" component={ChuppiGrid} />
        </div>
        <Route exact path="/branditemtable/:id" component={BrandItemTable} />
        <Route exact path="/allbrands/" component={AllBrands} />
        <Route exact path="/chuppi/:msg" component={Chuppi} />
        <Route exact path="/chuppiGrid/:msg" component={ChuppiGrid} />
        <Route exact path="/chuppiGridBrand/:msg" component={ChuppiGridBrand} />
        <Route exact path="/chuppiGridLabels" component={ChuppiGridLabels} />

        <Route
          exact
          path="/chuppiGridProducts/:msg"
          component={ChuppiGridProducts}
        />
        <Route
          exact
          path="/chuppiGridAllBrands"
          component={ChuppiGridAllBrands}
        />
        <Route
          exact
          path="/chuppiGridLabelsAll"
          component={ChuppiGridLabelsAll}
        />
        <Route
          exact
          path="/chuppiGridBrand/:msg/:savings/:price/:search"
          component={ChuppiGridBrand}
        />
        <Route
          exact
          path="/chuppiGridBrand/:msg/:savings/:price"
          component={ChuppiGridBrand}
        />
        <Route exact path="/lessthan/:msg" component={ChuppiGridLessThan50} />

        <Footer />
      </div>
    );
  }
}

export default App;
