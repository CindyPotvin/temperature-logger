import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import Weather from "./components/Weather/Weather";

import "./main.html";

Meteor.startup(() => {
  ReactDOM.render(
    <div className="App">
      <h1>Temperature logger</h1>
      <Weather />
    </div>,
    document.querySelector("#root")
  );
});
