import React, { Fragment } from "react";
import "./spinner.css";

export default () => (
  <Fragment>
    <div
      className="lds-ring"
      style={{ width: "200px", margin: "20% auto", display: "block" }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </Fragment>
);
