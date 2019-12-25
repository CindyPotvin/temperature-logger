import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import Weathers from "./components/Weathers/Weathers";

import "semantic-ui-css/semantic.min.css";

import "./main.html";
import WeatherVizualization from "./components/Weathers/WeatherVisualization";

Meteor.startup(() => {
  ReactDOM.render(
    <div className="App">
      <h1>Temperature logger</h1>
      <Weathers />
    </div>,
    document.querySelector("#root")
  );
});
