import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

import "semantic-ui-css/semantic.min.css";
import { dom, library } from "@fortawesome/fontawesome-svg-core";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

import "./main.html";
import WeatherVizualization from "./components/Weathers/WeatherVisualization";
import SettingsPopup from "./components/SettingsPopup";

Meteor.startup(() => {
  // Add only required symbols from fontawesome
  //https://forums.meteor.com/t/fontawesome-5-in-meteor-project/46456/6
  library.add(faCog);
  library.add(faTimes);
  dom.watch();

  ReactDOM.render(
    <div className="App">
      <div className="Banner">
        <h1>{props.t("App.title")}</h1>
        <SettingsPopup />
      </div>
      <Weathers />
    </div>,
    document.querySelector("#root")
  );
});
