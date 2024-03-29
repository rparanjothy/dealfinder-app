import React from "react";
import python from '../images/python.png'
import flask from '../images/flask.png'
import node from '../images/node.png'
import pandas from '../images/pandas.png'
import react from '../images/react.png'
import gunicorn from '../images/gunicorn.png'
import jamesbond from '../images/jamesbond.png'
import gcp from '../images/gcp.png'
import pcf from '../images/pcf.png'


class Footer extends React.Component {
  render() {
    // const footerStyle={
    //   padding:"10px",
    //   backgroundColor:"black",
    //   color:"white",
    //   textAlign:"right",
    //   bottom:"0px",
    //   position:"inherit",
    //   height:"8vh",
    //   width:"100%"
    // }
    return (
        <div className="Footer">
        <div className="Footer images">
        <div><img style={{width:"30px",height:"30px"}}src={python} alt="pythonLogo"/></div>
        <div><img style={{width:"50px",height:"30px"}}src={flask} alt="flask"/></div>
        <div><img style={{width:"50px",height:"30px"}}src={node} alt="node"/></div>
        <div><img style={{width:"50px",height:"30px"}}src={pandas} alt="pandas"/></div>
        <div><img style={{width:"30px",height:"30px"}}src={react} alt="react"/></div>
        <div><img style={{width:"50px",height:"30px"}}src={gunicorn} alt="gunicorn"/></div>
        <div><img style={{width:"30px",height:"30px"}}src={jamesbond} alt="jamesbond"/></div>
        <div><img style={{width:"30px",height:"30px"}}src={gcp} alt="gcp"/></div>
        <div><img style={{width:"30px",height:"30px"}}src={pcf} alt="pcf"/></div>

        </div>
        {/* <div>Copyright &copy; James Bond 007</div> */}
        
         
        </div>

    );
  }
}

export default Footer;
